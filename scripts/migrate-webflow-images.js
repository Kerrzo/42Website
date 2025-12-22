import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import http from "node:http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, "../data/blog");
const IMAGES_DIR = path.join(__dirname, "../public/blog/images");
const WEBFLOW_PATTERN = /https?:\/\/uploads-ssl\.webflow\.com\/[^\s\)"']+/gi;

// Ensure images directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
  }
}

// Download image from URL
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    
    protocol
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirects
          return downloadImage(response.headers.location, filepath)
            .then(resolve)
            .catch(reject);
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
          return;
        }

        const fileStream = createWriteStream(filepath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });

        fileStream.on("error", async (err) => {
          try {
            await fs.unlink(filepath);
          } catch {}
          reject(err);
        });
      })
      .on("error", reject);
  });
}

// Generate safe filename from URL
function getFilenameFromUrl(url) {
  try {
    // Extract filename from URL
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = path.basename(pathname);
    
    // Decode URL encoding
    const decoded = decodeURIComponent(filename);
    
    // Sanitize filename (remove unsafe characters)
    const safe = decoded
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_")
      .substring(0, 200); // Limit length
    
    // If no extension, try to get from content-type or default to .jpg
    if (!safe.includes(".")) {
      return safe + ".jpg";
    }
    
    return safe;
  } catch (e) {
    // Fallback: use hash of URL
    const hash = url.split("/").pop().split("?")[0];
    return hash.substring(0, 50) + ".jpg";
  }
}

// Extract all Webflow image URLs from content
function extractWebflowUrls(content) {
  const urls = new Set();
  const matches = content.matchAll(WEBFLOW_PATTERN);
  
  for (const match of matches) {
    urls.add(match[0]);
  }
  
  return Array.from(urls);
}

// Replace Webflow URLs with local paths
function replaceWebflowUrls(content, urlMap) {
  let updated = content;
  
  for (const [webflowUrl, localPath] of Object.entries(urlMap)) {
    // Escape special regex characters in URL
    const escapedUrl = webflowUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    // Pattern 1: Frontmatter image field (image: "url" or image: 'url')
    updated = updated.replace(
      new RegExp(`(image:\\s*["'])${escapedUrl}(["'])`, "gi"),
      `$1${localPath}$2`
    );
    
    // Pattern 2: Markdown images ![alt](url)
    updated = updated.replace(
      new RegExp(`!\\[([^\\]]*)\\]\\(${escapedUrl}\\)`, "gi"),
      `![$1](${localPath})`
    );
    
    // Pattern 3: HTML img tags <img src="url">
    updated = updated.replace(
      new RegExp(`(<img[^>]+src=["'])${escapedUrl}(["'][^>]*>)`, "gi"),
      `$1${localPath}$2`
    );
    
    // Pattern 4: Plain URL in parentheses (url) - but not if it's already part of markdown
    // Only replace if it's not already part of a markdown image
    updated = updated.replace(
      new RegExp(`(?!\\!\\[)(?<!\\]\\()\\(${escapedUrl}\\)`, "gi"),
      `(${localPath})`
    );
  }
  
  return updated;
}

async function main() {
  console.log("Starting Webflow image migration...\n");
  
  // Ensure images directory exists
  await ensureDir(IMAGES_DIR);
  console.log(`✓ Created/verified images directory: ${IMAGES_DIR}\n`);
  
  // Get all MDX files
  const files = await fs.readdir(BLOG_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  
  console.log(`Found ${mdxFiles.length} MDX files to process\n`);
  
  const urlMap = {}; // Map of webflow URL -> local path
  const stats = {
    filesProcessed: 0,
    imagesFound: 0,
    imagesDownloaded: 0,
    imagesSkipped: 0,
    errors: 0,
  };
  
  // First pass: collect all unique URLs
  console.log("Pass 1: Collecting all Webflow image URLs...\n");
  for (const file of mdxFiles) {
    const filePath = path.join(BLOG_DIR, file);
    const content = await fs.readFile(filePath, "utf8");
    const urls = extractWebflowUrls(content);
    
    if (urls.length > 0) {
      stats.imagesFound += urls.length;
      for (const url of urls) {
        if (!urlMap[url]) {
          const filename = getFilenameFromUrl(url);
          const localPath = `/blog/images/${filename}`;
          urlMap[url] = localPath;
        }
      }
    }
  }
  
  console.log(`Found ${Object.keys(urlMap).length} unique Webflow images\n`);
  
  // Download all images
  console.log("Pass 2: Downloading images...\n");
  const urls = Object.keys(urlMap);
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const localPath = urlMap[url];
    const filename = path.basename(localPath);
    const filepath = path.join(IMAGES_DIR, filename);
    
    // Check if file already exists
    try {
      await fs.access(filepath);
      console.log(`  [${i + 1}/${urls.length}] Skipped (exists): ${filename}`);
      stats.imagesSkipped++;
      continue;
    } catch {
      // File doesn't exist, proceed with download
    }
    
    try {
      await downloadImage(url, filepath);
      console.log(`  [${i + 1}/${urls.length}] Downloaded: ${filename}`);
      stats.imagesDownloaded++;
    } catch (e) {
      console.error(`  [${i + 1}/${urls.length}] Error downloading ${url}: ${e.message}`);
      stats.errors++;
      // Remove from map so we don't update references to failed downloads
      delete urlMap[url];
    }
  }
  
  // Third pass: update MDX files
  console.log(`\nPass 3: Updating MDX files...\n`);
  for (const file of mdxFiles) {
    const filePath = path.join(BLOG_DIR, file);
    const content = await fs.readFile(filePath, "utf8");
    const urls = extractWebflowUrls(content);
    
    if (urls.length > 0) {
      // Filter to only URLs we successfully downloaded
      const validUrlMap = {};
      for (const url of urls) {
        if (urlMap[url]) {
          validUrlMap[url] = urlMap[url];
        }
      }
      
      if (Object.keys(validUrlMap).length > 0) {
        const updated = replaceWebflowUrls(content, validUrlMap);
        await fs.writeFile(filePath, updated, "utf8");
        console.log(`  Updated: ${file} (${Object.keys(validUrlMap).length} images)`);
        stats.filesProcessed++;
      }
    }
  }
  
  // Print summary
  console.log(`\n=== Migration Summary ===`);
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Total images found: ${stats.imagesFound}`);
  console.log(`Images downloaded: ${stats.imagesDownloaded}`);
  console.log(`Images skipped (already exist): ${stats.imagesSkipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\n✓ Migration complete!`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});


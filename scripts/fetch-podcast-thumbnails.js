import fs from "node:fs/promises";

const CONFIG_FILE = "./data/config.json";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch thumbnail URL for a single video using YouTube Data API v3
 * Returns the custom thumbnail URL if available, or null if not
 */
async function fetchVideoThumbnail(videoId, apiKey) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId}&part=snippet`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.warn(`  Warning: Failed to fetch thumbnail for ${videoId}: HTTP ${response.status}`);
            return null;
        }

        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            console.warn(`  Warning: No video data found for ${videoId}`);
            return null;
        }

        const video = data.items[0];
        const thumbnails = video.snippet?.thumbnails;

        if (!thumbnails) {
            return null;
        }

        // Check for custom thumbnail
        // The YouTube API returns thumbnails in this order: maxres > high > medium > default
        // Custom thumbnails are typically in maxres or high, and have URLs that don't match
        // the standard pattern: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
        
        // Try maxres first (highest quality, often custom)
        if (thumbnails.maxres) {
            const maxresUrl = thumbnails.maxres.url;
            // Standard YouTube thumbnail pattern
            const standardPattern = new RegExp(`https://img\\.youtube\\.com/vi/${videoId}/maxresdefault\\.jpg`);
            
            // If it doesn't match the standard pattern, it's likely custom
            if (maxresUrl && !standardPattern.test(maxresUrl)) {
                return maxresUrl;
            }
            // Even if it matches, return it - we'll check in isCustomThumbnail
            return maxresUrl;
        }

        // Fallback to high quality thumbnail
        if (thumbnails.high) {
            return thumbnails.high.url;
        }

        // Fallback to medium
        if (thumbnails.medium) {
            return thumbnails.medium.url;
        }

        return null;
    } catch (error) {
        console.warn(`  Warning: Error fetching thumbnail for ${videoId}: ${error.message}`);
        return null;
    }
}

/**
 * Check if a thumbnail URL is a custom thumbnail
 * Custom thumbnails typically don't follow the standard YouTube pattern
 * The YouTube API returns custom thumbnails in maxres.url when they exist
 */
function isCustomThumbnail(thumbnailUrl, videoId) {
    if (!thumbnailUrl) return false;
    
    // Standard YouTube thumbnail URL patterns
    const standardPatterns = [
        new RegExp(`/vi/${videoId}/(maxresdefault|hqdefault|mqdefault|sddefault|default)\\.jpg`),
        new RegExp(`/vi_webp/${videoId}/(maxresdefault|hqdefault|mqdefault|sddefault|default)\\.webp`)
    ];
    
    // If it matches standard patterns exactly, it's not custom
    for (const pattern of standardPatterns) {
        if (pattern.test(thumbnailUrl)) {
            return false;
        }
    }
    
    // If it's from i.ytimg.com but doesn't match standard patterns, it's likely custom
    // Custom thumbnails have different URL structures
    if (thumbnailUrl.includes('i.ytimg.com')) {
        // Custom thumbnails often have longer URLs with different path structures
        // They don't follow the /vi/VIDEO_ID/pattern.jpg format
        return !thumbnailUrl.includes(`/vi/${videoId}/`);
    }
    
    // If it's from a different domain, it's definitely custom
    return true;
}

/**
 * Main function to update podcast thumbnails
 */
async function main() {
    if (!YOUTUBE_API_KEY) {
        console.error("Error: YOUTUBE_API_KEY environment variable is not set.");
        console.error("Please set it before running this script:");
        console.error("  export YOUTUBE_API_KEY=your_api_key");
        console.error("  or on Windows:");
        console.error("  set YOUTUBE_API_KEY=your_api_key");
        process.exit(1);
    }

    console.log("Fetching custom thumbnails for podcasts...\n");

    // Read existing config
    let config;
    try {
        const configContent = await fs.readFile(CONFIG_FILE, "utf8");
        config = JSON.parse(configContent);
    } catch (error) {
        console.error(`Error reading ${CONFIG_FILE}: ${error.message}`);
        process.exit(1);
    }

    if (!config.podcasts || !Array.isArray(config.podcasts)) {
        console.error("Error: No podcasts array found in config.json");
        process.exit(1);
    }

    const podcasts = config.podcasts;
    let updatedCount = 0;
    let customThumbnailCount = 0;

    console.log(`Processing ${podcasts.length} podcasts...\n`);

    // Process each podcast
    for (let i = 0; i < podcasts.length; i++) {
        const podcast = podcasts[i];
        const videoId = podcast.id;

        if (!videoId) {
            console.warn(`  Skipping podcast ${i + 1}: No video ID`);
            continue;
        }

        try {
            // Fetch thumbnail
            const thumbnailUrl = await fetchVideoThumbnail(videoId, YOUTUBE_API_KEY);
            
            if (thumbnailUrl) {
                // Check if it's a custom thumbnail
                const isCustom = isCustomThumbnail(thumbnailUrl, videoId);
                
                if (isCustom) {
                    podcast.thumbnail = thumbnailUrl;
                    customThumbnailCount++;
                    console.log(`  ✓ ${i + 1}/${podcasts.length}: Custom thumbnail found for "${podcast.title}"`);
                    console.log(`     URL: ${thumbnailUrl.substring(0, 80)}...`);
                } else {
                    // Store standard thumbnails too - this ensures we have a working URL
                    // The API returns the actual working URL, which may be different from the pattern
                    podcast.thumbnail = thumbnailUrl;
                    updatedCount++;
                    console.log(`  → ${i + 1}/${podcasts.length}: Standard thumbnail stored for "${podcast.title}"`);
                    console.log(`     URL: ${thumbnailUrl.substring(0, 80)}...`);
                }
            } else {
                // Remove thumbnail if it was set but no longer available
                if (podcast.thumbnail) {
                    delete podcast.thumbnail;
                    console.log(`  - ${i + 1}/${podcasts.length}: Removed thumbnail for "${podcast.title}"`);
                } else {
                    console.log(`  ✗ ${i + 1}/${podcasts.length}: No thumbnail available for "${podcast.title}"`);
                }
            }

            // Rate limiting - YouTube API allows 100 units per 100 seconds
            // Each video request costs 1 unit, so we can do ~100 requests per 100 seconds
            // Let's be conservative and wait 200ms between requests
            await sleep(200);

        } catch (error) {
            console.error(`  ✗ Error processing "${podcast.title}": ${error.message}`);
        }
    }

    // Write updated config
    try {
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
        console.log(`\n✓ Updated ${CONFIG_FILE}`);
        console.log(`  - ${customThumbnailCount} custom thumbnails found`);
        console.log(`  - ${updatedCount} standard thumbnails stored`);
        console.log(`  - Total podcasts: ${podcasts.length}`);
        console.log(`\nNote: All thumbnails (custom and standard) are now stored in config.json`);
        console.log(`      This ensures reliable thumbnail URLs for all videos.`);
    } catch (error) {
        console.error(`\nError writing ${CONFIG_FILE}: ${error.message}`);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});


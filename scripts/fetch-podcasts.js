import fs from "node:fs/promises";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const CHANNEL_ID = "UCvOPtjSVbv8nxpYDBqmV9JA"; // 42 Interactive
const CHANNEL_URL = `https://www.youtube.com/@42interactive/videos`;
const CONFIG_FILE = "./data/config.json";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function formatDate(iso) {
    // Parse ISO date string and format it
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
        return "";
    }
}

// Check if yt-dlp is installed
async function checkYtDlp() {
    try {
        await execAsync("which yt-dlp");
        return true;
    } catch {
        return false;
    }
}

// Install yt-dlp if not available (using pip or npm)
async function ensureYtDlp() {
    const hasYtDlp = await checkYtDlp();
    if (hasYtDlp) {
        console.log("✓ yt-dlp is installed\n");
        return true;
    }

    console.log("yt-dlp not found. Attempting to install...\n");
    try {
        // Try pip install
        await execAsync("pip install yt-dlp");
        console.log("✓ yt-dlp installed via pip\n");
        return true;
    } catch (e1) {
        try {
            // Try pip3
            await execAsync("pip3 install yt-dlp");
            console.log("✓ yt-dlp installed via pip3\n");
            return true;
        } catch (e2) {
            console.error("Failed to install yt-dlp. Please install it manually:");
            console.error("  pip install yt-dlp");
            console.error("  or");
            console.error("  brew install yt-dlp (on macOS)");
            return false;
        }
    }
}

// Fetch all videos using yt-dlp
async function fetchAllVideos() {
    console.log("Fetching video list from YouTube channel...\n");

    try {
        // First, get all video IDs using flat-playlist
        const listCommand = `yt-dlp --flat-playlist --print "%(id)s" "${CHANNEL_URL}" --playlist-end 1000`;
        const { stdout: videoIds } = await execAsync(listCommand);

        const ids = videoIds.trim().split("\n").filter(id => id.trim());
        console.log(`Found ${ids.length} videos. Fetching details...\n`);

        const videos = [];

        // Fetch details for each video (batch to avoid rate limits)
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i].trim();
            if (!id) continue;

            try {
                // Get full video details as JSON
                const detailCommand = `yt-dlp --dump-json "https://www.youtube.com/watch?v=${id}" 2>/dev/null`;
                const { stdout: jsonOutput } = await execAsync(detailCommand);

                const videoData = JSON.parse(jsonOutput);

                const uploadDate = videoData.upload_date || "";
                let formattedDate = "";
                if (uploadDate && uploadDate.length >= 8) {
                    const year = uploadDate.substring(0, 4);
                    const month = uploadDate.substring(4, 6);
                    const day = uploadDate.substring(6, 8);
                    formattedDate = formatDate(`${year}-${month}-${day}`);
                }

                videos.push({
                    id: videoData.id || id,
                    title: videoData.title || "",
                    date: formattedDate,
                    description: (videoData.description || "").trim() || "TODO: add description"
                });

                if ((i + 1) % 10 === 0) {
                    console.log(`  Processed ${i + 1}/${ids.length} videos...`);
                }

                // Small delay to be nice to YouTube
                await sleep(100);
            } catch (e) {
                console.warn(`  Warning: Failed to fetch details for ${id}: ${e.message}`);
                // Add video with minimal info
                videos.push({
                    id,
                    title: `Video ${id}`,
                    date: "",
                    description: "TODO: add description"
                });
            }
        }

        return videos;
    } catch (e) {
        console.error(`Error fetching videos: ${e.message}`);
        throw e;
    }
}

// Alternative: Use YouTube Data API v3 (requires API key)
async function fetchWithAPI(apiKey) {
    console.log("Fetching videos using YouTube Data API v3...\n");

    const videos = [];
    let nextPageToken = null;
    let page = 1;

    do {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${CHANNEL_ID}&part=snippet&type=video&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();

            for (const item of data.items || []) {
                videos.push({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    date: formatDate(item.snippet.publishedAt),
                    description: item.snippet.description || "TODO: add description"
                });
            }

            nextPageToken = data.nextPageToken;
            console.log(`  Fetched page ${page}, total videos: ${videos.length}`);
            page++;

            await sleep(100); // Rate limiting
        } catch (e) {
            console.error(`Error on page ${page}: ${e.message}`);
            break;
        }
    } while (nextPageToken);

    return videos;
}

async function main() {
    console.log("Fetching all videos from 42 Interactive YouTube channel...\n");

    let podcasts = [];

    // Try yt-dlp first (no API key needed)
    const hasYtDlp = await ensureYtDlp();

    if (hasYtDlp) {
        try {
            podcasts = await fetchAllVideos();
            console.log(`✓ Fetched ${podcasts.length} videos using yt-dlp\n`);
        } catch (e) {
            console.error(`yt-dlp failed: ${e.message}\n`);
            console.log("Falling back to YouTube Data API v3...\n");

            // Check for API key in environment
            const apiKey = process.env.YOUTUBE_API_KEY;
            if (apiKey) {
                podcasts = await fetchWithAPI(apiKey);
            } else {
                console.error("No YouTube API key found. Set YOUTUBE_API_KEY environment variable.");
                console.error("Or install yt-dlp: pip install yt-dlp");
                process.exit(1);
            }
        }
    } else {
        // Try API key fallback
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (apiKey) {
            podcasts = await fetchWithAPI(apiKey);
        } else {
            console.error("Please either:");
            console.error("  1. Install yt-dlp: pip install yt-dlp");
            console.error("  2. Set YOUTUBE_API_KEY environment variable");
            process.exit(1);
        }
    }

    if (podcasts.length === 0) {
        console.error("No videos found!");
        process.exit(1);
    }

    // Sort by date (newest first)
    podcasts.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        try {
            return new Date(b.date) - new Date(a.date);
        } catch {
            return 0;
        }
    });

    // Read existing config to preserve other fields
    let config;
    try {
        const configContent = await fs.readFile(CONFIG_FILE, "utf8");
        config = JSON.parse(configContent);
    } catch (e) {
        console.warn(`Warning: Could not read ${CONFIG_FILE}, creating new config`);
        config = {};
    }

    // Update podcasts array while preserving other fields
    config.podcasts = podcasts;

    // Write updated config
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
    console.log(`✓ Updated ${CONFIG_FILE} with ${podcasts.length} podcasts`);

    // Show first few podcasts as preview
    console.log(`\nFirst 10 podcasts:`);
    podcasts.slice(0, 10).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.title} (${p.date || "No date"})`);
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

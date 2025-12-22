import fs from "node:fs/promises";

const CHANNEL_ID = "UCvOPtjSVbv8nxpYDBqmV9JA"; // 42 Interactive
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CONFIG_FILE = "./data/config.json";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function extractVideoId(url) {
    // Extract video ID from YouTube URL
    const patterns = [
        /[?&]v=([^&]+)/,
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtu\.be\/([^?&]+)/,
        /\/videos\/([^?&]+)/
    ];
    for (const pattern of patterns) {
        const m = pattern.exec(url);
        if (m?.[1]) return m[1];
    }
    return null;
}

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

async function fetchRSS() {
    console.log(`Fetching RSS feed from YouTube...`);
    const response = await fetch(RSS_URL);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for RSS feed`);
    }
    const xml = await response.text();
    return xml;
}

function parseRSS(xml) {
    const videos = [];

    // Parse XML to extract video entries
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null) {
        const entry = match[1];

        // Extract video ID from yt:videoId
        const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        if (!videoIdMatch) continue;
        const id = videoIdMatch[1];

        // Extract title
        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        const title = titleMatch ? titleMatch[1] : "";

        // Extract published date
        const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
        const published = publishedMatch ? publishedMatch[1] : "";

        // Extract description (from media:description or content)
        const descMatch = entry.match(/<media:description[^>]*>([^<]+)<\/media:description>/) ||
            entry.match(/<content[^>]*>([^<]+)<\/content>/);
        const description = descMatch ? descMatch[1].trim() : "";

        videos.push({
            id,
            title: title.trim(),
            date: formatDate(published),
            description: description || "TODO: add description"
        });
    }

    return videos;
}

async function main() {
    console.log("Fetching all videos from 42 Interactive YouTube channel...\n");

    try {
        const xml = await fetchRSS();
        const podcasts = parseRSS(xml);

        console.log(`Found ${podcasts.length} videos.\n`);

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
        console.log(`\nFirst 5 podcasts:`);
        podcasts.slice(0, 5).forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.title} (${p.date})`);
        });

    } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

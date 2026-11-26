import type { APIRoute } from "astro";

/**
 * sitemap.xml: canonical, indexable public pages only.
 *
 * - Static pages come from src/pages (dynamic routes, 404 and creds are skipped).
 * - Blog posts come from data/blog and use their publish date as lastmod.
 * - Redirect-only routes (see astro.config.mjs) are not in src/pages, so they never appear.
 * - Pages that set `noindex` in BaseLayout must also be listed in SKIP below.
 */
const SKIP = new Set(["/404/", "/creds/"]);

const pageFiles = import.meta.glob("../pages/**/*.astro");
const blogPosts = import.meta.glob("../../data/blog/*.mdx", {
    eager: true,
    import: "frontmatter",
}) as Record<string, { publishedAt?: string }>;

const xmlEscape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const toDate = (value?: string) => {
    if (!value) return undefined;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
};

export const GET: APIRoute = ({ site }) => {
    const base = site ?? new URL("https://42interactive.com");
    const entries: { loc: string; lastmod?: string }[] = [];

    for (const file of Object.keys(pageFiles)) {
        // "./what-we-do/index.astro" (or "../pages/...") -> "/what-we-do/"
        let route = file.replace(/^(\.\.\/pages|\.)/, "").replace(/\.astro$/, "");
        if (route.includes("[")) continue; // dynamic routes are listed below
        route = route.replace(/\/index$/, "") + "/";
        if (SKIP.has(route)) continue;
        entries.push({ loc: new URL(route, base).href });
    }

    for (const [file, frontmatter] of Object.entries(blogPosts)) {
        const slug = file.split("/").pop()!.replace(/\.mdx$/, "");
        entries.push({
            loc: new URL(`/blog/${slug}/`, base).href,
            lastmod: toDate(frontmatter.publishedAt),
        });
    }

    entries.sort((a, b) => a.loc.localeCompare(b.loc));

    const body = entries
        .map(
            (e) =>
                `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>${
                    e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""
                }\n  </url>`,
        )
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

    return new Response(xml, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
};

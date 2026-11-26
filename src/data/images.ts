import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Blog hero images keep their original PNG/JPG for link previews (og:image),
 * and have a smaller .webp copy next to them for display on the page.
 * Returns the .webp copy when it exists, otherwise the original path.
 */
export function displayImage(path?: string): string | undefined {
    if (!path || !path.startsWith("/")) return path;
    const webp = path.replace(/\.(png|jpe?g)$/i, ".webp");
    if (webp === path) return path;
    return existsSync(join(process.cwd(), "public", decodeURI(webp))) ? webp : path;
}

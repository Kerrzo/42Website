#!/usr/bin/env node
/**
 * Rename overly-long blog image filenames (especially Webflow GUID-prefixed ones)
 * and update all references across the repo.
 *
 * Usage:
 *   node scripts/rename-blog-images.cjs --list /absolute/path/to/long-filenames.txt --dry-run
 *   node scripts/rename-blog-images.cjs --list /absolute/path/to/long-filenames.txt
 *
 *   # Rename all candidates in a directory (default: public/blog/images)
 *   node scripts/rename-blog-images.cjs --all --dry-run
 *   node scripts/rename-blog-images.cjs --all
 *
 * Options:
 *   --dir  /abs/path/to/dir   (defaults to <repo>/public/blog/images)
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const getArgValue = (flag) => {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
};

const listPath = getArgValue("--list");
const useAll = args.includes("--all");
const dirArg = getArgValue("--dir");
const isDryRun = args.includes("--dry-run");

if (!useAll && !listPath) {
  console.error("Missing required --list (or pass --all)");
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, "..");
const publicImagesDir = dirArg
  ? path.resolve(dirArg)
  : path.join(repoRoot, "public", "blog", "images");

if (!fs.existsSync(publicImagesDir)) {
  console.error(`Missing expected directory: ${publicImagesDir}`);
  process.exit(1);
}

/** @returns {string[]} */
function readListFile(p) {
  const raw = fs.readFileSync(p, "utf8");
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const pipeIdx = line.indexOf("|");
      if (pipeIdx === -1) return line;
      return line.slice(pipeIdx + 1).trim();
    });
}

function findActualFilenameFromListEntry(relPath) {
  const fileNameFromList = path.basename(relPath);
  const absFromList = path.join(repoRoot, relPath);

  if (fs.existsSync(absFromList)) return fileNameFromList;

  // If list entry is truncated (e.g. .jp / .jpe / trailing '.'), match via GUID prefix.
  const base = fileNameFromList;
  const guid = base.split("_")[0];
  if (!guid || guid.length < 10) return null;

  const candidates = fs
    .readdirSync(publicImagesDir)
    .filter((f) => f.startsWith(`${guid}_`));

  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) {
    // Prefer exact basename match if possible, otherwise choose the longest (most likely original).
    const exact = candidates.find((c) => c === fileNameFromList);
    return exact ?? candidates.sort((a, b) => b.length - a.length)[0];
  }
  return null;
}

function shortenBaseName(originalBase) {
  // Strip Webflow-style GUID prefix(es): 24-32 hex chars + underscore.
  // Some exports contain multiple nested GUID prefixes.
  let base = originalBase;
  while (/^[0-9a-f]{24,32}_/i.test(base)) {
    base = base.replace(/^[0-9a-f]{24,32}_/i, "");
  }

  // If the filename contains a big SEO tail starting with "-42-interactive-", drop it.
  const tailIdx = base.indexOf("-42-interactive-");
  if (tailIdx !== -1) base = base.slice(0, tailIdx);

  // Also remove a leading "42-interactive-" if present.
  base = base.replace(/^42-interactive-/, "");

  // Cleanup: collapse repeated dashes, trim.
  base = base
    .replace(/--+/g, "-")
    .replace(/-+$/g, "")
    .replace(/^-+/g, "")
    .trim();

  // Lowercase for consistency.
  base = base.toLowerCase();

  if (!base) return "image";

  // Truncate to a reasonable length while keeping whole tokens.
  const MAX_LEN = 80;
  if (base.length <= MAX_LEN) return base;

  const tokens = base.split("-").filter(Boolean);
  let out = "";
  for (const t of tokens) {
    const next = out ? `${out}-${t}` : t;
    if (next.length > MAX_LEN) break;
    out = next;
  }
  return out || tokens[0] || "image";
}

function isCandidateFilename(fileName) {
  return (
    /^[0-9a-f]{24,32}_/i.test(fileName) ||
    fileName.includes("-42-interactive-") ||
    fileName.startsWith("42-interactive-") ||
    fileName.endsWith(".")
  );
}

function getCandidatesFromDir(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => fs.statSync(path.join(dir, f)).isFile())
    .filter(isCandidateFilename);
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return [
    ".mdx",
    ".md",
    ".html",
    ".css",
    ".js",
    ".ts",
    ".astro",
    ".json",
    ".txt",
    ".xml",
    ".svg",
  ].includes(ext);
}

function walkFiles(dir, ignoreNames) {
  /** @type {string[]} */
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ignoreNames.has(ent.name)) continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...walkFiles(abs, ignoreNames));
    } else {
      out.push(abs);
    }
  }
  return out;
}

const listEntries = useAll ? [] : readListFile(listPath);

/** @type {{old: string, next: string}[]} */
const mapping = [];

const existingFiles = new Set(fs.readdirSync(publicImagesDir));
const plannedNewNames = new Set();

const inputs = useAll ? getCandidatesFromDir(publicImagesDir) : listEntries;

for (const input of inputs) {
  let actual = null;
  let guidPrefix = null;

  if (useAll) {
    actual = input;
    guidPrefix = /^[0-9a-f]{24,32}_/i.test(actual) ? actual.split("_")[0] : null;
  } else {
    const rel = input;
    if (!rel.includes("public/blog/images/")) continue;
    actual = findActualFilenameFromListEntry(rel);
    if (!actual) {
      console.warn(`[skip] Could not resolve actual file for list entry: ${rel}`);
      continue;
    }
    guidPrefix = actual.split("_")[0];
  }

  if (!existingFiles.has(actual)) {
    console.warn(`[skip] File not found in public/blog/images: ${actual}`);
    continue;
  }

  let ext = path.extname(actual);
  let base = path.basename(actual, ext);

  // Handle edge case: filenames ending with a trailing '.' (Windows-hostile).
  // Node reports extname('.') as '.', so normalise to a jpeg extension.
  if (ext === "." || ext === "") {
    ext = ".jpg";
  }

  const shortBase = shortenBaseName(base);

  let candidate = `${shortBase}${ext}`;

  // Disambiguate with a short suffix if needed (avoid reintroducing long GUIDs).
  const shortSuffix = guidPrefix ? guidPrefix.slice(0, 6).toLowerCase() : null;

  if (
    (existingFiles.has(candidate) && candidate !== actual) ||
    plannedNewNames.has(candidate)
  ) {
    if (shortSuffix) {
      candidate = `${shortBase}-${shortSuffix}${ext}`;
    }
  }

  let n = 2;
  while (
    (existingFiles.has(candidate) && candidate !== actual) ||
    plannedNewNames.has(candidate)
  ) {
    const stem = path.basename(candidate, ext);
    candidate = `${stem}-${n}${ext}`;
    n += 1;
  }

  if (candidate === actual) continue;

  plannedNewNames.add(candidate);
  mapping.push({ old: actual, next: candidate });
}

mapping.sort((a, b) => a.old.localeCompare(b.old));

if (mapping.length === 0) {
  console.log("No renames required (no matching files or all already short).");
  process.exit(0);
}

console.log(`Planned renames (${mapping.length}):`);
if (mapping.length <= 200) {
  for (const m of mapping) console.log(`- ${m.old} -> ${m.next}`);
} else {
  for (const m of mapping.slice(0, 60)) console.log(`- ${m.old} -> ${m.next}`);
  console.log(`... (${mapping.length - 60} more; see mapping file)`);
}

const mappingOutPath = path.join(
  repoRoot,
  "scripts",
  "rename-blog-images.mapping.json",
);
fs.writeFileSync(mappingOutPath, JSON.stringify(mapping, null, 2) + "\n", "utf8");
console.log(`Wrote mapping: ${mappingOutPath}`);

if (isDryRun) {
  console.log("Dry-run: no files renamed and no references updated.");
  process.exit(0);
}

// 1) Rename the files
for (const m of mapping) {
  const from = path.join(publicImagesDir, m.old);
  const to = path.join(publicImagesDir, m.next);
  fs.renameSync(from, to);
}

// 2) Update references across repo (local blog image paths only)
const includeRoots = [
  path.join(repoRoot, "data"),
  path.join(repoRoot, "src"),
  path.join(repoRoot, "public", "data"),
  path.join(repoRoot, "public", "blog"),
  path.join(repoRoot, "dist"),
];

let filesScanned = 0;
let filesChanged = 0;

for (const root of includeRoots) {
  if (!fs.existsSync(root)) continue;

  // Ignore binary image folders while scanning text.
  const ignoreNames = new Set(["node_modules", ".git"]);
  if (root.endsWith(path.join("public", "blog"))) {
    ignoreNames.add("images");
  }

  const files = walkFiles(root, ignoreNames).filter(isTextFile);
  for (const file of files) {
    filesScanned += 1;
    let content = fs.readFileSync(file, "utf8");
    let changed = false;

    for (const m of mapping) {
      const patterns = [
        `public/blog/images/${m.old}`,
        `/blog/images/${m.old}`,
        `blog/images/${m.old}`,
      ];
      for (const p of patterns) {
        if (content.includes(p)) {
          const np = p.replace(m.old, m.next);
          content = content.split(p).join(np);
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(file, content, "utf8");
      filesChanged += 1;
    }
  }
}

console.log(
  `Done. Renamed ${mapping.length} images. Updated references in ${filesChanged}/${filesScanned} files.`,
);



/**
 * sync-articles.mjs
 *
 * Fetches all published articles from glatinone/devto-autopublish,
 * converts their frontmatter to the portfolio format, and writes
 * them into content/posts/.
 *
 * Run:  node scripts/sync-articles.mjs
 * Env:  SYNC_TOKEN  (optional GitHub PAT for higher rate limits)
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const SOURCE    = "glatinone/devto-autopublish";
const API_BASE  = "https://api.github.com";

fs.mkdirSync(POSTS_DIR, { recursive: true });

/* ── GitHub API helpers ───────────────────────────────────────── */

function ghHeaders() {
  const h = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "personal-portfolio-sync/1.0",
  };
  if (process.env.SYNC_TOKEN) h.Authorization = `Bearer ${process.env.SYNC_TOKEN}`;
  return h;
}

async function ghGet(url) {
  const res = await fetch(url, { headers: ghHeaders() });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}

async function fetchRaw(downloadUrl) {
  const res = await fetch(downloadUrl, { headers: ghHeaders() });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${downloadUrl}`);
  return res.text();
}

/* ── Frontmatter conversion ───────────────────────────────────── */

const TAG_CATEGORY = {
  security:    "Security",
  malware:     "Malware",
  "red-team":  "Red Teaming",
  redteam:     "Red Teaming",
  osint:       "OSINT",
  "bug-bounty":"Bug Bounty",
  bugbounty:   "Bug Bounty",
  pentest:     "Pentesting",
  pentesting:  "Pentesting",
  ctf:         "CTF",
  reverse:     "Reverse Engineering",
  webdev:      "Development",
  javascript:  "Development",
  typescript:  "Development",
  python:      "Development",
  react:       "Development",
  nextjs:      "Development",
  devops:      "DevOps",
  cloud:       "Cloud",
  cloudflare:  "DevOps",
  docker:      "DevOps",
  github:      "DevOps",
  tutorial:    "Tutorial",
  beginners:   "Tutorial",
  career:      "Career",
  productivity:"Productivity",
  ai:          "AI",
};

const CATEGORY_GRADIENT = {
  Malware:              "malware",
  "Red Teaming":        "redteam",
  OSINT:                "osint",
  "Bug Bounty":         "bugbounty",
  Security:             "security",
  Development:          "default",
  DevOps:               "default",
  Tutorial:             "default",
  Cloud:                "osint",
  AI:                   "security",
};

function parseTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).map(t => t.trim()).filter(Boolean);
  return String(raw).split(",").map(t => t.trim()).filter(Boolean);
}

function deriveCategories(tags) {
  const cats = [...new Set(
    tags.map(t => TAG_CATEGORY[t.toLowerCase()]).filter(Boolean)
  )];
  return cats.length ? cats : ["Security"];
}

/** Very small YAML subset parser — handles the fields we care about */
function parseYamlFrontmatter(block) {
  const fm = {};
  for (const line of block.split("\n")) {
    const colon = line.indexOf(":");
    if (colon < 1) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    val = val.replace(/^["']|["']$/g, ""); // strip surrounding quotes
    fm[key] = val;
  }
  return fm;
}

function extractFrontmatterAndBody(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: raw };
  return { fm: parseYamlFrontmatter(match[1]), body: match[2].trim() };
}

function dateFromFilename(filename) {
  const m = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : new Date().toISOString().split("T")[0];
}

function slugFromFilename(filename) {
  return filename
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\.mdx?$/, "");
}

function buildPortfolioFrontmatter(fm, filename) {
  const tags       = parseTags(fm.tags);
  const categories = deriveCategories(tags);
  const gradient   = CATEGORY_GRADIENT[categories[0]] ?? "default";
  const date       = dateFromFilename(filename);

  const lines = [
    "---",
    `title: "${(fm.title ?? "Untitled").replace(/"/g, '\\"')}"`,
    fm.description
      ? `description: "${fm.description.replace(/"/g, '\\"')}"`
      : 'description: ""',
    `date: "${date}"`,
    `categories: [${categories.map(c => `"${c}"`).join(", ")}]`,
    `tags: [${tags.map(t => `"${t}"`).join(", ")}]`,
    `coverGradient: "${gradient}"`,
    fm.cover_image ? `coverImage: "${fm.cover_image}"` : null,
    fm.devto_id    ? `devtoId: ${fm.devto_id}`         : null,
    `synced: true`,
    "---",
  ].filter(Boolean);

  return lines.join("\n");
}

/* ── Main ─────────────────────────────────────────────────────── */

async function main() {
  console.log(`Fetching articles list from ${SOURCE}…`);

  const files = await ghGet(`${API_BASE}/repos/${SOURCE}/contents/articles`);
  const mdFiles = files.filter(
    f => f.type === "file" && f.name.endsWith(".md") && !f.name.startsWith("_")
  );

  console.log(`Found ${mdFiles.length} article(s).`);

  let synced = 0, skipped = 0, unchanged = 0;

  for (const file of mdFiles) {
    const raw = await fetchRaw(file.download_url);
    const { fm, body } = extractFrontmatterAndBody(raw);

    // Skip drafts with no devto_id (never published anywhere)
    const isPublished = fm.published === "true" || fm.published === true;
    const hasDevtoId  = Boolean(fm.devto_id);
    if (!isPublished && !hasDevtoId) {
      console.log(`  [draft]    ${file.name}`);
      skipped++;
      continue;
    }

    const slug    = slugFromFilename(file.name);
    const outFile = path.join(POSTS_DIR, `${slug}.md`);
    const newFM   = buildPortfolioFrontmatter(fm, file.name);
    const output  = `${newFM}\n\n${body}\n`;

    // Skip unchanged files
    if (fs.existsSync(outFile) && fs.readFileSync(outFile, "utf8") === output) {
      console.log(`  [ok]       ${file.name}`);
      unchanged++;
      continue;
    }

    fs.writeFileSync(outFile, output, "utf8");
    console.log(`  [synced]   ${file.name} → ${slug}.md`);
    synced++;
  }

  console.log(`\nDone. synced=${synced} unchanged=${unchanged} skipped=${skipped}`);
}

main().catch(err => {
  console.error("Sync failed:", err.message);
  process.exit(1);
});

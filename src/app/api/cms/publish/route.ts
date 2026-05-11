/**
 * POST /api/cms/publish
 *
 * Commits a new or updated article to glatinone/devto-autopublish.
 * The existing GitHub Actions workflow in that repo picks it up
 * and publishes to dev.to automatically.
 *
 * Required env vars:
 *   CMS_SECRET          – password for the admin editor
 *   GITHUB_TOKEN_CMS    – PAT with contents:write on devto-autopublish
 */

import { NextRequest, NextResponse } from "next/server";

const CMS_SECRET     = process.env.CMS_SECRET;
const GITHUB_TOKEN   = process.env.GITHUB_TOKEN_CMS;
const TARGET_REPO    = "glatinone/devto-autopublish";
const TARGET_BRANCH  = "main";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 60);
}

function buildDevtoFrontmatter(fields: {
  title: string;
  description: string;
  tags: string;
  published: boolean;
  coverImage?: string;
  existingDevtoId?: number;
}): string {
  const lines = [
    "---",
    `title: "${fields.title.replace(/"/g, '\\"')}"`,
    `published: ${fields.published}`,
    `tags: ${fields.tags}`,
    fields.description
      ? `description: "${fields.description.replace(/"/g, '\\"')}"`
      : null,
    fields.coverImage ? `cover_image: "${fields.coverImage}"` : null,
    fields.existingDevtoId ? `devto_id: ${fields.existingDevtoId}` : null,
    "---",
  ].filter(Boolean);
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  // Verify CMS password
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace("Bearer ", "");

  if (!CMS_SECRET || token !== CMS_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN_CMS not configured on server" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const {
    title,
    description = "",
    tags = "",
    published = false,
    content = "",
    coverImage = "",
    existingFilename = "",   // set when updating an existing article
    existingDevtoId,
  } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const date     = new Date().toISOString().split("T")[0];
  const slug     = slugify(title);
  const filename = existingFilename || `${date}-${slug}.md`;
  const filepath = `articles/${filename}`;

  const frontmatter = buildDevtoFrontmatter({
    title,
    description,
    tags,
    published,
    coverImage: coverImage || undefined,
    existingDevtoId,
  });

  const fileContent = `${frontmatter}\n\n${content.trim()}\n`;
  const encoded     = Buffer.from(fileContent).toString("base64");

  // Check if file already exists (needed for sha when updating)
  const ghApiUrl = `https://api.github.com/repos/${TARGET_REPO}/contents/${filepath}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  let existingSha: string | undefined;
  try {
    const check = await fetch(`${ghApiUrl}?ref=${TARGET_BRANCH}`, { headers: ghHeaders });
    if (check.ok) {
      const data = await check.json();
      existingSha = data.sha;
    }
  } catch {
    // File does not exist yet — that's fine
  }

  const commitBody: Record<string, unknown> = {
    message: `${existingSha ? "update" : "feat"}: article "${title}"`,
    content: encoded,
    branch: TARGET_BRANCH,
  };
  if (existingSha) commitBody.sha = existingSha;

  const res = await fetch(ghApiUrl, {
    method: "PUT",
    headers: ghHeaders,
    body: JSON.stringify(commitBody),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    return NextResponse.json(
      { error: `GitHub API error: ${err.message}` },
      { status: res.status }
    );
  }

  const result = await res.json();
  return NextResponse.json({
    ok: true,
    filename,
    commitUrl: result.commit?.html_url,
    message: published
      ? "Article queued for dev.to publishing via GitHub Actions."
      : "Draft saved to devto-autopublish repo.",
  });
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface Post {
  slug: string;
  title: string;
  description: string;
  content: string; // HTML
  rawContent: string; // Markdown
  date: string;
  dateFormatted: string;
  categories: string[];
  tags: string[];
  coverGradient?: string;
  coverImage?: string;
  readingTime: number;
  source: "local" | "devto";
  devtoUrl?: string;
}

export interface PostMeta extends Omit<Post, "content" | "rawContent"> {}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}

export async function getAllLocalPosts(): Promise<Post[]> {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const html = await markdownToHtml(content);
      const rt = readingTime(content);

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        content: html,
        rawContent: content,
        date: data.date ?? new Date().toISOString(),
        dateFormatted: formatDate(data.date ?? new Date().toISOString()),
        categories: data.categories ?? [],
        tags: data.tags ?? [],
        coverGradient: data.coverGradient,
        coverImage: data.coverImage,
        readingTime: Math.ceil(rt.minutes),
        source: "local" as const,
      };
    })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllLocalPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllPosts(): Promise<Post[]> {
  const local = await getAllLocalPosts();
  // dev.to posts merged in at build time — see lib/devto.ts
  return local;
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllPosts();
  const map = new Map<string, number>();
  posts.forEach((p) =>
    p.categories.forEach((c) => map.set(c, (map.get(c) ?? 0) + 1))
  );
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllPosts();
  const map = new Map<string, number>();
  posts.forEach((p) =>
    p.tags.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1))
  );
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getArchives(): Promise<{ year: number; count: number }[]> {
  const posts = await getAllPosts();
  const map = new Map<number, number>();
  posts.forEach((p) => {
    const year = new Date(p.date).getFullYear();
    map.set(year, (map.get(year) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) =>
    p.categories.map((c) => c.toLowerCase()).includes(category.toLowerCase())
  );
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export async function getRelatedPosts(current: Post, limit = 4): Promise<PostMeta[]> {
  const all = await getAllPosts();
  const scored = all
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const catScore = p.categories.filter((c) =>
        current.categories.includes(c)
      ).length * 2;
      const tagScore = p.tags.filter((t) => current.tags.includes(t)).length;
      return { post: p, score: catScore + tagScore };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => {
      const { content: _c, rawContent: _r, ...meta } = post;
      return meta as PostMeta;
    });

  // Fill up with recent posts if not enough related ones
  if (scored.length < limit) {
    const existing = new Set(scored.map((p) => p.slug));
    const recent = all
      .filter((p) => p.slug !== current.slug && !existing.has(p.slug))
      .slice(0, limit - scored.length)
      .map(({ content: _c, rawContent: _r, ...meta }) => meta as PostMeta);
    return [...scored, ...recent];
  }
  return scored;
}

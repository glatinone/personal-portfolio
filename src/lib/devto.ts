/**
 * dev.to API integration
 * Fetches published articles from dev.to and normalizes them into Post format.
 * Set DEVTO_USERNAME in your environment to enable.
 *
 * To use: add DEVTO_USERNAME=yourusername to .env.local
 */

import type { Post } from "./posts";

const DEVTO_USERNAME = process.env.DEVTO_USERNAME ?? "glatinone";
const DEVTO_API = "https://dev.to/api";

interface DevtoArticle {
  id: number;
  title: string;
  description: string;
  published_at: string;
  tag_list: string[];
  cover_image: string | null;
  url: string;
  slug: string;
  reading_time_minutes: number;
  body_html?: string;
}

function deriveCategories(tags: string[]): string[] {
  // Map dev.to tags to blog categories
  const mapping: Record<string, string> = {
    security: "Security",
    malware: "Malware",
    "red-team": "Red Teaming",
    redteam: "Red Teaming",
    osint: "OSINT",
    "bug-bounty": "Bug Bounty",
    bugbounty: "Bug Bounty",
    pentest: "Pentesting",
    ctf: "CTF",
    reverse: "Reverse Engineering",
  };
  const categories = new Set<string>();
  tags.forEach((t) => {
    const key = t.toLowerCase();
    if (mapping[key]) categories.add(mapping[key]);
  });
  return categories.size > 0 ? Array.from(categories) : ["Security"];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export async function getDevtoPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${DEVTO_API}/articles?username=${DEVTO_USERNAME}&per_page=30`,
      {
        next: { revalidate: 3600 }, // ISR: revalidate every hour
      }
    );

    if (!res.ok) return [];

    const articles: DevtoArticle[] = await res.json();

    return articles.map((a) => ({
      slug: `devto-${a.slug}`,
      title: a.title,
      description: a.description ?? "",
      content: a.body_html ?? "",
      rawContent: "",
      date: a.published_at,
      dateFormatted: formatDate(a.published_at),
      categories: deriveCategories(a.tag_list),
      tags: a.tag_list,
      coverImage: a.cover_image ?? undefined,
      readingTime: a.reading_time_minutes,
      source: "devto" as const,
      devtoUrl: a.url,
    }));
  } catch {
    // Silently fail if dev.to is unreachable during build
    return [];
  }
}

export async function getDevtoPostBySlug(slug: string): Promise<Post | null> {
  try {
    // strip "devto-" prefix
    const devtoSlug = slug.replace(/^devto-/, "");
    const res = await fetch(
      `${DEVTO_API}/articles/${DEVTO_USERNAME}/${devtoSlug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const a: DevtoArticle = await res.json();

    return {
      slug: `devto-${a.slug}`,
      title: a.title,
      description: a.description ?? "",
      content: a.body_html ?? "",
      rawContent: "",
      date: a.published_at,
      dateFormatted: formatDate(a.published_at),
      categories: deriveCategories(a.tag_list),
      tags: a.tag_list,
      coverImage: a.cover_image ?? undefined,
      readingTime: a.reading_time_minutes,
      source: "devto" as const,
      devtoUrl: a.url,
    };
  } catch {
    return null;
  }
}

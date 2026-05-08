import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Kiell Tampubolon — Cybersecurity Engineer",
  description: "Offensive security, red teaming, malware analysis, and open-source security tooling.",
};

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <>
      <div className="article-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <footer className="site-footer">
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">
          Cybersecurity Engineer · Indonesia ·{" "}
          <a href="https://github.com/glatinone" target="_blank" rel="noopener noreferrer">
            @glatinone
          </a>
        </div>
      </footer>
    </>
  );
}

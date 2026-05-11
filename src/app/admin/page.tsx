"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ── Constants ────────────────────────────────────────────────── */

const TAG_SUGGESTIONS = [
  "security", "malware", "osint", "bug-bounty", "red-team", "ctf",
  "pentest", "reverse", "webdev", "javascript", "typescript", "python",
  "react", "nextjs", "devops", "cloudflare", "docker", "github",
  "tutorial", "beginners", "career", "productivity", "ai",
];

const COVER_GRADIENTS = [
  { value: "malware",   label: "Malware (deep red)" },
  { value: "redteam",   label: "Red Team (deep green)" },
  { value: "osint",     label: "OSINT (deep blue)" },
  { value: "bugbounty", label: "Bug Bounty (amber)" },
  { value: "security",  label: "Security (slate blue)" },
  { value: "default",   label: "Default (dark gray)" },
];

const PREVIEW_DEBOUNCE = 600;

/* ── Icons ────────────────────────────────────────────────────── */

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

/* ── Password Gate ────────────────────────────────────────────── */

function PasswordGate({ onAuth }: { onAuth: (secret: string) => void }) {
  const [pw, setPw]     = useState("");
  const [error, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    // Simple local check: attempt a preview request using the password as auth
    try {
      const res = await fetch("/api/cms/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pw}`,
        },
        body: JSON.stringify({ title: "__auth_check__", content: "", tags: "" }),
      });
      if (res.status === 401) {
        setErr("Incorrect password.");
      } else {
        // 500 = token ok but env not configured, still let them in
        localStorage.setItem("cms_token", pw);
        onAuth(pw);
      }
    } catch {
      setErr("Network error. Is the dev server running?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "var(--body-background)", zIndex: 9999,
    }}>
      <div style={{
        background: "var(--card-background)",
        boxShadow: "var(--shadow-l2)",
        borderRadius: "var(--card-border-radius)",
        padding: "40px 44px",
        width: "100%", maxWidth: 380,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      }}>
        <div style={{ color: "var(--category-color)" }}><LockIcon /></div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--card-text-color-main)" }}>
            Admin Access
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: "0.875rem", color: "var(--card-text-color-tertiary)" }}>
            Enter your CMS password to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              width: "100%", padding: "10px 14px",
              background: "var(--tag-background)",
              border: `1px solid ${error ? "#dc2626" : "var(--tag-border-color)"}`,
              borderRadius: "var(--tag-border-radius)",
              color: "var(--card-text-color-main)",
              fontSize: "0.9375rem", outline: "none",
              boxSizing: "border-box",
            }}
          />
          {error && (
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "#dc2626" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={busy || !pw}
            style={{
              padding: "10px", borderRadius: "var(--tag-border-radius)",
              background: "var(--category-color)", color: "#fff",
              border: "none", cursor: "pointer",
              fontSize: "0.9375rem", fontWeight: 600,
              opacity: busy || !pw ? 0.6 : 1,
            }}
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Tag input ────────────────────────────────────────────────── */

function TagInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showSug, setShowSug] = useState(false);
  const existing = value.split(",").map(t => t.trim()).filter(Boolean);
  const filtered = TAG_SUGGESTIONS.filter(
    s => !existing.includes(s) && (existing.length === 0 || s.includes(existing.at(-1) ?? ""))
  ).slice(0, 8);

  function addTag(tag: string) {
    const prev = value.split(",").map(t => t.trim()).filter(Boolean);
    // replace the partial last entry with the selected tag
    prev[prev.length - 1] = tag;
    onChange(prev.join(", ") + ", ");
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setShowSug(true)}
        onBlur={() => setTimeout(() => setShowSug(false), 150)}
        placeholder="security, malware, tutorial"
        style={{
          width: "100%", padding: "8px 12px",
          background: "var(--tag-background)",
          border: "1px solid var(--tag-border-color)",
          borderRadius: "var(--tag-border-radius)",
          color: "var(--card-text-color-main)",
          fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
        }}
      />
      {showSug && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "var(--card-background)",
          border: "1px solid var(--card-separator-color)",
          borderRadius: "var(--tag-border-radius)",
          boxShadow: "var(--shadow-l1)",
          zIndex: 100, display: "flex", flexWrap: "wrap", gap: 6, padding: 10,
        }}>
          {filtered.map(s => (
            <button key={s} onMouseDown={() => addTag(s)} style={{
              background: "var(--tag-background)", border: "1px solid var(--tag-border-color)",
              borderRadius: "var(--tag-border-radius)", padding: "3px 10px",
              fontSize: "0.8rem", color: "var(--card-text-color-secondary)",
              cursor: "pointer",
            }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Cover gradient preview strip ────────────────────────────── */

const GRAD_CSS: Record<string, string> = {
  malware:   "linear-gradient(135deg, #0d0202 0%, #2a0808 100%)",
  redteam:   "linear-gradient(135deg, #020d04 0%, #082010 100%)",
  osint:     "linear-gradient(135deg, #020810 0%, #081c30 100%)",
  bugbounty: "linear-gradient(135deg, #0d0800 0%, #271800 100%)",
  security:  "linear-gradient(135deg, #040d14 0%, #0a2030 100%)",
  default:   "linear-gradient(135deg, #080808 0%, #181818 100%)",
};

function GradientPicker({
  value, onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {COVER_GRADIENTS.map(g => (
        <button
          key={g.value}
          title={g.label}
          onClick={() => onChange(g.value)}
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: GRAD_CSS[g.value],
            border: value === g.value
              ? "2px solid var(--category-color)"
              : "2px solid transparent",
            cursor: "pointer",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main editor ──────────────────────────────────────────────── */

interface EditorState {
  title: string;
  description: string;
  tags: string;
  coverGradient: string;
  coverImage: string;
  published: boolean;
  content: string;
}

const DEFAULT_STATE: EditorState = {
  title: "",
  description: "",
  tags: "",
  coverGradient: "default",
  coverImage: "",
  published: false,
  content: `## Introduction\n\nHook the reader in 1-2 sentences.\n\n## Main Content\n\nYour content here.\n\n\`\`\`bash\n# Example code block\necho "Hello World"\n\`\`\`\n\n## Conclusion\n\nSummarize and suggest next steps.\n`,
};

function Editor({ secret }: { secret: string }) {
  const [state, setState]     = useState<EditorState>(DEFAULT_STATE);
  const [tab, setTab]         = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState("");
  const [status, setStatus]   = useState<{ type: "idle" | "saving" | "ok" | "error"; msg: string }>({ type: "idle", msg: "" });
  const previewTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const set = (k: keyof EditorState) => (v: unknown) =>
    setState(prev => ({ ...prev, [k]: v }));

  // Debounced preview
  const fetchPreview = useCallback((md: string) => {
    clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/cms/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: md }),
        });
        const data = await res.json();
        setPreviewHtml(data.html ?? "");
      } catch {
        setPreviewHtml("<p style='color:#dc2626'>Preview failed</p>");
      }
    }, PREVIEW_DEBOUNCE);
  }, []);

  useEffect(() => {
    if (tab === "preview") fetchPreview(state.content);
  }, [tab, state.content, fetchPreview]);

  async function submit(publish: boolean) {
    if (!state.title.trim()) {
      setStatus({ type: "error", msg: "Title is required." });
      return;
    }
    setStatus({ type: "saving", msg: publish ? "Publishing…" : "Saving draft…" });
    try {
      const res = await fetch("/api/cms/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({
          title:       state.title,
          description: state.description,
          tags:        state.tags,
          published:   publish,
          content:     state.content,
          coverImage:  state.coverImage || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setStatus({ type: "ok", msg: data.message });
      if (publish) setState(DEFAULT_STATE);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Request failed";
      setStatus({ type: "error", msg });
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 13px",
    background: "var(--tag-background)",
    border: "1px solid var(--tag-border-color)",
    borderRadius: "var(--tag-border-radius)",
    color: "var(--card-text-color-main)",
    fontSize: "0.9375rem", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.08em",
    color: "var(--card-text-color-tertiary)",
    marginBottom: 6, display: "block",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "var(--body-background)",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--base-font-family)",
      overflow: "hidden",
    }}>
      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 56, flexShrink: 0,
        background: "var(--card-background)",
        borderBottom: "1px solid var(--card-separator-color)",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/" style={{
            fontFamily: "var(--code-font-family)",
            fontSize: "0.875rem", color: "var(--category-color)",
            textDecoration: "none", fontWeight: 700,
          }}>
            kiell.dev
          </a>
          <span style={{ color: "var(--card-separator-color)" }}>/</span>
          <span style={{ fontSize: "0.875rem", color: "var(--card-text-color-secondary)" }}>
            New Article
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {status.type !== "idle" && (
            <span style={{
              fontSize: "0.8125rem", maxWidth: 340,
              color: status.type === "error" ? "#dc2626"
                   : status.type === "ok"    ? "#10b981"
                   : "var(--card-text-color-tertiary)",
            }}>
              {status.msg}
            </span>
          )}
          <button onClick={() => submit(false)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px", borderRadius: "var(--tag-border-radius)",
            background: "var(--tag-background)",
            border: "1px solid var(--tag-border-color)",
            color: "var(--card-text-color-secondary)",
            fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
          }} disabled={status.type === "saving"}>
            <SaveIcon /> Save Draft
          </button>
          <button onClick={() => submit(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px", borderRadius: "var(--tag-border-radius)",
            background: "var(--category-color)",
            border: "none", color: "#fff",
            fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
            opacity: status.type === "saving" ? 0.7 : 1,
          }} disabled={status.type === "saving"}>
            <SendIcon /> Publish to dev.to
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left: metadata panel */}
        <aside style={{
          width: 280, flexShrink: 0,
          background: "var(--card-background)",
          borderRight: "1px solid var(--card-separator-color)",
          padding: "20px 20px",
          overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              style={{ ...inputStyle, fontSize: "1rem", fontWeight: 600 }}
              type="text"
              placeholder="Article title"
              value={state.title}
              onChange={e => set("title")(e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle}>Description <span style={{ opacity: 0.5 }}>(SEO)</span></label>
            <textarea
              style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
              placeholder="Short summary for search engines and the dev.to feed"
              value={state.description}
              onChange={e => set("description")(e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle}>Tags <span style={{ opacity: 0.5 }}>(up to 4)</span></label>
            <TagInput value={state.tags} onChange={set("tags")} />
            <p style={{ margin: "5px 0 0", fontSize: "0.75rem", color: "var(--card-text-color-tertiary)" }}>
              Comma-separated. Click suggestions above.
            </p>
          </div>

          <div>
            <label style={labelStyle}>Cover gradient</label>
            <GradientPicker value={state.coverGradient} onChange={set("coverGradient")} />
          </div>

          <div>
            <label style={labelStyle}>Cover image URL <span style={{ opacity: 0.5 }}>(optional)</span></label>
            <input
              style={inputStyle}
              type="url"
              placeholder="https://…"
              value={state.coverImage}
              onChange={e => set("coverImage")(e.target.value)}
            />
          </div>

          <div style={{
            padding: "12px 14px",
            background: "var(--tag-background)",
            borderRadius: "var(--tag-border-radius)",
            border: "1px solid var(--tag-border-color)",
          }}>
            <p style={{ margin: "0 0 8px", fontSize: "0.8125rem", color: "var(--card-text-color-secondary)", fontWeight: 600 }}>
              How this works
            </p>
            <ol style={{ margin: 0, paddingLeft: 16, fontSize: "0.75rem", color: "var(--card-text-color-tertiary)", lineHeight: 1.7 }}>
              <li>This saves the article to your <code>devto-autopublish</code> repo</li>
              <li>GitHub Actions publishes it to dev.to</li>
              <li>Portfolio auto-syncs it within 6 hours</li>
            </ol>
          </div>
        </aside>

        {/* Right: editor / preview */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tab bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 2,
            padding: "0 20px", height: 44, flexShrink: 0,
            borderBottom: "1px solid var(--card-separator-color)",
            background: "var(--card-background)",
          }}>
            {(["write", "preview"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 14px",
                borderRadius: "var(--tag-border-radius)",
                border: "none", cursor: "pointer",
                fontSize: "0.875rem", fontWeight: tab === t ? 700 : 400,
                background: tab === t ? "var(--tag-background)" : "transparent",
                color: tab === t ? "var(--card-text-color-main)" : "var(--card-text-color-tertiary)",
              }}>
                {t === "write" ? <EditIcon /> : <EyeIcon />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Write pane */}
          {tab === "write" && (
            <textarea
              value={state.content}
              onChange={e => set("content")(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1, padding: "24px 28px",
                background: "var(--body-background)",
                color: "var(--card-text-color-main)",
                fontFamily: "var(--code-font-family)",
                fontSize: "0.9375rem", lineHeight: 1.75,
                border: "none", outline: "none", resize: "none",
                boxSizing: "border-box",
              }}
            />
          )}

          {/* Preview pane */}
          {tab === "preview" && (
            <div
              className="post-body article-content-inner"
              style={{
                flex: 1, overflowY: "auto",
                padding: "32px 40px",
                background: "var(--card-background)",
              }}
              dangerouslySetInnerHTML={{ __html: previewHtml || "<p style='color:var(--card-text-color-tertiary)'>Loading preview…</p>" }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function AdminPage() {
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cms_token");
    if (stored) setSecret(stored);
  }, []);

  if (!secret) {
    return <PasswordGate onAuth={s => setSecret(s)} />;
  }

  return <Editor secret={secret} />;
}

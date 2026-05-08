"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="5 12 3 12 12 3 21 12 19 12" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
      </svg>
    ),
  },
  {
    href: "/archives",
    label: "Archives",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <rect x="3" y="4" width="18" height="4" rx="2" />
        <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="7 8 3 12 7 16" />
        <polyline points="17 8 21 12 17 16" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" />
      </svg>
    ),
  },
  {
    href: "/cv",
    label: "CV",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="12" cy="7" r="4" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
  {
    href: "/novasec",
    label: "NovaSec",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <line x1="5" y1="9" x2="19" y2="9" />
        <line x1="5" y1="15" x2="19" y2="15" />
        <line x1="11" y1="4" x2="7" y2="20" />
        <line x1="17" y1="4" x2="13" y2="20" />
      </svg>
    ),
  },
];

function AvatarKT() {
  return (
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <radialGradient id="kt-bg" cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#1b3a5c" />
          <stop offset="55%" stopColor="#0e1e30" />
          <stop offset="100%" stopColor="#060d16" />
        </radialGradient>
        <radialGradient id="kt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00b4ff" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#00ff88" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="150" fill="url(#kt-bg)" />
      <circle cx="150" cy="150" r="150" fill="url(#kt-glow)" />
      <circle cx="150" cy="150" r="147" fill="none" stroke="rgba(0,180,255,0.15)" strokeWidth="2" />
      <text x="150" y="148" fontFamily="Inter,-apple-system,sans-serif" fontWeight="700" fontSize="88" fill="rgba(255,255,255,0.93)" textAnchor="middle" dominantBaseline="central" letterSpacing="-3">KT</text>
      <text x="150" y="208" fontFamily="monospace" fontSize="18" fill="rgba(0,180,255,0.65)" textAnchor="middle" letterSpacing="5">SEC</text>
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("StackColorScheme") ?? "auto";
    const mq = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored === "dark" || (stored === "auto" && mq));
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    const val = next ? "dark" : "light";
    localStorage.setItem("StackColorScheme", val);
    document.documentElement.dataset.scheme = val;
  }

  function active(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="hamburger-btn"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {menuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Avatar + name */}
      <header className="sidebar-header">
        <figure style={{ margin: 0 }} className="site-avatar">
          <a href="/">
            <AvatarKT />
          </a>
        </figure>
        <div className="site-meta">
          <div className="site-name">
            <a href="/">Kiell Tampubolon</a>
          </div>
          <div className="site-description">
            Offensive Security · Red Team<br />
            Malware Analysis · <strong>NovaSec</strong>
          </div>
          <div className="avail-badge">
            <span className="avail-dot" />
            Available
          </div>
        </div>
      </header>

      {/* Social icons */}
      <ol className="social-menu">
        <li>
          <a href="https://github.com/glatinone" target="_blank" rel="noopener noreferrer" title="GitHub">
            {/* GitHub fill-based icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </li>
        <li>
          <a href="https://linkedin.com/in/kielltampubolon" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </li>
        <li>
          <a href="https://t.me/kiell_at" target="_blank" rel="noopener noreferrer" title="Telegram">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>
        </li>
      </ol>

      {/* Navigation */}
      <ol className={`menu${menuOpen ? " is-open" : ""}`} id="main-menu">
        {NAV.map((item) => (
          <li key={item.href} className={active(item.href) ? "current" : ""}>
            <a href={item.href} onClick={() => setMenuOpen(false)}>
              {item.icon}
              <span>{item.label}</span>
            </a>
          </li>
        ))}

        <div className="menu-bottom-section">
          <li>
            <button id="dark-mode-toggle" onClick={toggleDark}>
              <svg className="icon-toggle-left" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="8" cy="12" r="2" />
                <rect x="2" y="6" width="20" height="12" rx="6" />
              </svg>
              <svg className="icon-toggle-right" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="16" cy="12" r="2" />
                <rect x="2" y="6" width="20" height="12" rx="6" />
              </svg>
              <span>Dark Mode</span>
            </button>
          </li>
        </div>
      </ol>
    </>
  );
}

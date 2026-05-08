import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV — Kiell Tampubolon",
};

const SKILLS = [
  { label: "Malware Dev & Analysis", pct: 95, color: "var(--accent-color)" },
  { label: "Red Team / C2 Frameworks", pct: 90, color: "var(--accent-color)" },
  { label: "Bug Bounty Hunting", pct: 85, color: "var(--accent-color)" },
  { label: "Phishing / Social Engineering", pct: 90, color: "var(--accent-color)" },
  { label: "Buffer Overflow / BOF", pct: 85, color: "var(--accent-color)" },
];

const DEV = [
  { label: "Python", pct: 95, color: "#0177b8" },
  { label: "Bash / Shell Scripting", pct: 85, color: "#0177b8" },
  { label: "Next.js / React", pct: 75, color: "#0177b8" },
  { label: "CI/CD (GitHub Actions)", pct: 80, color: "#0177b8" },
  { label: "Windows Internals", pct: 80, color: "#0177b8" },
];

const TOOLS = [
  { label: "Burp Suite", pct: 90, color: "#8ea885" },
  { label: "Nmap / Metasploit", pct: 90, color: "#8ea885" },
  { label: "OSINT / Recon Tooling", pct: 92, color: "#8ea885" },
  { label: "Cloud Security (AWS/GCP)", pct: 75, color: "#8ea885" },
  { label: "Threat Intel Pipelines", pct: 88, color: "#8ea885" },
];

const CERTS = [
  { issuer: "MalDevAcademy", name: "Malware Development", status: "done" },
  { issuer: "Zero-Point Security", name: "UDRL + Sleepmask Development", status: "done" },
  { issuer: "RTO / Windows Internals", name: "CWI Certification", status: "progress" },
  { issuer: "CRTA", name: "Red Team Operator", status: "planned" },
];

function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="skill-item">
      <div className="skill-label">
        <span>{label}</span>
        <span className="skill-pct">{pct}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "done") return <div className="cert-status-done">✓ Completed</div>;
  if (status === "progress") return <div className="cert-status-progress">◎ In Progress</div>;
  return <div className="cert-status-planned">○ Planned</div>;
}

export default function CVPage() {
  return (
    <article className="main-article">
      <div className="article-content-inner">
        <h1>Curriculum Vitae</h1>
        <p style={{ color: "var(--card-text-color-tertiary)", fontFamily: "var(--code-font-family)", fontSize: "0.875rem", marginTop: 0 }}>
          Kiell Tampubolon · Cybersecurity Engineer · Indonesia
        </p>

        {/* Experience */}
        <h2>Experience</h2>
        <ul>
          <li>
            <strong>Cybersecurity Engineer</strong> — Singapore-based company, Remote (2026 – present)
            <ul>
              <li>Offensive security operations: red team exercises, vulnerability assessments</li>
              <li>Malware analysis and detection engineering</li>
              <li>Building internal security automation tooling</li>
            </ul>
          </li>
          <li>
            <strong>Security Research Intern</strong> — Glints (2025)
            <ul>
              <li>Bug bounty program participation and vulnerability research</li>
              <li>Identified and responsibly disclosed multiple findings</li>
            </ul>
          </li>
          <li>
            <strong>Founder &amp; Lead — NovaSec</strong> (2024 – present)
            <ul>
              <li>Cybersecurity education brand for the Indonesian tech community</li>
              <li>Conducted phishing awareness workshops at HACKTIV8 and multiple institutions (500+ participants)</li>
            </ul>
          </li>
        </ul>

        {/* Education */}
        <h2>Education</h2>
        <ul>
          <li>
            <strong>D4 Applied Informatics</strong> — Polibatam (2020 – 2026)
            <br />
            <span style={{ color: "var(--card-text-color-secondary)", fontSize: "0.9em" }}>
              Thesis: QakBot v4 Malware Analysis — static/dynamic analysis of a major banking trojan variant
            </span>
          </li>
        </ul>

        {/* Skills */}
        <h2>Skills</h2>

        <div style={{ display: "grid", gap: "32px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginBottom: "8px" }}>
          <div>
            <p style={{ margin: "0 0 16px", fontWeight: 700, fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--card-text-color-tertiary)" }}>
              Offensive / Attack Craft
            </p>
            {SKILLS.map((s) => <SkillBar key={s.label} {...s} />)}
          </div>

          <div>
            <p style={{ margin: "0 0 16px", fontWeight: 700, fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--card-text-color-tertiary)" }}>
              Dev Tools
            </p>
            {DEV.map((s) => <SkillBar key={s.label} {...s} />)}
          </div>

          <div>
            <p style={{ margin: "0 0 16px", fontWeight: 700, fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--card-text-color-tertiary)" }}>
              Security Tools
            </p>
            {TOOLS.map((s) => <SkillBar key={s.label} {...s} />)}
          </div>
        </div>

        {/* Certifications */}
        <h2>Certifications &amp; Training</h2>
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {CERTS.map((c) => (
            <div key={c.name} className="cert-badge">
              <div className="cert-issuer">{c.issuer}</div>
              <div className="cert-name">{c.name}</div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>

        {/* Projects */}
        <h2>Open-Source Projects</h2>
        <ul>
          <li>
            <strong><a href="https://github.com/glatinone/vulnscan" target="_blank" rel="noopener noreferrer">VulnScan</a></strong> —
            AI-powered web vulnerability scanner; OWASP Top 10, SARIF output, CI/CD integration
          </li>
          <li>
            <strong><a href="https://github.com/glatinone/sentinelscout" target="_blank" rel="noopener noreferrer">SentinelScout</a></strong> —
            OSINT aggregator querying VirusTotal, OTX, Shodan, NVD CVE, GitHub Advisories
          </li>
          <li>
            <strong><a href="https://github.com/glatinone/osintscout" target="_blank" rel="noopener noreferrer">OSINTScout</a></strong> —
            Social media OSINT CLI (X, Instagram, LinkedIn) for threat intelligence
          </li>
          <li>
            <strong><a href="https://github.com/glatinone/bugbounty-tracker" target="_blank" rel="noopener noreferrer">Bug Bounty Tracker</a></strong> —
            Private CLI dashboard for tracking bug bounty submissions and streaks
          </li>
        </ul>

        {/* Technical Interests */}
        <h2>Technical Areas of Interest</h2>
        <ul>
          <li>Malware development, analysis, and detection engineering</li>
          <li>Red team tradecraft and C2 framework internals (Cobalt Strike, Havoc)</li>
          <li>Windows kernel and userland internals, evasion techniques</li>
          <li>OSINT automation and threat intelligence pipelines</li>
          <li>Bug bounty — web application security (OWASP, API security)</li>
          <li>Cloud security (AWS, GCP)</li>
        </ul>
      </div>

      <footer className="site-footer" style={{ padding: "0 var(--card-padding) var(--card-padding)" }}>
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">
          <a href="https://github.com/glatinone" target="_blank" rel="noopener noreferrer">github.com/glatinone</a>
          {" · "}
          <a href="https://linkedin.com/in/kielltampubolon" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {" · "}
          <a href="https://t.me/kiell_at" target="_blank" rel="noopener noreferrer">Telegram</a>
        </div>
      </footer>
    </article>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { featured, jobs, moreProjects, profile, resumeUrl, skills, socials } from "../data";

type Line = { kind: "cmd" | "out" | "accent" | "err"; text: string; href?: string };

const sections = ["about", "projects", "experience", "skills", "contact"];
const allProjects = [...featured, ...moreProjects];
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const commands: Record<string, string> = {
  help: "list commands",
  whoami: "who is this?",
  projects: "things I've built",
  "open <project>": "open a project on GitHub",
  experience: "where I've worked",
  skills: "what I work with",
  contact: "how to reach me",
  resume: "open my résumé (PDF)",
  "goto <section>": "scroll to a section",
  ls: "list sections",
  clear: "clear the screen",
};
const names = ["help", "whoami", "projects", "open", "experience", "skills", "contact", "resume", "goto", "cd", "ls", "clear", "date", "echo", "sudo", "github", "linkedin"];

function run(input: string): Line[] | "clear" {
  const [cmd = "", ...rest] = input.trim().split(/\s+/);
  const arg = rest.join(" ").toLowerCase();
  const out = (text: string): Line => ({ kind: "out", text });
  const link = (text: string, href: string): Line => ({ kind: "out", text, href });

  switch (cmd.toLowerCase()) {
    case "":
      return [];
    case "help":
      return [
        ...Object.entries(commands).map(([c, d]) => out(`  ${c.padEnd(16)} ${d}`)),
        { kind: "accent", text: "Tip: Tab completes, ↑/↓ walks history." },
      ];
    case "whoami":
      return [
        { kind: "accent", text: `${profile.name}: ${profile.role.toLowerCase()} at IBM, ${profile.location}.` },
        out("Java · Go · Spring Boot · Kafka · Cassandra · Kubernetes"),
        out("I build multi-tenant SaaS by day and storage engines by night."),
        out("Try: projects, experience, contact"),
      ];
    case "projects":
      return [
        ...allProjects.map((p) => out(`  ${slug(p.name).padEnd(15)} ${p.tech.slice(0, 3).join(", ")}`)),
        { kind: "accent", text: "Open one with: open lsm-kv" },
      ];
    case "open": {
      const p = allProjects.find((x) => slug(x.name) === slug(arg) || slug(x.name).startsWith(slug(arg) || "\0"));
      if (!p) return [{ kind: "err", text: `open: no project named "${arg}". Try: projects` }];
      window.open(p.repo, "_blank", "noopener");
      return [link(`Opening ${p.repo}`, p.repo)];
    }
    case "experience":
    case "xp":
      return jobs.map((j) => out(`  ${j.dates.padEnd(20)} ${j.title}, ${j.company}${j.team ? ` (${j.team})` : ""}`));
    case "skills":
      return skills.map((s) => out(`  ${s.group.padEnd(14)} ${s.items.join(", ")}`));
    case "contact":
    case "hire":
      return [
        link(`  email      ${profile.email}`, `mailto:${profile.email}`),
        ...socials.map((s) => link(`  ${s.label.toLowerCase().padEnd(10)} ${s.handle}`, s.href)),
        { kind: "accent", text: profile.status + "." },
      ];
    case "resume":
      window.open(resumeUrl, "_blank", "noopener");
      return [link("Opening résumé (PDF)…", resumeUrl)];
    case "github":
    case "linkedin": {
      const s = socials.find((x) => x.label.toLowerCase() === cmd.toLowerCase())!;
      window.open(s.href, "_blank", "noopener");
      return [link(`Opening ${s.href}`, s.href)];
    }
    case "ls":
      return [out(sections.map((s) => `${s}/`).join("  "))];
    case "goto":
    case "cd": {
      const target = arg.replace(/[/.]/g, "");
      if (!target || target === "~") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return [];
      }
      const el = sections.includes(target) ? document.getElementById(target) : null;
      if (!el) return [{ kind: "err", text: `${cmd}: no such section: ${arg}. Try: ls` }];
      el.scrollIntoView({ behavior: "smooth" });
      return [out(`→ ${target}`)];
    }
    case "date":
      return [out(new Date().toString())];
    case "echo":
      return [out(rest.join(" "))];
    case "sudo":
      return [{ kind: "err", text: "Permission denied. You can still hire me, though: type contact" }];
    case "clear":
      return "clear";
    default:
      return [{ kind: "err", text: `command not found: ${cmd}. Type help to see what's available.` }];
  }
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(true);
  const history = useRef<string[]>([]);
  const hIndex = useRef(-1);
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const exec = (cmd: string) => {
    const result = run(cmd);
    if (cmd.trim()) {
      history.current.unshift(cmd);
      hIndex.current = -1;
    }
    if (result === "clear") setLines([]);
    else setLines((l) => [...l, { kind: "cmd", text: cmd }, ...result]);
  };

  // Types `whoami` once on load, so visitors see the terminal is live.
  useEffect(() => {
    const intro = "whoami";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLines([{ kind: "cmd", text: intro }, ...(run(intro) as Line[])]);
      setBusy(false);
      return;
    }
    let i = 0;
    let timer = window.setTimeout(function type() {
      i++;
      setValue(intro.slice(0, i));
      if (i < intro.length) timer = window.setTimeout(type, 90);
      else
        timer = window.setTimeout(() => {
          setValue("");
          setLines([{ kind: "cmd", text: intro }, ...(run(intro) as Line[])]);
          setBusy(false);
        }, 350);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [lines]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(value);
      setValue("");
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      hIndex.current = e.key === "ArrowUp" ? Math.min(h.length - 1, hIndex.current + 1) : Math.max(-1, hIndex.current - 1);
      setValue(hIndex.current === -1 ? "" : h[hIndex.current]);
    } else if (e.key === "Tab") {
      const parts = value.split(" ");
      const pool = parts.length > 1 ? (["open"].includes(parts[0]) ? allProjects.map((p) => slug(p.name)) : sections) : names;
      const match = pool.find((n) => n.startsWith(parts[parts.length - 1].toLowerCase()));
      if (match && value) {
        e.preventDefault();
        parts[parts.length - 1] = match;
        setValue(parts.join(" ") + (parts.length === 1 ? " " : ""));
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const hint = (cmd: string) => {
    if (busy) return;
    exec(cmd);
    input.current?.focus({ preventScroll: true });
  };

  return (
    <div className="term" aria-label="Interactive terminal">
      <div className="term-bar">
        <i /> <i /> <i />
        <span>guest@rajatjc: ~</span>
      </div>
      <div className="term-body" ref={body} onClick={() => input.current?.focus({ preventScroll: true })}>
        {lines.map((l, i) =>
          l.kind === "cmd" ? (
            <p className="term-line cmd" key={i}>
              <span className="term-prompt">❯ </span>
              {l.text}
            </p>
          ) : (
            <p className={`term-line ${l.kind}`} key={i}>
              {l.href ? (
                <a href={l.href} target={l.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener">
                  {l.text}
                </a>
              ) : (
                l.text
              )}
            </p>
          ),
        )}
        <div className="term-input-row">
          <span className="term-prompt">❯</span>
          <input
            ref={input}
            className="term-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            readOnly={busy}
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={busy ? "" : "type help"}
          />
        </div>
      </div>
      <div className="term-hints">
        {["help", "projects", "experience", "contact", "sudo hire-me"].map((c) => (
          <button key={c} onClick={() => hint(c)} disabled={busy}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

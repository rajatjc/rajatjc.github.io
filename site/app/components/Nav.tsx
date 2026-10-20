"use client";

import { useEffect, useState } from "react";
import { resumeUrl } from "../data";

const links = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <nav className="wrap nav-inner" aria-label="Main">
        <a href="#top" className="logo" aria-label="Rajat Sharma, back to top">
          rajat<span>.</span>
        </a>
        <ul className={`nav-links${open ? " open" : ""}`} id="nav-links">
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className={active === l.id ? "active" : ""} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a href={resumeUrl} className="btn btn-sm" target="_blank" rel="noopener">
            Résumé
          </a>
          <button className="menu-btn" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
    </header>
  );
}

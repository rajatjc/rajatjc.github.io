"use client";

import { useEffect } from "react";

// Page-wide effects that need no markup of their own:
// - reveals `.reveal` elements as they scroll into view
// - counts `[data-count]` numbers up from zero the first time they're seen
// - feeds the pointer position to the hero glow and `.spot` cards
export default function Effects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? "";
      if (reduceMotion || !Number.isFinite(target)) return;
      const start = performance.now();
      const dur = 1400;
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const hero = document.querySelector<HTMLElement>(".hero");
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (hero) {
          const r = hero.getBoundingClientRect();
          if (e.clientY < r.bottom) {
            hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
            hero.style.setProperty("--my", `${e.clientY - r.top}px`);
          }
        }
        const card = (e.target as Element | null)?.closest?.<HTMLElement>(".spot");
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--sx", `${e.clientX - r.left}px`);
          card.style.setProperty("--sy", `${e.clientY - r.top}px`);
        }
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}

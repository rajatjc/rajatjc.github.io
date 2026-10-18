"use client";

import { useEffect, useRef } from "react";

// A white circle drawn with mix-blend-mode: difference, so whatever it covers shows in negative.
// It grows over links and buttons, shrinks over text fields, and only appears for mouse/trackpad users.
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-cursor");

    let x = -100, y = -100, cx = x, cy = y, raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (el.dataset.visible !== "true") {
        cx = x;
        cy = y;
        el.dataset.visible = "true";
      }
      const t = e.target as Element | null;
      if (t?.closest?.('input, textarea, [contenteditable="true"]')) el.dataset.state = "text";
      else if (t?.closest?.('a, button, summary, label, [role="tab"], [data-cursor="hover"]')) el.dataset.state = "hover";
      else el.dataset.state = "default";
    };
    const onDown = () => (el.dataset.down = "true");
    const onUp = () => (el.dataset.down = "false");
    const onLeave = () => (el.dataset.visible = "false");

    const tick = () => {
      const k = reduceMotion ? 1 : 0.22;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <div className="cursor-dot" />
    </div>
  );
}

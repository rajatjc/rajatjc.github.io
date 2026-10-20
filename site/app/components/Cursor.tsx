"use client";

import { useEffect, useRef } from "react";

// Directions of the droplet's corners, in border-radius order: top-left, top-right, bottom-right, bottom-left.
const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const;

// A glass water droplet: the page shows through it with a highlight and soft shading. It trails
// the pointer on a spring, stretches into a teardrop in the direction it moves, and wobbles back
// into a bead when it stops. A small dot tracks the pointer exactly, so clicking stays precise.
// It grows over links and buttons, shrinks over text fields, and only appears for mouse/trackpad users.
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const blob = useRef<HTMLDivElement>(null);
  const drop = useRef<HTMLDivElement>(null);
  const pointer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, b = bubble.current, bl = blob.current, d = drop.current, p = pointer.current;
    if (!el || !b || !bl || !d || !p || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-cursor");

    // Pointer (x, y); droplet position (cx, cy) and velocity (vx, vy);
    // stretch amount and its velocity; stretch direction in radians.
    let x = -100, y = -100, cx = x, cy = y, vx = 0, vy = 0;
    let stretch = 0, stretchV = 0, angle = 0, raf = 0, last = performance.now();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      p.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (el.dataset.visible !== "true") {
        cx = x;
        cy = y;
        vx = vy = 0;
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

    // One physics step at 60 fps; faster displays run it more often, so the feel doesn't change.
    const step = () => {
      // The droplet drifts after the pointer on a soft spring, so it lags and overshoots a little.
      // Lower pull = slower; higher friction keeps the slow version from swinging too far.
      vx = (vx + (x - cx) * 0.012) * 0.88;
      vy = (vy + (y - cy) * 0.012) * 0.88;
      cx += vx;
      cy += vy;
      // Faster movement stretches it more. The stretch has its own bouncy spring,
      // so when the droplet stops it overshoots into a squash and wobbles back to round.
      const speed = Math.hypot(vx, vy);
      if (speed > 0.6) angle = Math.atan2(vy, vx);
      stretchV = (stretchV + (Math.min(speed * 0.05, 0.5) - stretch) * 0.16) * 0.8;
      stretch += stretchV;
    };

    const tick = (now: number) => {
      if (reduceMotion) {
        cx = x;
        cy = y;
        stretch = 0;
      } else {
        const steps = Math.min(4, Math.max(1, Math.round((now - last) / 16.7)));
        for (let i = 0; i < steps; i++) step();
      }
      last = now;
      b.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      // Rotate, stretch, rotate back: the droplet stretches along its direction of travel
      // but never turns, so the highlight stays at the top left like real light on water.
      bl.style.transform = `rotate(${angle}rad) scale(${1 + stretch}, ${Math.max(0.55, 1 - stretch * 0.6)}) rotate(${-angle}rad)`;
      // Tighter curves on the corners facing away from the motion turn it into a teardrop.
      const ux = Math.cos(angle), uy = Math.sin(angle), pull = Math.max(0, stretch) * 44;
      d.style.borderRadius = CORNERS.map(([cx, cy]) => {
        const behind = Math.max(0, -(ux * cx + uy * cy) / Math.SQRT2);
        return `${(50 - pull * behind).toFixed(1)}%`;
      }).join(" ");
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
    <div ref={root} className="cursor" aria-hidden="true">
      <div ref={bubble} className="cursor-bubble">
        <div ref={blob} className="cursor-blob">
          <div ref={drop} className="cursor-dot" />
        </div>
      </div>
      <div ref={pointer} className="cursor-pointer" />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

// Cycles through phrases with a typing effect. Renders the first phrase on the server, so it reads fine without JS.
export default function Typer({ phrases }: { phrases: string[] }) {
  const [text, setText] = useState(phrases[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0, len = phrases[0].length, deleting = true, timer = 0;
    const tick = () => {
      if (deleting) {
        len--;
        if (len === 0) {
          deleting = false;
          i = (i + 1) % phrases.length;
        }
      } else {
        len++;
      }
      setText(phrases[i].slice(0, len));
      let delay = deleting ? 28 : 55;
      if (!deleting && len === phrases[i].length) {
        deleting = true;
        delay = 2200;
      }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 2600);
    return () => window.clearTimeout(timer);
  }, [phrases]);

  return (
    <p className="role" aria-label={phrases.join(", ")}>
      <span aria-hidden="true">{`> ${text}`}</span>
      <span className="caret" aria-hidden="true" />
    </p>
  );
}

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { jobs } from "../data";

export default function ExperienceTabs() {
  const [active, setActive] = useState(0);
  const [ind, setInd] = useState({ top: 0, height: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const el = tabs.current[active];
    if (el) setInd({ top: el.offsetTop, height: el.offsetHeight });
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + jobs.length) % jobs.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const job = jobs[active];

  return (
    <div className="xp">
      <div className="xp-tabs" role="tablist" aria-label="Jobs" aria-orientation="vertical" onKeyDown={onKey}>
        <span className="xp-ind" style={{ top: ind.top, height: ind.height }} aria-hidden="true" />
        {jobs.map((j, i) => (
          <button
            key={`${j.company}-${j.dates}`}
            ref={(el) => void (tabs.current[i] = el)}
            role="tab"
            id={`tab-${i}`}
            aria-selected={i === active}
            aria-controls="xp-panel"
            tabIndex={i === active ? 0 : -1}
            className="xp-tab"
            onClick={() => setActive(i)}
          >
            {j.team ? `${j.company} · ${j.team}` : j.company}
            <small>{j.dates}</small>
          </button>
        ))}
      </div>
      <div className="xp-panel fade-in" key={active} role="tabpanel" id="xp-panel" aria-labelledby={`tab-${active}`}>
        <h3>
          {job.title} <span>@ {job.company}</span>
        </h3>
        <p className="xp-meta">
          {job.team ? `${job.team} · ` : ""}
          {job.dates} · {job.place}
        </p>
        <ul className="ticks">
          {job.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <ul className="chips" aria-label="Technologies">
          {job.tech.map((t) => <li className="chip" key={t}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}

import type { Project } from "../data";

// Screenshot strip for a project that is played on its own site rather than simulated here.
export default function Shots({ p }: { p: Project }) {
  if (!p.shots?.length) return null;
  return (
    <div className="panel" aria-label={`${p.name} screenshots`}>
      <div className="panel-head">
        <b>{p.demo?.replace(/^https?:\/\//, "")}</b>
        <span>Tap a screen to play that item</span>
      </div>
      <div className="shots">
        {p.shots.map((s) => (
          <a key={s.src} href={s.href} target="_blank" rel="noopener">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} width={400} height={760} loading="lazy" />
            <span>{s.caption}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

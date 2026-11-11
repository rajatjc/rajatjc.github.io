import type { Project } from "../data";

// Wide screenshots of a desktop app, stacked: each one is the top of a Mac screen.
export default function Screens({ p }: { p: Project }) {
  if (!p.screens?.length) return null;
  return (
    <div className="panel" aria-label={`${p.name} screenshots`}>
      <div className="panel-head">
        <b>{p.repo?.replace(/^https?:\/\//, "")}</b>
        <span>macOS · lives in the notch</span>
      </div>
      <div className="screens">
        {p.screens.map((s) => (
          <figure key={s.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} width={1080} height={280} loading="lazy" />
            <figcaption>{s.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

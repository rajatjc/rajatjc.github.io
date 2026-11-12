import type { Project } from "../data";

// Full app-window screenshots (a Mac or iPad window, landscape), in the same panel as
// the other project demos. Width and height come from data.ts so the page doesn't jump.
export default function AppWindow({ p }: { p: Project }) {
  if (!p.windows?.length) return null;
  return (
    <div className="panel" aria-label={`${p.name} screenshots`}>
      <div className="panel-head">
        <b>{p.repo?.replace(/^https?:\/\//, "")}</b>
        <span>macOS · iPhone · iPad</span>
      </div>
      <div className="screens">
        {p.windows.map((w) => (
          <figure key={w.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.src} alt={w.alt} width={w.width} height={w.height} loading="lazy" />
            <figcaption>{w.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

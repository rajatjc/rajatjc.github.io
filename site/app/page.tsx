import CopyEmail from "./components/CopyEmail";
import Cursor from "./components/Cursor";
import Effects from "./components/Effects";
import ExperienceTabs from "./components/ExperienceTabs";
import LedgerFlow from "./components/LedgerFlow";
import LsmPlayground from "./components/LsmPlayground";
import Nav from "./components/Nav";
import Shots from "./components/Shots";
import Terminal from "./components/Terminal";
import Typer from "./components/Typer";
import {
  about,
  achievements,
  education,
  featured,
  moreProjects,
  now,
  profile,
  resumeUrl,
  skills,
  socials,
  stats,
  type Project,
} from "./data";

const updated = new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" });

function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="links">
      {p.demo && (
        <a className="btn btn-primary btn-sm" href={p.demo} target="_blank" rel="noopener">
          {p.demoLabel ?? "Live demo"} <span className="arrow">↗</span>
        </a>
      )}
      {p.repo && (
        <a className="btn btn-sm" href={p.repo} target="_blank" rel="noopener">
          Code on GitHub <span className="arrow">↗</span>
        </a>
      )}
      {p.demoNote && <span className="note">{p.demoNote}</span>}
    </div>
  );
}

function Feature({ p, children }: { p: Project; children: React.ReactNode }) {
  return (
    <article className="feature spot reveal">
      <div>
        <h3>
          {p.name}
          {p.badge && <span className="badge">{p.badge}</span>}
        </h3>
        <p className="blurb">{p.blurb}</p>
        {p.metrics && (
          <div className="metrics">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <b>{m.value}</b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        )}
        <ul className="ticks">
          {p.points?.map((pt) => <li key={pt}>{pt}</li>)}
        </ul>
        <ul className="chips" aria-label="Technologies">
          {p.tech.map((t) => <li className="chip" key={t}>{t}</li>)}
        </ul>
        <ProjectLinks p={p} />
      </div>
      {children}
    </article>
  );
}

export default function Home() {
  const [lsm, ledger, peeler] = featured;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Cursor />
      <Effects />
      <Nav />

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div>
              <div className="status">
                <span className="pulse" aria-hidden="true" />
                {profile.status}
              </div>
              <h1>
                Rajat
                <br />
                Sharma
              </h1>
              <Typer phrases={["backend & platform engineer", "software developer @ IBM", "Java · Go · Kafka · Kubernetes"]} />
              <p className="tagline">
                I build the systems behind the screen: <strong>multi-tenant SaaS on Kubernetes</strong> at IBM, and{" "}
                <strong>event-driven services</strong> on Kafka and Cassandra.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-primary" href="#projects">
                  See my work <span aria-hidden="true">↓</span>
                </a>
                <a className="btn" href={resumeUrl} target="_blank" rel="noopener">
                  Résumé (PDF) <span className="arrow">↗</span>
                </a>
              </div>
              <div className="hero-meta">
                <span>📍 {profile.location}</span>
                {socials.slice(0, 2).map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener">
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </div>
            <Terminal />
          </div>
        </section>

        {/* ---------- Stats ---------- */}
        <div className="wrap">
          <div className="stats reveal">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <b data-count={s.value} data-suffix={s.suffix}>
                  {s.value}
                  {s.suffix}
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- About ---------- */}
        <section className="section" id="about">
          <div className="wrap">
            <p className="eyebrow">01 · about</p>
            <h2 className="h2 reveal">Reliable systems, measured results.</h2>
            <div className="about-grid">
              <figure className="photo reveal" style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/profile.jpg" alt="Rajat Sharma" width={642} height={642} loading="lazy" />
                <figcaption>Toronto, ON</figcaption>
              </figure>
              <div className="about-text reveal">
                {about.map((p) => <p key={p}>{p}</p>)}
                <div className="cards-3">
                  {now.map((n) => (
                    <div className="mini" key={n.label}>
                      <small>{n.label}</small>
                      <p>{n.text}</p>
                    </div>
                  ))}
                </div>
                <div className="edu">
                  {education.map((e) => (
                    <div className="mini" key={e.school}>
                      <small>{e.dates} · {e.place}</small>
                      <b>{e.degree}</b>
                      <p>{e.school} · {e.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Projects ---------- */}
        <section className="section" id="projects">
          <div className="wrap">
            <p className="eyebrow">02 · projects</p>
            <h2 className="h2 reveal">Things I&apos;ve built to understand them.</h2>
            <p className="lede reveal">Two projects you can play with right here, plus a game that&apos;s live on its own domain. Each demo is a small model of the real system, running in your browser.</p>
            <Feature p={lsm}>
              <LsmPlayground />
            </Feature>
            <Feature p={ledger}>
              <LedgerFlow />
            </Feature>
            <Feature p={peeler}>
              <Shots p={peeler} />
            </Feature>

            <h3 className="sub-h reveal">Earlier work</h3>
            <div className="grid-2">
              {moreProjects.map((p) => (
                <a className="card spot reveal" key={p.name} href={p.repo} target="_blank" rel="noopener">
                  <h4>
                    {p.name} <span className="arrow" aria-hidden="true">↗</span>
                  </h4>
                  <p>{p.blurb}</p>
                  <ul className="chips" aria-label="Technologies">
                    {p.tech.map((t) => <li className="chip" key={t}>{t}</li>)}
                  </ul>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Experience ---------- */}
        <section className="section" id="experience">
          <div className="wrap">
            <p className="eyebrow">03 · experience</p>
            <h2 className="h2 reveal">Six years of backend work.</h2>
            <p className="lede reveal">From telecom network management to ESG reporting to multi-tenant SaaS. Pick a role to see what I did there.</p>
            <div className="reveal">
              <ExperienceTabs />
            </div>
          </div>
        </section>

        {/* ---------- Skills ---------- */}
        <section className="section" id="skills">
          <div className="wrap">
            <p className="eyebrow">04 · skills</p>
            <h2 className="h2 reveal">What I work with.</h2>
            <p className="lede reveal">Tools I&apos;ve used in production or in the projects above.</p>
            <div className="skills">
              {skills.map((s) => (
                <div className="skill-card spot reveal" key={s.group}>
                  <h4>{s.group}</h4>
                  <ul className="chips">
                    {s.items.map((i) => <li className="chip" key={i}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <h3 className="sub-h reveal">Competitive programming &amp; awards</h3>
            <div className="ach">
              {achievements.map((a) => {
                const inner = (
                  <>
                    <b>{a.value}</b>
                    <span>{a.label}</span>
                    {a.sub && <small>{a.sub}</small>}
                  </>
                );
                return a.href ? (
                  <a key={a.label} href={a.href} target="_blank" rel="noopener" className="reveal">
                    {inner}
                  </a>
                ) : (
                  <div key={a.label} className="a reveal">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section className="contact" id="contact">
          <div className="wrap reveal">
            <p className="eyebrow">05 · contact</p>
            <h2 className="h2">Let&apos;s build something reliable.</h2>
            <p className="lede">
              I&apos;m open to backend and platform roles in Toronto or remote. Email is the fastest way to reach me, and LinkedIn works too.
            </p>
            <div className="contact-actions">
              <a className="btn btn-primary" href={`mailto:${profile.email}`}>
                Say hello <span className="arrow">↗</span>
              </a>
              <CopyEmail email={profile.email} />
            </div>
            <ul className="socials">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <span>© {new Date().getFullYear()} {profile.name}. Built with Next.js.</span>
          <span>
            Updated {updated} · <a href="/old-portfolio/">Old site</a>
          </span>
        </div>
      </footer>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

// Replays a Loonie Ledger transfer: payments holds the funds and writes an event, fraud (Python) and
// compliance (Node.js) each judge it from the Redis stream, and payments settles only if both pass.
// Scoring follows the rules in the project's README.

type Transfer = { to: string; amount: number; t: number; status?: "SETTLED" | "HELD" };
type Verdict = { score: number; reasons: string[]; fraudFlag: boolean; compliance: string | null; status: "SETTLED" | "HELD" };

const scenarios = [
  { label: "☕ Coffee", sends: [{ to: "Maya", amount: 4.5 }] },
  { label: "🚗 Car down payment", sends: [{ to: "Northside Auto", amount: 12000 }] },
  { label: "3 × $3,500", sends: [3500, 3500, 3500].map((amount) => ({ to: "Liam", amount })) },
];

const money = (n: number) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: n % 1 ? 2 : 0 });

function judge(history: Transfer[], tr: Transfer): Verdict {
  const reasons: string[] = [];
  let score = 0;
  const add = (pts: number, why: string) => ((score += pts), reasons.push(`+${pts}  ${why}`));

  if (!history.some((h) => h.to === tr.to)) add(20, `First transfer to ${tr.to}`);
  if (tr.amount >= 10000) add(40, `${money(tr.amount)} is $10,000 or more`);
  else if (tr.amount >= 3000) add(20, `${money(tr.amount)} is $3,000 or more`);
  if (history.length >= 3) {
    const avg = history.reduce((a, h) => a + h.amount, 0) / history.length;
    if (tr.amount > 3 * avg) add(30, `${(tr.amount / avg).toFixed(1)}× this customer's average transfer`);
  }
  const recent = history.filter((h) => tr.t - h.t < 120_000).length + 1;
  if (recent >= 3) add(30, `${recent} transfers in the last 2 minutes`);
  if (tr.amount >= 1000 && tr.amount % 1000 === 0) add(10, "Round thousands");
  const hour = Number(new Intl.DateTimeFormat("en-CA", { hour: "numeric", hourCycle: "h23", timeZone: "America/Toronto" }).format(tr.t));
  if (hour < 5) add(10, "Sent between midnight and 5 AM Toronto time");

  let compliance: string | null = null;
  if (tr.amount >= 10000) compliance = "Large-transaction report filed ($10,000+)";
  else {
    const day = history.filter((h) => tr.t - h.t < 86_400_000 && h.amount < 10000);
    const total = day.reduce((a, h) => a + h.amount, 0) + tr.amount;
    if (day.length && total >= 10000) compliance = `Possible structuring: ${money(total)} in 24 hours`;
  }
  const fraudFlag = score >= 60;
  return { score, reasons, fraudFlag, compliance, status: fraudFlag || compliance ? "HELD" : "SETTLED" };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function LedgerFlow() {
  const [history, setHistory] = useState<Transfer[]>([]);
  const [stage, setStage] = useState(-1);
  const [current, setCurrent] = useState<Transfer | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [running, setRunning] = useState(false);
  const hist = useRef<Transfer[]>([]);
  const alive = useRef(true);
  useEffect(() => () => void (alive.current = false), []);

  const play = async (sends: { to: string; amount: number }[]) => {
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
    setRunning(true);
    for (const send of sends) {
      const tr: Transfer = { ...send, t: Date.now() };
      setCurrent(tr);
      setVerdict(null);
      for (const [st, ms] of [[0, 450], [1, 450], [2, 650]] as const) {
        setStage(st);
        await wait(ms * fast);
        if (!alive.current) return;
      }
      const v = judge(hist.current, tr);
      hist.current = [...hist.current, { ...tr, status: v.status }];
      setHistory(hist.current);
      setVerdict(v);
      setStage(3);
      await wait((sends.length > 1 ? 1300 : 200) * fast);
      if (!alive.current) return;
    }
    setRunning(false);
  };

  const reset = () => {
    hist.current = [];
    setHistory([]);
    setStage(-1);
    setVerdict(null);
    setCurrent(null);
  };

  // Lights a service while it works, then shows whether it passed or flagged the transfer.
  const node = (active: boolean, ok?: boolean) => {
    if (active) return " active";
    if (stage === 3 && ok !== undefined) return ok ? " pass" : " flag";
    return "";
  };

  return (
    <div className="panel" aria-label="Loonie Ledger transfer simulator">
      <div className="panel-head">
        <b>try it: send money</b>
        <span>same rules as the real services</span>
      </div>
      <div className="controls">
        {scenarios.map((sc) => (
          <button key={sc.label} className="tbtn" onClick={() => play(sc.sends)} disabled={running}>
            {sc.label}
          </button>
        ))}
        <button className="tbtn" onClick={reset} disabled={running || !history.length}>reset</button>
      </div>

      <div className="flow">
        <div className={`node${node(stage === 0, verdict ? verdict.status === "SETTLED" : undefined)}`}><b>payments</b>Java · holds funds</div>
        <div className={`node${node(stage === 1)}`}><b>stream</b>Redis · outbox event</div>
        <div className={`node${node(stage === 2, verdict ? !verdict.fraudFlag : undefined)}`}><b>fraud</b>Python · scores 0–100</div>
        <div className={`node${node(stage === 2, verdict ? !verdict.compliance : undefined)}`}><b>compliance</b>Node · FINTRAC-style</div>
      </div>

      <div className="verdict" aria-live="polite">
        {!current && <p className="note" style={{ margin: 0 }}>Pick a scenario. Each transfer is held, checked by two independent services, then settled or sent for review.</p>}
        {current && !verdict && (
          <h4>
            {money(current.amount)} → {current.to}
            <span className="pill warn">{["holding funds…", "publishing event…", "checking…"][Math.max(0, stage)]}</span>
          </h4>
        )}
        {current && verdict && (
          <>
            <h4>
              {money(current.amount)} → {current.to}
              <span className={`pill ${verdict.status === "SETTLED" ? "ok" : "warn"}`}>{verdict.status === "SETTLED" ? "settled" : "held for review"}</span>
            </h4>
            <div className="score" title={`Fraud score ${verdict.score}; 60 or more holds the transfer`}>
              <i style={{ width: `${Math.min(100, verdict.score)}%` }} />
            </div>
            <ul>
              <li>
                Fraud score <b style={{ color: verdict.fraudFlag ? "var(--warn)" : "var(--ok)" }}>{verdict.score}</b>
                {verdict.fraudFlag ? " (60+ holds it)" : " (under 60, passes)"}
              </li>
              {verdict.reasons.map((r) => <li key={r} className="mono" style={{ fontSize: 12 }}>{r}</li>)}
              <li>Compliance: {verdict.compliance ?? "clear"}</li>
            </ul>
          </>
        )}
      </div>

      {history.length > 0 && (
        <div className="log">
          {history.slice(-3).reverse().map((h, i) => (
            <div key={`${h.t}-${i}`} className={h.status === "SETTLED" ? "ok" : "warn"}>
              {h.status === "SETTLED" ? "✓" : "⏸"} {money(h.amount)} to {h.to}: {h.status === "SETTLED" ? "settled" : "held for review"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

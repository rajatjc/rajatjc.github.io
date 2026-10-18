"use client";

import { useEffect, useRef, useState } from "react";

// A miniature, in-browser model of lsm-kv: writes go to the WAL and memtable, a full memtable flushes to an
// immutable SSTable with a Bloom filter, and enough SSTables trigger a compaction. Reads walk newest to oldest.

type Entry = [key: string, value: string | null]; // null is a tombstone
type SST = { id: number; entries: Entry[]; bloom: boolean[] };
type Log = { cls: "ok" | "warn" | "bad" | "info" | ""; text: string };
type State = { mem: Entry[]; wal: string[]; ssts: SST[]; nextId: number; log: Log[] };
type Mark = "skip" | "probe" | "found" | "merging";

const MEM_CAP = 4;
const COMPACT_AT = 4;
const BLOOM_BITS = 24;
const WORDS = ["apple", "berry", "cherry", "date", "fig", "grape", "kiwi", "lemon", "mango", "olive", "peach", "plum"];

function fnv(str: string, seed: number) {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return (h >>> 0) % BLOOM_BITS;
}
const bloomOf = (keys: string[]) => {
  const bits = Array<boolean>(BLOOM_BITS).fill(false);
  for (const k of keys) {
    bits[fnv(k, 0)] = true;
    bits[fnv(k, 0x9e3779b9)] = true;
  }
  return bits;
};
const mightContain = (bits: boolean[], k: string) => bits[fnv(k, 0)] && bits[fnv(k, 0x9e3779b9)];

const withLog = (log: Log[], ...lines: Log[]) => [...log, ...lines].slice(-3);

function put(s: State, key: string, value: string | null): State {
  const mem = [...s.mem.filter(([k]) => k !== key), [key, value] as Entry].sort(([a], [b]) => a.localeCompare(b));
  const wal = [...s.wal, value === null ? `DEL ${key}` : `PUT ${key}=${value}`];
  const line: Log = { cls: "", text: value === null ? `DEL ${key} → tombstone in memtable` : `PUT ${key}=${value} → WAL, then memtable` };
  if (mem.length < MEM_CAP) return { ...s, mem, wal, log: withLog(s.log, line) };
  const sst: SST = { id: s.nextId, entries: mem, bloom: bloomOf(mem.map(([k]) => k)) };
  return {
    mem: [],
    wal: [],
    ssts: [sst, ...s.ssts],
    nextId: s.nextId + 1,
    log: withLog(s.log, line, { cls: "ok", text: `memtable full → flushed to SST-${sst.id}, WAL truncated` }),
  };
}

function compact(s: State): State {
  const merged = new Map<string, string | null>();
  let versions = 0;
  for (const t of [...s.ssts].reverse()) for (const [k, v] of t.entries) (versions++, merged.set(k, v));
  const live = [...merged].filter(([, v]) => v !== null).sort(([a], [b]) => a.localeCompare(b)) as Entry[];
  const tombstones = [...merged.values()].filter((v) => v === null).length;
  const sst: SST = { id: s.nextId, entries: live, bloom: bloomOf(live.map(([k]) => k)) };
  return {
    ...s,
    ssts: [sst],
    nextId: s.nextId + 1,
    log: withLog(s.log, {
      cls: "warn",
      text: `compacted ${s.ssts.length} tables → SST-${sst.id}: dropped ${versions - merged.size} stale versions, ${tombstones} tombstones`,
    }),
  };
}

const seed = (): State => {
  let s: State = { mem: [], wal: [], ssts: [], nextId: 1, log: [] };
  for (const [k, v] of [["kiwi", "7"], ["apple", "3"], ["mango", "12"], ["fig", "5"], ["plum", "9"], ["apple", "4"], ["date", "1"], ["olive", "8"], ["grape", "2"]] as const)
    s = put(s, k, v);
  return { ...s, log: [{ cls: "info", text: "Try PUT, GET or DELETE. Four writes fill the memtable." }] };
};

export default function LsmPlayground() {
  const [s, setS] = useState<State>(seed);
  const [key, setKey] = useState("cherry");
  const [val, setVal] = useState("42");
  const [marks, setMarks] = useState<Record<number, Mark>>({});
  const [memHit, setMemHit] = useState<string | null>(null);
  const [compacting, setCompacting] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const commit = (next: State) => {
    setMarks({});
    setMemHit(null);
    setS(next);
    if (next.ssts.length >= COMPACT_AT) {
      setCompacting(true);
      setMarks(Object.fromEntries(next.ssts.map((t) => [t.id, "merging" as Mark])));
      later(() => {
        setS((cur) => compact(cur));
        setMarks({});
        setCompacting(false);
      }, 1100);
    }
  };

  const k = key.trim().toLowerCase().slice(0, 10);
  const doPut = () => k && val.trim() && commit(put(s, k, val.trim().slice(0, 8)));
  const doDel = () => k && commit(put(s, k, null));
  const doRandom = () => {
    let next = s;
    for (let i = 0; i < 3; i++) next = put(next, WORDS[Math.floor(Math.random() * WORDS.length)], String(1 + Math.floor(Math.random() * 99)));
    commit(next);
  };

  const doGet = () => {
    if (!k) return;
    const m: Record<number, Mark> = {};
    const steps: string[] = [];
    let result: Log = { cls: "bad", text: "" };
    const inMem = s.mem.find(([mk]) => mk === k);
    if (inMem) {
      setMemHit(k);
      result = inMem[1] === null ? { cls: "bad", text: `GET ${k} → deleted (tombstone in memtable)` } : { cls: "ok", text: `GET ${k} → ${inMem[1]} (memtable, no disk read)` };
    } else {
      steps.push("memtable: miss");
      let found = false;
      for (const t of s.ssts) {
        if (!mightContain(t.bloom, k)) {
          m[t.id] = "skip";
          steps.push(`SST-${t.id}: Bloom says no`);
          continue;
        }
        const hit = t.entries.find(([ek]) => ek === k);
        if (!hit) {
          m[t.id] = "probe";
          steps.push(`SST-${t.id}: Bloom false positive`);
          continue;
        }
        m[t.id] = "found";
        found = true;
        result = hit[1] === null ? { cls: "bad", text: `GET ${k} → deleted (tombstone in SST-${t.id})` } : { cls: "ok", text: `GET ${k} → ${hit[1]} (SST-${t.id})` };
        break;
      }
      if (!found) result = { cls: "bad", text: `GET ${k} → not found` };
    }
    setMarks(m);
    setS((cur) => ({ ...cur, log: withLog(cur.log, ...(steps.length ? [{ cls: "info" as const, text: steps.join(" · ") }] : []), result) }));
    later(() => {
      setMarks({});
      setMemHit(null);
    }, 2200);
  };

  const onEnter = (e: React.KeyboardEvent) => e.key === "Enter" && doPut();

  return (
    <div className="panel" aria-label="LSM tree playground">
      <div className="panel-head">
        <b>try it: a tiny lsm-kv</b>
        <span>runs in your browser</span>
      </div>
      <div className="controls">
        <input className="field" value={key} onChange={(e) => setKey(e.target.value)} onKeyDown={onEnter} aria-label="Key" placeholder="key" maxLength={10} />
        <input className="field" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onEnter} aria-label="Value" placeholder="value" maxLength={8} style={{ width: 70 }} />
        <button className="tbtn solid" onClick={doPut} disabled={compacting}>PUT</button>
        <button className="tbtn" onClick={doGet} disabled={compacting}>GET</button>
        <button className="tbtn" onClick={doDel} disabled={compacting}>DELETE</button>
        <button className="tbtn" onClick={doRandom} disabled={compacting} title="Write three random keys">+3 random</button>
        <button className="tbtn" onClick={() => (setMarks({}), setS(seed()))} disabled={compacting}>reset</button>
      </div>

      <div className="lane">
        <div className="lane-label"><span>write-ahead log</span><span>{s.wal.length} record{s.wal.length === 1 ? "" : "s"}</span></div>
        <div className="cells">
          {s.wal.length ? s.wal.map((w, i) => <span className="cell" key={`${i}-${w}`}>{w}</span>) : <span className="cell empty">empty</span>}
        </div>
      </div>

      <div className="lane">
        <div className="lane-label"><span>memtable (sorted, in memory)</span><span>{s.mem.length}/{MEM_CAP}</span></div>
        <div className="cells">
          {s.mem.map(([mk, v]) => (
            <span key={mk} className={`cell${v === null ? " tomb" : ""}${memHit === mk ? " hit" : ""}`}>{v === null ? mk : `${mk}=${v}`}</span>
          ))}
          {Array.from({ length: MEM_CAP - s.mem.length }, (_, i) => <span className="cell empty" key={`e${i}`}>·</span>)}
        </div>
      </div>

      <div className="lane">
        <div className="lane-label"><span>sstables on disk, newest first</span><span>{compacting ? "compacting…" : `compacts at ${COMPACT_AT}`}</span></div>
        {s.ssts.length === 0 && <div className="cells"><span className="cell empty">none yet</span></div>}
        {s.ssts.map((t) => (
          <div key={t.id} className={`sst${marks[t.id] ? ` ${marks[t.id]}` : ""}`}>
            <div className="sst-head">
              <span>SST-{t.id} · {t.entries.length} keys{marks[t.id] === "skip" ? " · skipped" : ""}</span>
              <span className="bloom" title="Bloom filter bits">{t.bloom.map((b, i) => <i key={i} className={b ? "on" : ""} />)}</span>
            </div>
            <div className="cells">
              {t.entries.map(([ek, v]) => <span key={ek} className={`cell${v === null ? " tomb" : ""}`}>{v === null ? ek : `${ek}=${v}`}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="log" aria-live="polite">
        {s.log.map((l, i) => <div key={`${i}-${l.text}`} className={l.cls}>{l.text}</div>)}
      </div>
    </div>
  );
}

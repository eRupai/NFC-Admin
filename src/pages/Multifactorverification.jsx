import React, { useState, useMemo } from "react";
import {
  CreditCard, ScanFace, Fingerprint, Eye, ShieldCheck, ShieldAlert, Wifi,
  Clock, MapPin, CheckCircle2, XCircle, RefreshCw, Activity, Hand,
  Search, ScanLine, Copy,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

const SOURCES = ["Door 001 – Main Entrance", "Door 002 – Server Room", "Door 003 – Judge Chamber", "Door 004 – Records Room"];
const SAMPLE_USERS = ["Aditi Sharma", "Rohan Verma", "Kavya Iyer", "Sanjay Nair", "Meera Krishnan", "Vikram Desai", "Unknown"];
const FINGERS = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

const METHODS = [
  { key: "card", label: "Smart Card", icon: CreditCard, desc: "NFC / RFID card verification" },
  { key: "face", label: "Face", icon: ScanFace, desc: "Recognition + liveness detection" },
  { key: "fingerprint", label: "Fingerprint", icon: Fingerprint, desc: "Multi-finger scan matching" },
  { key: "retina", label: "Retina / Iris", icon: Eye, desc: "Iris pattern matching" },
];

const methodStatus = [
  { label: "Smart Card Reader", status: "Operational", tone: "ok" },
  { label: "Face Recognition Engine", status: "Operational", tone: "ok" },
  { label: "Fingerprint Scanner", status: "Operational", tone: "ok" },
  { label: "Retina Scanner — Door 003", status: "Degraded", tone: "warn" },
];

/* ---------------------------------------------------------------------- */
/*  HELPERS                                                                */
/* ---------------------------------------------------------------------- */
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function genCardId() { return `NFC-${randomInt(10000, 99999)}`; }
function timestampNow() {
  return new Date().toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", day: "2-digit", month: "short" });
}
function riskTone(score) {
  if (score <= 20) return { label: "Safe", className: "bg-green-50 text-green-700 border-green-200" };
  if (score <= 60) return { label: "Suspicious", className: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Critical", className: "bg-red-50 text-red-600 border-red-200" };
}

/* ---------------------------------------------------------------------- */
/*  SMALL UI PIECES                                                        */
/* ---------------------------------------------------------------------- */
function StatusDot({ tone }) {
  const color = tone === "ok" ? "bg-green-500" : tone === "warn" ? "bg-amber-500" : "bg-red-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

function ResultBadge({ granted }) {
  return granted ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
      <CheckCircle2 size={12} /> Access Granted
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
      <XCircle size={12} /> Access Denied
    </span>
  );
}

function RiskBadge({ score }) {
  const t = riskTone(score);
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${t.className}`}>{score} · {t.label}</span>;
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

const selectClass = "w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300";

/* ---------------------------------------------------------------------- */
/*  METHOD PANELS                                                          */
/* ---------------------------------------------------------------------- */
function CardPanel({ cardId, setCardId, validityCheck, setValidityCheck }) {
  return (
    <div className="space-y-4">
      <Field label="Unique Card ID">
        <div className="flex items-center gap-2">
          <input value={cardId} readOnly className={selectClass + " font-mono"} />
          <button onClick={() => setCardId(genCardId())} className="w-9 h-9 shrink-0 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <RefreshCw size={14} />
          </button>
        </div>
      </Field>
      <Field label="Card Validity Check">
        <button
          onClick={() => setValidityCheck(!validityCheck)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-sm ${validityCheck ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}
        >
          <span>{validityCheck ? "Card Valid" : "Validity Unconfirmed"}</span>
          <ShieldCheck size={14} />
        </button>
      </Field>
      <p className="text-xs text-gray-400 flex items-center gap-1.5"><Copy size={12} /> Duplicate / cloned card detection runs automatically on scan.</p>
    </div>
  );
}

function FacePanel({ liveness, setLiveness }) {
  return (
    <div className="space-y-4">
      <Field label="Liveness Detection">
        <button
          onClick={() => setLiveness(!liveness)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-sm ${liveness ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}
        >
          <span>{liveness ? "Live Subject Confirmed" : "Liveness Not Checked"}</span>
          <ScanFace size={14} />
        </button>
      </Field>
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
        <ScanFace size={32} className="text-gray-300 mb-2" />
        <p className="text-xs text-gray-400">Face match score is generated on scan</p>
      </div>
    </div>
  );
}

function FingerprintPanel({ selectedFingers, toggleFinger }) {
  return (
    <div className="space-y-4">
      <Field label="Multiple Finger Support — select finger(s)">
        <div className="flex flex-wrap gap-2">
          {FINGERS.map((f) => {
            const active = selectedFingers.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFinger(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border ${active ? "bg-red-50 text-red-600 border-red-200" : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"}`}
              >
                <Hand size={12} /> {f}
              </button>
            );
          })}
        </div>
      </Field>
      <p className="text-xs text-gray-400">At least one finger must be selected to run a scan.</p>
    </div>
  );
}

function RetinaPanel() {
  return (
    <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
      <Eye size={32} className="text-gray-300 mb-2" />
      <p className="text-xs text-gray-400">Iris matching and confidence score are generated on scan</p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE                                                              */
/* ---------------------------------------------------------------------- */
export default function MultiFactorVerification({ onMenuClick }) {
  const [activeMethod, setActiveMethod] = useState("card");
  const [source, setSource] = useState(SOURCES[0]);
  const [logs, setLogs] = useState([
    { id: 1, method: "Smart Card", user: "Aditi Sharma", granted: true, score: 98, risk: 8, source: SOURCES[0], time: "3:41 PM" },
    { id: 2, method: "Fingerprint", user: "Rohan Verma", granted: false, score: 41, risk: 64, source: SOURCES[1], time: "3:38 PM" },
    { id: 3, method: "Smart Card", user: "Unknown", granted: false, score: 0, risk: 92, source: SOURCES[3], time: "3:29 PM" },
  ]);
  const [scanning, setScanning] = useState(false);

  // method-specific state
  const [cardId, setCardId] = useState(genCardId());
  const [validityCheck, setValidityCheck] = useState(true);
  const [liveness, setLiveness] = useState(true);
  const [selectedFingers, setSelectedFingers] = useState(["Index"]);

  function toggleFinger(f) {
    setSelectedFingers((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  const canScan = activeMethod !== "fingerprint" || selectedFingers.length > 0;

  function runScan() {
    if (!canScan || scanning) return;
    setScanning(true);
    setTimeout(() => {
      const methodLabel = METHODS.find((m) => m.key === activeMethod).label;
      const user = randomFrom(SAMPLE_USERS);
      const isClone = activeMethod === "card" && Math.random() < 0.12;
      const isMismatch = !isClone && Math.random() < 0.22;
      const granted = !isClone && !isMismatch;
      const score = granted ? randomInt(85, 99) : randomInt(20, 55);
      const risk = isClone ? randomInt(75, 99) : granted ? randomInt(2, 25) : randomInt(45, 80);

      setLogs((prev) => [
        { id: Date.now(), method: methodLabel, user, granted, score, risk, source, time: timestampNow(), flag: isClone ? "Cloned Card Detected" : !granted ? `${methodLabel} Mismatch` : null },
        ...prev,
      ].slice(0, 12));
      setScanning(false);
    }, 700);
  }

  const successRate = useMemo(() => {
    if (logs.length === 0) return "—";
    const granted = logs.filter((l) => l.granted).length;
    return `${Math.round((granted / logs.length) * 100)}%`;
  }, [logs]);

  const activeM = METHODS.find((m) => m.key === activeMethod);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 text-gray-900" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      {/* TOPBAR (shared shell) */}
      <Topbar onMenuClick={onMenuClick} />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto min-h-0 p-6 space-y-5">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Multi-Factor Verification</h1>
          <p className="text-xs text-gray-500">{logs.length} verification events logged</p>
        </div>

        {/* STATUS STRIP */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          {methodStatus.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-sm">
              <StatusDot tone={s.tone} />
              <span className="text-gray-700">{s.label}</span>
              <span className={`text-xs ${s.tone === "ok" ? "text-green-600" : "text-amber-600"}`}>{s.status}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <Activity size={14} /> Success rate: <span className="font-semibold text-gray-900">{successRate}</span>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* METHOD SELECTOR + PANEL */}
          <div className="xl:col-span-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = activeMethod === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setActiveMethod(m.key)}
                    className={`text-left p-3 rounded-lg border transition-colors ${active ? "bg-red-50 border-red-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
                  >
                    <span className={`w-8 h-8 rounded-md flex items-center justify-center mb-2 ${active ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                      <Icon size={15} />
                    </span>
                    <div className={`text-sm font-medium ${active ? "text-red-700" : "text-gray-900"}`}>{m.label}</div>
                    <div className="text-[11px] text-gray-500 leading-snug mt-0.5">{m.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-4">{activeM.label} Verification</div>

              {activeMethod === "card" && <CardPanel cardId={cardId} setCardId={setCardId} validityCheck={validityCheck} setValidityCheck={setValidityCheck} />}
              {activeMethod === "face" && <FacePanel liveness={liveness} setLiveness={setLiveness} />}
              {activeMethod === "fingerprint" && <FingerprintPanel selectedFingers={selectedFingers} toggleFinger={toggleFinger} />}
              {activeMethod === "retina" && <RetinaPanel />}

              <div className="mt-4">
                <Field label="Verification Source">
                  <select value={source} onChange={(e) => setSource(e.target.value)} className={selectClass}>
                    {SOURCES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <button
                onClick={runScan}
                disabled={!canScan || scanning}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanning ? <RefreshCw size={15} className="animate-spin" /> : <ScanLine size={15} />}
                {scanning ? "Verifying..." : `Run ${activeM.label} Scan`}
              </button>
            </div>
          </div>

          {/* RESULT LOG */}
          <div className="xl:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
                <div className="text-xs font-semibold tracking-wide uppercase text-gray-400">Verification Results</div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md w-56 bg-gray-50 border border-gray-200">
                  <Search size={13} className="text-gray-400" />
                  <input placeholder="Search tracking code..." className="bg-transparent outline-none text-xs w-full placeholder:text-gray-400" />
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0"><Wifi size={12} /> Live</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left font-medium px-4 py-2.5">User</th>
                    <th className="text-left font-medium px-4 py-2.5">Method</th>
                    <th className="text-left font-medium px-4 py-2.5">Result</th>
                    <th className="text-left font-medium px-4 py-2.5">Score</th>
                    <th className="text-left font-medium px-4 py-2.5">Risk Score</th>
                    <th className="text-left font-medium px-4 py-2.5">Source / Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{l.user}</div>
                        {l.flag && <div className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5"><ShieldAlert size={10} /> {l.flag}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{l.method}</td>
                      <td className="px-4 py-3"><ResultBadge granted={l.granted} /></td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{l.score}%</td>
                      <td className="px-4 py-3"><RiskBadge score={l.risk} /></td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-600 flex items-center gap-1"><MapPin size={10} /> {l.source}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {l.time}</div>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-gray-400 py-10 text-sm">No verification events yet — run a scan to begin.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
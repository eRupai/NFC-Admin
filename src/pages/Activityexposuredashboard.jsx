import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Activity, Users, DoorClosed, DoorOpen, ShieldAlert, Gavel, LogIn,
  KeyRound, ShieldCheck, BarChart3, XCircle, AlertTriangle, BellRing,
  Calendar, CalendarX, AlertOctagon, Search, ChevronDown, Radio, Download,
  Flag, Clock, MapPin, X, Check,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  DATA MODEL                                                             */
/* ---------------------------------------------------------------------- */
const CATEGORIES = {
  "User Activity": {
    icon: Users,
    subtypes: [
      { key: "Login History", icon: LogIn },
      { key: "Access History", icon: KeyRound },
      { key: "Verification History", icon: ShieldCheck },
    ],
  },
  "Door Activity": {
    icon: DoorClosed,
    subtypes: [
      { key: "Entry Count", icon: DoorOpen },
      { key: "Exit Count", icon: DoorClosed },
      { key: "Door Usage", icon: BarChart3 },
    ],
  },
  "Security Activity": {
    icon: ShieldAlert,
    subtypes: [
      { key: "Failed Attempts", icon: XCircle },
      { key: "Suspicious Activities", icon: AlertTriangle },
      { key: "Generated Alerts", icon: BellRing },
    ],
  },
  "Legal Activity": {
    icon: Gavel,
    subtypes: [
      { key: "Upcoming Hearings", icon: Calendar },
      { key: "Missed Hearings", icon: CalendarX },
      { key: "Critical Legal Alerts", icon: AlertOctagon },
    ],
  },
};

const USERS = ["Aditi Sharma", "Rohan Verma", "Kavya Iyer", "Sanjay Nair", "Meera Krishnan", "Vikram Desai"];
const DOORS = ["Main Entrance", "Server Room", "Judge Chamber", "Records Room", "West Wing Office"];
const CASES = ["Mehta vs. State Bank", "Singh Property Dispute", "Kapoor Estate Matter", "Verma Tenancy Case"];

const RANGES = [
  { key: "Today", ms: 24 * 60 * 60 * 1000 },
  { key: "This Week", ms: 7 * 24 * 60 * 60 * 1000 },
  { key: "This Month", ms: 30 * 24 * 60 * 60 * 1000 },
];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
let trkCounter = 812;
function genCode(date) {
  trkCounter += 1;
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, "0"), d = String(date.getDate()).padStart(2, "0");
  return `TRK-${y}${m}${d}-${String(trkCounter).padStart(6, "0")}`;
}
function fmtDateTime(d) {
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function buildDetail(category, subtype) {
  if (category === "User Activity") {
    const user = randomFrom(USERS);
    if (subtype === "Login History") return { actor: user, detail: "Logged in via Admin Console" };
    if (subtype === "Access History") return { actor: user, detail: `Accessed ${randomFrom(DOORS)}` };
    return { actor: user, detail: `${randomFrom(["Face", "Fingerprint", "Card", "Retina"])} verification recorded` };
  }
  if (category === "Door Activity") {
    const door = randomFrom(DOORS);
    if (subtype === "Entry Count") return { actor: randomFrom(USERS), detail: `Entry at ${door}`, door };
    if (subtype === "Exit Count") return { actor: randomFrom(USERS), detail: `Exit at ${door}`, door };
    return { actor: "System", detail: `${door} usage spike recorded`, door };
  }
  if (category === "Security Activity") {
    const user = randomFrom(USERS);
    if (subtype === "Failed Attempts") return { actor: user, detail: `Failed verification at ${randomFrom(DOORS)}` };
    if (subtype === "Suspicious Activities") return { actor: user, detail: "Unusual access pattern flagged" };
    return { actor: "System", detail: `Alert generated for ${randomFrom(DOORS)}` };
  }
  // Legal Activity
  const c = randomFrom(CASES);
  if (subtype === "Upcoming Hearings") return { actor: c, detail: "Hearing scheduled within 7 days" };
  if (subtype === "Missed Hearings") return { actor: c, detail: "Hearing date passed without attendance" };
  return { actor: c, detail: "Critical reminder escalated to registrar" };
}

function makeEvent(category, subtype, time) {
  const d = buildDetail(category, subtype);
  return {
    id: time.getTime() + Math.random(),
    category,
    subtype,
    code: genCode(time),
    time,
    flagged: false,
    ...d,
  };
}

function seedEvents() {
  const now = Date.now();
  const events = [];
  Object.entries(CATEGORIES).forEach(([cat, def]) => {
    def.subtypes.forEach((st) => {
      const count = randomInt(5, 9);
      for (let i = 0; i < count; i++) {
        const time = new Date(now - randomInt(2, 30 * 24 * 60) * 60000); // spread across ~30 days
        events.push(makeEvent(cat, st.key, time));
      }
    });
  });
  return events.sort((a, b) => b.time - a.time);
}

/* ---------------------------------------------------------------------- */
/*  SMALL UI                                                               */
/* ---------------------------------------------------------------------- */
function KpiTile({ icon: Icon, label, value, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white border rounded-lg p-4 transition-colors ${active ? "border-red-300 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`w-8 h-8 rounded-md flex items-center justify-center ${active ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500"}`}>
          <Icon size={15} />
        </span>
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </button>
  );
}

function CategoryTab({ name, def, active, onClick, count }) {
  const Icon = def.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-red-50 text-red-600 border border-red-200" : "text-gray-500 border border-transparent hover:bg-gray-100"
      }`}
    >
      <Icon size={15} /> {name}
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE (standalone — no sidebar / topbar)                          */
/* ---------------------------------------------------------------------- */
export default function ActivityExposureDashboard() {
  const [events, setEvents] = useState(seedEvents);
  const [activeCategory, setActiveCategory] = useState("User Activity");
  const [activeSubtype, setActiveSubtype] = useState(null);
  const [range, setRange] = useState("This Week");
  const [search, setSearch] = useState("");
  const [liveMode, setLiveMode] = useState(false);
  const [toast, setToast] = useState("");
  const intervalRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  function injectEvent() {
    const cat = randomFrom(Object.keys(CATEGORIES));
    const st = randomFrom(CATEGORIES[cat].subtypes).key;
    setEvents((prev) => [makeEvent(cat, st, new Date()), ...prev].slice(0, 400));
  }

  useEffect(() => {
    if (liveMode) intervalRef.current = setInterval(injectEvent, 6000);
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [liveMode]);

  const rangeMs = RANGES.find((r) => r.key === range).ms;

  const inRange = useMemo(() => {
    const cutoff = Date.now() - rangeMs;
    return events.filter((e) => e.time.getTime() >= cutoff);
  }, [events, rangeMs]);

  const categoryEvents = useMemo(() => inRange.filter((e) => e.category === activeCategory), [inRange, activeCategory]);

  const subtypeCounts = useMemo(() => {
    const counts = {};
    CATEGORIES[activeCategory].subtypes.forEach((s) => { counts[s.key] = 0; });
    categoryEvents.forEach((e) => { counts[e.subtype] = (counts[e.subtype] || 0) + 1; });
    return counts;
  }, [categoryEvents, activeCategory]);

  const visibleRows = useMemo(() => {
    return categoryEvents
      .filter((e) => !activeSubtype || e.subtype === activeSubtype)
      .filter((e) => `${e.actor} ${e.detail} ${e.code}`.toLowerCase().includes(search.toLowerCase()));
  }, [categoryEvents, activeSubtype, search]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    Object.keys(CATEGORIES).forEach((cat) => { totals[cat] = inRange.filter((e) => e.category === cat).length; });
    return totals;
  }, [inRange]);

  const flaggedCount = useMemo(() => inRange.filter((e) => e.flagged).length, [inRange]);

  function toggleFlag(id) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, flagged: !e.flagged } : e)));
  }

  function exportCsv() {
    const header = ["Tracking Code", "Category", "Subtype", "Actor / Case", "Detail", "Time", "Flagged"];
    const lines = visibleRows.map((e) => [e.code, e.category, e.subtype, e.actor, `"${e.detail}"`, e.time.toISOString(), e.flagged].join(","));
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-exposure-${activeCategory.replace(/\s/g, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${visibleRows.length} records`);
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 p-6 space-y-5" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-red-600 text-white flex items-center justify-center"><Activity size={15} /></span>
            Activity Exposure Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">{inRange.length} events in range · {flaggedCount} flagged for review</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${range === r.key ? "bg-red-50 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {r.key}
              </button>
            ))}
          </div>
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md font-medium border ${liveMode ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"}`}
          >
            <Radio size={14} className={liveMode ? "animate-pulse" : ""} /> Live
          </button>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(CATEGORIES).map(([name, def]) => (
          <CategoryTab
            key={name}
            name={name}
            def={def}
            active={activeCategory === name}
            count={categoryTotals[name] || 0}
            onClick={() => { setActiveCategory(name); setActiveSubtype(null); }}
          />
        ))}
      </div>

      {/* KPI TILES (drill-down) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES[activeCategory].subtypes.map((s) => (
          <KpiTile
            key={s.key}
            icon={s.icon}
            label={s.key}
            value={subtypeCounts[s.key] || 0}
            active={activeSubtype === s.key}
            onClick={() => setActiveSubtype(activeSubtype === s.key ? null : s.key)}
          />
        ))}
      </section>

      {/* TOOLBAR */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md w-64 bg-gray-50 border border-gray-200">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor, detail, code..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </div>
        {activeSubtype && (
          <button onClick={() => setActiveSubtype(null)} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md bg-red-50 text-red-600 border border-red-200">
            {activeSubtype} <X size={12} />
          </button>
        )}
        <button onClick={exportCsv} className="ml-auto flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium">
          <Download size={14} /> Export CSV
        </button>
      </section>

      {/* DETAIL TABLE */}
      <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">Tracking Code</th>
              <th className="text-left font-medium px-4 py-3">Subtype</th>
              <th className="text-left font-medium px-4 py-3">Actor / Case</th>
              <th className="text-left font-medium px-4 py-3">Detail</th>
              <th className="text-left font-medium px-4 py-3">Time</th>
              <th className="text-right font-medium px-4 py-3">Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visibleRows.slice(0, 60).map((e) => (
              <tr key={e.id} className={`hover:bg-gray-50 ${e.flagged ? "bg-amber-50/50" : ""}`}>
                <td className="px-4 py-3 font-mono text-xs text-red-600">{e.code}</td>
                <td className="px-4 py-3 text-gray-700">{e.subtype}</td>
                <td className="px-4 py-3 text-gray-900">{e.actor}</td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{e.detail}</td>
                <td className="px-4 py-3">
                  <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {fmtDateTime(e.time)}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleFlag(e.id)}
                    title={e.flagged ? "Unflag" : "Flag for review"}
                    className={`w-8 h-8 rounded-md inline-flex items-center justify-center ${e.flagged ? "text-amber-600 bg-amber-50" : "text-gray-400 hover:bg-gray-100"}`}
                  >
                    <Flag size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-400 py-10 text-sm">No events match your filters in this range.</td></tr>
            )}
          </tbody>
        </table>
        {visibleRows.length > 60 && (
          <div className="px-4 py-3 text-center text-xs text-gray-400 border-t border-gray-100">
            Showing 60 of {visibleRows.length} — refine your search or narrow the time range.
          </div>
        )}
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md shadow-lg z-50">{toast}</div>
      )}
    </div>
  );
}
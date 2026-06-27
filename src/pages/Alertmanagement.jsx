import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  AlertTriangle, ShieldAlert, ShieldX, Info, ScanFace, Fingerprint, Eye,
  CreditCard, Copy, UserX, MonitorSmartphone, MapPin, KeyRound, Plus,
  Search, ChevronDown, Check, X, Lock, Unlock, BellRing, Clock, Download,
  Radio, MessageSquare, Send, AlertOctagon, CheckSquare, Square,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  DATA                                                                   */
/* ---------------------------------------------------------------------- */
const TRIGGERS = [
  { key: "Face Mismatch", icon: ScanFace, level: "Critical" },
  { key: "Fingerprint Mismatch", icon: Fingerprint, level: "Critical" },
  { key: "Retina Mismatch", icon: Eye, level: "Critical" },
  { key: "Invalid Card", icon: CreditCard, level: "Warning" },
  { key: "Cloned Card", icon: Copy, level: "Critical" },
  { key: "Unauthorized Access", icon: UserX, level: "Critical" },
  { key: "Device Change", icon: MonitorSmartphone, level: "Warning" },
  { key: "Location Mismatch", icon: MapPin, level: "Warning" },
  { key: "Suspicious Login Pattern", icon: KeyRound, level: "Information" },
];

const LEVELS = [
  { key: "Critical", icon: ShieldX, tone: "bg-red-50 text-red-600 border-red-200", actions: ["Immediate Lock", "Security Notification", "Admin Notification"] },
  { key: "Warning", icon: ShieldAlert, tone: "bg-amber-50 text-amber-700 border-amber-200", actions: ["Retry Allowed", "Activity Logged"] },
  { key: "Information", icon: Info, tone: "bg-blue-50 text-blue-700 border-blue-200", actions: ["Event Recorded"] },
];

const USERS = ["Aditi Sharma", "Rohan Verma", "Kavya Iyer", "Sanjay Nair", "Meera Krishnan", "Unknown"];
const LOCATIONS = ["Main Entrance", "Server Room", "Judge Chamber", "Records Room", "West Wing Office"];
const OVERDUE_MS = 3 * 60 * 1000; // 3 minutes "real time" = overdue, for demo purposes

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
let trkCounter = 712;
function genTrackingCode(date) {
  trkCounter += 1;
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, "0"), d = String(date.getDate()).padStart(2, "0");
  return `TRK-${y}${m}${d}-${String(trkCounter).padStart(6, "0")}`;
}
function fmtTime(d) { return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
function elapsedLabel(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s ago`;
}

function makeNotifications(level, time) {
  const def = LEVELS.find((l) => l.key === level);
  return def.actions.map((action, i) => ({
    action,
    time: new Date(time.getTime() + i * 400),
    sentTo: action.includes("Security") ? "Security Officer on duty" : action.includes("Admin") ? "Super Admin" : "System Log",
  }));
}

function seedAlerts() {
  const now = Date.now();
  const picks = ["Cloned Card", "Face Mismatch", "Device Change", "Suspicious Login Pattern", "Unauthorized Access"];
  return picks.map((key, i) => {
    const trig = TRIGGERS.find((t) => t.key === key);
    const time = new Date(now - i * 90000 - 30000);
    const status = i === 0 ? "Open" : i === 1 ? "Acknowledged" : "Resolved";
    return {
      id: time.getTime() + i,
      trigger: key,
      level: trig.level,
      user: randomFrom(USERS),
      location: randomFrom(LOCATIONS),
      time,
      code: genTrackingCode(time),
      status,
      notifications: makeNotifications(trig.level, time),
      notes: status === "Resolved" ? "Verified false positive after manual review." : "",
      locked: false,
    };
  });
}

function toCsv(rows) {
  const header = ["Tracking Code", "Trigger", "Level", "User", "Location", "Status", "Time"];
  const lines = rows.map((a) => [a.code, a.trigger, a.level, a.user, a.location, a.status, a.time.toISOString()].join(","));
  return [header.join(","), ...lines].join("\n");
}

/* ---------------------------------------------------------------------- */
/*  SMALL UI                                                               */
/* ---------------------------------------------------------------------- */
function StatCard({ label, value, tone, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white border rounded-lg p-4 text-left transition-colors ${active ? "border-red-300 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300"}`}
    >
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-semibold mt-2 ${tone || "text-gray-900"}`}>{value}</div>
    </button>
  );
}

function LevelBadge({ level }) {
  const def = LEVELS.find((l) => l.key === level);
  const Icon = def.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${def.tone}`}>
      <Icon size={12} /> {level}
    </span>
  );
}

function StatusPill({ status }) {
  if (status === "Open") return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-600 text-white">Open</span>;
  if (status === "Acknowledged") return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Acknowledged</span>;
  return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">Resolved</span>;
}

function LevelLegendCard({ level }) {
  const Icon = level.icon;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-8 h-8 rounded-md flex items-center justify-center border ${level.tone}`}>
          <Icon size={15} />
        </span>
        <span className="text-sm font-semibold text-gray-900">{level.key}</span>
      </div>
      <ul className="space-y-1.5">
        {level.actions.map((a) => (
          <li key={a} className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" /> {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailModal({ alert, now, onClose, onResolve }) {
  const [note, setNote] = useState(alert?.notes || "");
  if (!alert) return null;
  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <LevelBadge level={alert.level} />
            <h3 className="text-sm font-semibold text-gray-900">{alert.trigger}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-gray-400">Tracking Code</dt><dd className="font-mono text-red-600 text-xs mt-0.5">{alert.code}</dd></div>
            <div><dt className="text-xs text-gray-400">User</dt><dd className="text-gray-900 mt-0.5">{alert.user}</dd></div>
            <div><dt className="text-xs text-gray-400">Location</dt><dd className="text-gray-900 mt-0.5">{alert.location}</dd></div>
            <div><dt className="text-xs text-gray-400">Raised</dt><dd className="text-gray-900 mt-0.5">{elapsedLabel(now - alert.time.getTime())}</dd></div>
          </dl>

          <div>
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-2 flex items-center gap-1.5">
              <Send size={11} /> Notification Log
            </div>
            <ul className="space-y-1.5">
              {alert.notifications.map((n, i) => (
                <li key={i} className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-md px-3 py-2">
                  <span className="text-gray-700">{n.action} → {n.sentTo}</span>
                  <span className="text-gray-400">{fmtTime(n.time)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-2 flex items-center gap-1.5">
              <MessageSquare size={11} /> Resolution Notes
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Add investigation notes before resolving..."
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">Close</button>
          <button
            onClick={() => onResolve(alert.id, note)}
            disabled={alert.status === "Resolved"}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {alert.status === "Resolved" ? "Already Resolved" : "Resolve with Note"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE (standalone — no sidebar / topbar)                          */
/* ---------------------------------------------------------------------- */
export default function AlertManagement() {
  const [alerts, setAlerts] = useState(seedAlerts);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(new Set());
  const [liveMode, setLiveMode] = useState(false);
  const [lockedLocations, setLockedLocations] = useState(new Set());
  const [now, setNow] = useState(Date.now());
  const [detailAlert, setDetailAlert] = useState(null);
  const [toast, setToast] = useState("");
  const intervalRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  // ticking clock for live "elapsed"/overdue calculations
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  function createAlert() {
    const trig = randomFrom(TRIGGERS);
    const time = new Date();
    const newAlert = {
      id: time.getTime() + Math.random(),
      trigger: trig.key,
      level: trig.level,
      user: randomFrom(USERS),
      location: randomFrom(LOCATIONS),
      time,
      code: genTrackingCode(time),
      status: "Open",
      notifications: makeNotifications(trig.level, time),
      notes: "",
      locked: false,
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 40));
    if (trig.level === "Critical") showToast(`Critical alert: ${trig.key} — notifications dispatched`);
  }

  // live auto-simulation
  useEffect(() => {
    if (liveMode) {
      intervalRef.current = setInterval(createAlert, 7000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [liveMode]);

  function setStatus(id, status) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  function resolveWithNote(id, note) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Resolved", notes: note } : a)));
    setDetailAlert(null);
    showToast("Alert resolved and noted");
  }

  function toggleLock(location) {
    setLockedLocations((prev) => {
      const next = new Set(prev);
      if (next.has(location)) { next.delete(location); showToast(`${location} unlocked`); }
      else { next.add(location); showToast(`${location} immediately locked`); }
      return next;
    });
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function bulkAction(status) {
    setAlerts((prev) => prev.map((a) => (selected.has(a.id) ? { ...a, status } : a)));
    showToast(`${selected.size} alert(s) marked ${status}`);
    setSelected(new Set());
  }

  function exportCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alerts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} alerts to CSV`);
  }

  const filtered = useMemo(() => {
    return alerts
      .filter((a) => {
        const matchesSearch = `${a.user} ${a.code} ${a.trigger}`.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = levelFilter === "All" || a.level === levelFilter;
        const matchesStatus = statusFilter === "All" || a.status === statusFilter;
        return matchesSearch && matchesLevel && matchesStatus;
      })
      .sort((a, b) => b.time - a.time);
  }, [alerts, search, levelFilter, statusFilter]);

  const stats = useMemo(() => ({
    open: alerts.filter((a) => a.status === "Open").length,
    critical: alerts.filter((a) => a.level === "Critical" && a.status !== "Resolved").length,
    warning: alerts.filter((a) => a.level === "Warning" && a.status !== "Resolved").length,
    overdue: alerts.filter((a) => a.status === "Open" && now - a.time.getTime() > OVERDUE_MS).length,
  }), [alerts, now]);

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 p-6 space-y-5" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-red-600 text-white flex items-center justify-center"><BellRing size={15} /></span>
            Alert Management System
          </h1>
          <p className="text-xs text-gray-500 mt-1">{stats.open} open · {stats.overdue} overdue beyond 3 minutes</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium border ${liveMode ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"}`}
          >
            <Radio size={14} className={liveMode ? "animate-pulse" : ""} /> {liveMode ? "Live Simulation: On" : "Live Simulation: Off"}
          </button>
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={createAlert} className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 font-medium">
            <Plus size={15} /> Simulate Alert
          </button>
        </div>
      </div>

      {/* STATS (clickable quick filters) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Open Alerts" value={stats.open} tone="text-red-600" active={statusFilter === "Open"} onClick={() => setStatusFilter(statusFilter === "Open" ? "All" : "Open")} />
        <StatCard label="Critical (Unresolved)" value={stats.critical} active={levelFilter === "Critical"} onClick={() => setLevelFilter(levelFilter === "Critical" ? "All" : "Critical")} />
        <StatCard label="Warning (Unresolved)" value={stats.warning} active={levelFilter === "Warning"} onClick={() => setLevelFilter(levelFilter === "Warning" ? "All" : "Warning")} />
        <StatCard label="Overdue > 3 min" value={stats.overdue} tone={stats.overdue > 0 ? "text-red-600" : undefined} />
      </section>

      {/* LOCKED LOCATIONS BANNER */}
      {lockedLocations.size > 0 && (
        <section className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 flex-wrap">
          <Lock size={14} className="text-red-600 shrink-0" />
          <span className="text-sm text-red-700 font-medium">Locked now:</span>
          {[...lockedLocations].map((loc) => (
            <button key={loc} onClick={() => toggleLock(loc)} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-red-200 text-red-600 flex items-center gap-1.5 hover:bg-red-100">
              {loc} <Unlock size={11} />
            </button>
          ))}
        </section>
      )}

      {/* LEVEL LEGEND */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LEVELS.map((l) => <LevelLegendCard key={l.key} level={l} />)}
      </section>

      {/* TOOLBAR */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md w-64 bg-gray-50 border border-gray-200">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking code, user, trigger..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </div>
        <div className="relative">
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700">
            <option value="All">All Levels</option>
            {LEVELS.map((l) => <option key={l.key}>{l.key}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700">
            <option value="All">All Status</option>
            <option>Open</option>
            <option>Acknowledged</option>
            <option>Resolved</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
        </div>

        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">{selected.size} selected</span>
            <button onClick={() => bulkAction("Acknowledged")} className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100">Acknowledge</button>
            <button onClick={() => bulkAction("Resolved")} className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700">Resolve</button>
          </div>
        )}
      </section>

      {/* ALERT LIST */}
      <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 w-8"></th>
              <th className="text-left font-medium px-4 py-3">Trigger</th>
              <th className="text-left font-medium px-4 py-3">Level</th>
              <th className="text-left font-medium px-4 py-3">User</th>
              <th className="text-left font-medium px-4 py-3">Location / Raised</th>
              <th className="text-left font-medium px-4 py-3">Tracking Code</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
              <th className="text-right font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((a) => {
              const trig = TRIGGERS.find((t) => t.key === a.trigger);
              const Icon = trig.icon;
              const overdue = a.status === "Open" && now - a.time.getTime() > OVERDUE_MS;
              const locked = lockedLocations.has(a.location);
              return (
                <tr key={a.id} className={`hover:bg-gray-50 ${overdue ? "bg-red-50/40" : ""}`}>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSelect(a.id)} className="text-gray-400 hover:text-gray-600">
                      {selected.has(a.id) ? <CheckSquare size={15} className="text-red-600" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetailAlert(a)} className="flex items-center gap-2 text-left hover:underline">
                      <span className="w-7 h-7 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center shrink-0"><Icon size={13} /></span>
                      <span className="text-gray-900">{a.trigger}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3"><LevelBadge level={a.level} /></td>
                  <td className="px-4 py-3 text-gray-700">{a.user}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-700 flex items-center gap-1">
                      <MapPin size={10} className="text-gray-400" /> {a.location} {locked && <Lock size={10} className="text-red-500" />}
                    </div>
                    <div className={`text-[11px] flex items-center gap-1 mt-0.5 ${overdue ? "text-red-600 font-medium" : "text-gray-400"}`}>
                      <Clock size={10} /> {elapsedLabel(now - a.time.getTime())} {overdue && <AlertOctagon size={10} />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-red-600">{a.code}</td>
                  <td className="px-4 py-3"><StatusPill status={a.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {a.status === "Open" && (
                        <button onClick={() => setStatus(a.id, "Acknowledged")} title="Acknowledge" className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100">
                          <Check size={14} />
                        </button>
                      )}
                      {a.status !== "Resolved" && (
                        <button onClick={() => setDetailAlert(a)} title="Resolve with note" className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100">
                          <MessageSquare size={14} />
                        </button>
                      )}
                      {a.level === "Critical" && (
                        <button onClick={() => toggleLock(a.location)} title={locked ? "Unlock door" : "Immediate Lock"} className={`w-8 h-8 rounded-md flex items-center justify-center ${locked ? "text-red-600 bg-red-50" : "text-red-500 hover:bg-red-50"}`}>
                          {locked ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-gray-400 py-10 text-sm">No alerts match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <DetailModal alert={detailAlert} now={now} onClose={() => setDetailAlert(null)} onResolve={resolveWithNote} />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md shadow-lg z-50">{toast}</div>
      )}
    </div>
  );
}
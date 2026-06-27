import React, { useState, useMemo } from "react";
import {
  Search, ChevronDown, X, Plus, Download, Eye, ScrollText,
  CheckCircle2, XCircle, AlertOctagon, Clock, MapPin,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

const EVENT_TYPES = ["Access Attempt", "Permission Change", "Door Override", "Card Reissue", "User Deactivation", "Data Export", "Settings Change", "Verification Override"];
const STATUSES = ["Success", "Failed", "Flagged"];
const PURPOSES = ["Incident Investigation", "Legal Evidence", "Security Analysis", "Compliance Review"];
const USERS = ["Aditi Sharma", "Rohan Verma", "Kavya Iyer", "Sanjay Nair", "Meera Krishnan", "System"];
const DEVICES = ["Admin Console", "Smart Card Reader", "Face Scanner", "Mobile App", "Server Terminal"];
const LOCATIONS = ["Main Entrance", "Server Room", "Judge Chamber", "Records Room", "Registrar Office"];

let trkCounter = 612;
function genTrackingCode(date) {
  trkCounter += 1;
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, "0"), d = String(date.getDate()).padStart(2, "0");
  return `TRK-${y}${m}${d}-${String(trkCounter).padStart(6, "0")}`;
}
function fmtDateTime(d) {
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function seedAudits() {
  const now = Date.now();
  const rows = [
    { event: "Permission Change", action: "Granted 'Audit Access' to Sanjay Nair", status: "Success", purpose: "Compliance Review" },
    { event: "Door Override", action: "Manually unlocked Door 003 — Judge Chamber", status: "Flagged", purpose: "Incident Investigation" },
    { event: "Access Attempt", action: "Cloned card detected at West Wing reader", status: "Failed", purpose: "Security Analysis" },
    { event: "Card Reissue", action: "Reissued Smart Card for Vikram Desai", status: "Success", purpose: "Compliance Review" },
    { event: "User Deactivation", action: "Deactivated account USR-1006", status: "Success", purpose: "Legal Evidence" },
    { event: "Data Export", action: "Exported entry/exit log (last 30 days)", status: "Success", purpose: "Legal Evidence" },
    { event: "Settings Change", action: "Updated risk threshold: Suspicious 21–60", status: "Success", purpose: "Compliance Review" },
    { event: "Verification Override", action: "Manual override after retina scanner fault", status: "Flagged", purpose: "Incident Investigation" },
  ];
  return rows.map((r, i) => {
    const time = new Date(now - i * 47 * 60000);
    return {
      id: time.getTime() + i,
      trackingCode: genTrackingCode(time),
      user: randomFrom(USERS),
      event: r.event,
      action: r.action,
      time,
      device: randomFrom(DEVICES),
      location: randomFrom(LOCATIONS),
      status: r.status,
      purpose: r.purpose,
    };
  });
}

const emptyForm = { user: USERS[0], event: EVENT_TYPES[0], action: "", device: DEVICES[0], location: LOCATIONS[0], status: "Success", purpose: PURPOSES[0] };

/* ---------------------------------------------------------------------- */
/*  SMALL UI                                                               */
/* ---------------------------------------------------------------------- */
function StatCard({ label, value, tone }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-semibold mt-2 ${tone || "text-gray-900"}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "Success") return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"><CheckCircle2 size={12} /> Success</span>;
  if (status === "Failed") return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200"><XCircle size={12} /> Failed</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200"><AlertOctagon size={12} /> Flagged</span>;
}

function Toast({ message }) {
  if (!message) return null;
  return <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md shadow-lg z-50">{message}</div>;
}

function fieldClass() {
  return "w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300";
}

function LogEventModal({ open, form, setForm, onClose, onSave }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Log Audit Event</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">User</label>
              <select value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} className={fieldClass()}>
                {USERS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Event Type</label>
              <select value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} className={fieldClass()}>
                {EVENT_TYPES.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Action Performed</label>
            <textarea
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
              rows={2}
              placeholder="Describe the action performed..."
              className={fieldClass()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Device</label>
              <select value={form.device} onChange={(e) => setForm({ ...form, device: e.target.value })} className={fieldClass()}>
                {DEVICES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={fieldClass()}>
                {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={fieldClass()}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Purpose</label>
              <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className={fieldClass()}>
                {PURPOSES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">Cancel</button>
          <button
            onClick={onSave}
            disabled={!form.action.trim()}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Log Event
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ entry, onClose }) {
  if (!entry) return null;
  const rows = [
    ["Tracking Code", entry.trackingCode],
    ["User", entry.user],
    ["Event Type", entry.event],
    ["Action Performed", entry.action],
    ["Date & Time", fmtDateTime(entry.time)],
    ["Device", entry.device],
    ["Location", entry.location],
    ["Status", entry.status],
    ["Purpose", entry.purpose],
  ];
  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-red-50 text-red-600 flex items-center justify-center"><ScrollText size={15} /></span>
            <h3 className="text-sm font-semibold text-gray-900">Audit Record</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="p-5">
          <dl className="divide-y divide-gray-100">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 py-2.5 text-sm">
                <dt className="text-gray-500 shrink-0">{label}</dt>
                <dd className={`text-right ${label === "Tracking Code" ? "font-mono text-red-600 text-xs" : "text-gray-900"}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="px-5 py-4 border-t border-gray-200 text-[11px] text-gray-400">
          This record is retained as part of the system's permanent audit ledger.
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE                                                              */
/* ---------------------------------------------------------------------- */
export default function AuditTrail({ onMenuClick }) {
  const [audits, setAudits] = useState(seedAudits);
  const [search, setSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [detailEntry, setDetailEntry] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const filtered = useMemo(() => {
    return audits.filter((a) => {
      const matchesSearch = `${a.user} ${a.trackingCode} ${a.action}`.toLowerCase().includes(search.toLowerCase());
      const matchesPurpose = purposeFilter === "All" || a.purpose === purposeFilter;
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesPurpose && matchesStatus;
    });
  }, [audits, search, purposeFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: audits.length,
    flagged: audits.filter((a) => a.status === "Flagged").length,
    compliance: audits.filter((a) => a.purpose === "Compliance Review").length,
    failed: audits.filter((a) => a.status === "Failed").length,
  }), [audits]);

  function changePurpose(id, purpose) {
    setAudits(audits.map((a) => (a.id === id ? { ...a, purpose } : a)));
    showToast("Purpose updated");
  }

  function logEvent() {
    const now = new Date();
    setAudits([
      { id: now.getTime(), trackingCode: genTrackingCode(now), user: form.user, event: form.event, action: form.action, time: now, device: form.device, location: form.location, status: form.status, purpose: form.purpose },
      ...audits,
    ]);
    showToast("Audit event logged");
    setForm(emptyForm);
    setLogOpen(false);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 text-gray-900" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      {/* TOPBAR (shared shell) */}
      <Topbar onMenuClick={onMenuClick} />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto min-h-0 p-6 space-y-5">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Audit Trail System</h1>
          <p className="text-xs text-gray-500">{stats.total} records · permanent ledger</p>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Audit Entries" value={stats.total} tone="text-red-600" />
          <StatCard label="Flagged for Investigation" value={stats.flagged} />
          <StatCard label="Compliance Reviews" value={stats.compliance} />
          <StatCard label="Failed Events" value={stats.failed} />
        </section>

        {/* TOOLBAR */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md w-64 bg-gray-50 border border-gray-200">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracking code, user, action..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
          <div className="relative">
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700"
            >
              <option value="All">All Purposes</option>
              {PURPOSES.map((p) => <option key={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700"
            >
              <option value="All">All Status</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => showToast("Audit report exported")}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 font-medium"
            >
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => setLogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 font-medium"
            >
              <Plus size={15} /> Log Audit Event
            </button>
          </div>
        </section>

        {/* TABLE */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left font-medium px-4 py-3">Tracking Code</th>
                <th className="text-left font-medium px-4 py-3">User</th>
                <th className="text-left font-medium px-4 py-3">Event / Action</th>
                <th className="text-left font-medium px-4 py-3">Date & Time</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Purpose</th>
                <th className="text-right font-medium px-4 py-3">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-red-600">{a.trackingCode}</td>
                  <td className="px-4 py-3 text-gray-900">{a.user}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-gray-900">{a.event}</div>
                    <div className="text-xs text-gray-500 truncate">{a.action}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700 text-xs flex items-center gap-1"><Clock size={11} className="text-gray-400" /> {fmtDateTime(a.time)}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {a.location}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <select
                      value={a.purpose}
                      onChange={(e) => changePurpose(a.id, e.target.value)}
                      className="text-xs rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-gray-700"
                    >
                      {PURPOSES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDetailEntry(a)} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100">
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-gray-400 py-10 text-sm">No audit records match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      <LogEventModal open={logOpen} form={form} setForm={setForm} onClose={() => setLogOpen(false)} onSave={logEvent} />
      <DetailModal entry={detailEntry} onClose={() => setDetailEntry(null)} />
      <Toast message={toast} />
    </div>
  );
}
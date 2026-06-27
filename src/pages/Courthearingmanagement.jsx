import React, { useState, useMemo, useEffect } from "react";
import {
  Gavel, Calendar, Clock, User, Scale, MapPin, AlertOctagon, CheckCircle2,
  RotateCcw, Plus, Search, ChevronDown, X, BellRing, Repeat, Check, Send,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  DATA                                                                   */
/* ---------------------------------------------------------------------- */
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["Scheduled", "Adjourned", "Completed", "Missed"];

const REMINDER_THRESHOLDS = [
  { key: "7 Days Before", ms: 7 * 24 * 60 * 60 * 1000 },
  { key: "24 Hours Before", ms: 24 * 60 * 60 * 1000 },
  { key: "2 Hours Before", ms: 2 * 60 * 60 * 1000 },
  { key: "30 Minutes Before", ms: 30 * 60 * 1000 },
  { key: "15 Minutes Before", ms: 15 * 60 * 1000 },
];

const COURTS = ["District Court Rm. 4", "Civil Court Rm. 1", "District Court Rm. 2", "Sessions Court Rm. 3"];
const JUDGES = ["Hon. Justice Rao", "Hon. Justice Bhatt", "Hon. Justice Menon"];
const ADVOCATES = ["Aditi Sharma", "Vikram Desai", "Meera Krishnan"];

function inMinutes(mins) { return new Date(Date.now() + mins * 60000); }

const emptyForm = { caseName: "", court: COURTS[0], judge: JUDGES[0], advocate: ADVOCATES[0], hearingTime: "", priority: "Medium" };

function seedCases() {
  return [
    { id: "CASE-101", caseName: "Mehta vs. State Bank", court: COURTS[0], judge: JUDGES[0], advocate: ADVOCATES[0], hearingTime: inMinutes(8), priority: "High", status: "Scheduled", notes: "" },
    { id: "CASE-102", caseName: "Singh Property Dispute", court: COURTS[1], judge: JUDGES[1], advocate: ADVOCATES[1], hearingTime: inMinutes(90), priority: "Medium", status: "Scheduled", notes: "" },
    { id: "CASE-103", caseName: "Kapoor Estate Matter", court: COURTS[2], judge: JUDGES[2], advocate: ADVOCATES[2], hearingTime: inMinutes(60 * 20), priority: "Low", status: "Scheduled", notes: "" },
    { id: "CASE-104", caseName: "Verma Tenancy Case", court: COURTS[3], judge: JUDGES[0], advocate: ADVOCATES[0], hearingTime: inMinutes(60 * 24 * 9), priority: "Medium", status: "Scheduled", notes: "" },
    { id: "CASE-105", caseName: "Joshi Contract Breach", court: COURTS[1], judge: JUDGES[1], advocate: ADVOCATES[2], hearingTime: inMinutes(-45), priority: "High", status: "Scheduled", notes: "" },
  ];
}

function fmtDateTime(d) {
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function countdownLabel(ms) {
  const abs = Math.abs(ms);
  const mins = Math.floor(abs / 60000);
  const days = Math.floor(mins / 1440);
  const hrs = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  let label;
  if (days > 0) label = `${days}d ${hrs}h`;
  else if (hrs > 0) label = `${hrs}h ${m}m`;
  else label = `${m}m`;
  return ms >= 0 ? `in ${label}` : `${label} overdue`;
}

const priorityTone = { High: "bg-red-50 text-red-600 border-red-200", Medium: "bg-amber-50 text-amber-700 border-amber-200", Low: "bg-gray-100 text-gray-600 border-gray-200" };
const statusTone = { Scheduled: "bg-blue-50 text-blue-700 border-blue-200", Adjourned: "bg-amber-50 text-amber-700 border-amber-200", Completed: "bg-green-50 text-green-700 border-green-200", Missed: "bg-red-600 text-white border-red-600" };

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

function PriorityBadge({ p }) { return <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${priorityTone[p]}`}>{p}</span>; }
function StatusBadge({ s }) { return <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusTone[s]}`}>{s}</span>; }

function ReminderTimeline({ hearingTime, now }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {REMINDER_THRESHOLDS.map((r) => {
        const fired = now >= hearingTime.getTime() - r.ms;
        return (
          <span
            key={r.key}
            title={r.key}
            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${fired ? "bg-red-50 text-red-600 border-red-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}
          >
            {fired ? <Check size={10} /> : <Clock size={10} />} {r.key.replace(" Before", "")}
          </span>
        );
      })}
    </div>
  );
}

function fieldClass() {
  return "w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300";
}

function CaseModal({ open, form, setForm, onClose, onSave }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Schedule Hearing</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Case Name</label>
            <input value={form.caseName} onChange={(e) => setForm({ ...form, caseName: e.target.value })} className={fieldClass()} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Court Name</label>
              <select value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} className={fieldClass()}>
                {COURTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Judge Name</label>
              <select value={form.judge} onChange={(e) => setForm({ ...form, judge: e.target.value })} className={fieldClass()}>
                {JUDGES.map((j) => <option key={j}>{j}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Advocate Name</label>
              <select value={form.advocate} onChange={(e) => setForm({ ...form, advocate: e.target.value })} className={fieldClass()}>
                {ADVOCATES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Priority Level</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={fieldClass()}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Hearing Date & Time</label>
            <input type="datetime-local" value={form.hearingTime} onChange={(e) => setForm({ ...form, hearingTime: e.target.value })} className={fieldClass()} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">Cancel</button>
          <button
            onClick={onSave}
            disabled={!form.caseName || !form.hearingTime}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Hearing
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ c, now, onClose, onAttend, onAdjourn, onEscalate }) {
  if (!c) return null;
  const overdue = c.hearingTime.getTime() < now && c.status === "Scheduled";
  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PriorityBadge p={c.priority} />
            <h3 className="text-sm font-semibold text-gray-900">{c.caseName}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-gray-400">Court</dt><dd className="text-gray-900 mt-0.5">{c.court}</dd></div>
            <div><dt className="text-xs text-gray-400">Judge</dt><dd className="text-gray-900 mt-0.5">{c.judge}</dd></div>
            <div><dt className="text-xs text-gray-400">Advocate</dt><dd className="text-gray-900 mt-0.5">{c.advocate}</dd></div>
            <div><dt className="text-xs text-gray-400">Hearing</dt><dd className="text-gray-900 mt-0.5">{fmtDateTime(c.hearingTime)}</dd></div>
          </dl>

          <div>
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-2">Reminder Schedule</div>
            <ReminderTimeline hearingTime={c.hearingTime} now={now} />
          </div>

          {overdue && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-red-700"><AlertOctagon size={14} /> Escalation Active</div>
              <div className="text-xs text-red-600 flex items-center gap-1.5"><BellRing size={11} /> Critical Reminder fired at hearing time</div>
              <div className="text-xs text-red-600 flex items-center gap-1.5"><Send size={11} /> Admin Escalation notification sent to Registrar</div>
              {c.priority === "High" && <div className="text-xs text-red-600 flex items-center gap-1.5"><Repeat size={11} /> Reminder Repeat active (High priority)</div>}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200 flex-wrap">
          <button onClick={() => onAdjourn(c.id)} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">
            <RotateCcw size={14} /> Adjourn
          </button>
          {overdue && (
            <button onClick={() => onEscalate(c.id)} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50">
              <BellRing size={14} /> Re-escalate
            </button>
          )}
          <button onClick={() => onAttend(c.id)} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500">
            <CheckCircle2 size={14} /> Mark Attended
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE (standalone — no sidebar / topbar)                          */
/* ---------------------------------------------------------------------- */
export default function CourtHearingManagement() {
  const [cases, setCases] = useState(seedCases);
  const [now, setNow] = useState(Date.now());
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [detailCase, setDetailCase] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // derive effective status live: auto-flip Scheduled -> Missed once hearing time passes
  const derived = useMemo(() => {
    return cases.map((c) => {
      const effectiveStatus = c.status === "Scheduled" && c.hearingTime.getTime() < now ? "Missed" : c.status;
      return { ...c, effectiveStatus };
    });
  }, [cases, now]);

  function saveCase() {
    const id = `CASE-${100 + cases.length + 1}`;
    setCases([...cases, { id, caseName: form.caseName, court: form.court, judge: form.judge, advocate: form.advocate, hearingTime: new Date(form.hearingTime), priority: form.priority, status: "Scheduled", notes: "" }]);
    showToast(`${form.caseName} scheduled`);
    setForm(emptyForm);
    setModalOpen(false);
  }

  function attendCase(id) {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Completed" } : c)));
    showToast("Marked as attended");
    setDetailCase(null);
  }

  function adjournCase(id) {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Adjourned", hearingTime: inMinutes(60 * 24 * 7) } : c)));
    showToast("Hearing adjourned — rescheduled 7 days out");
    setDetailCase(null);
  }

  function escalateCase(id) {
    showToast("Re-escalated: Admin notification re-sent");
  }

  const filtered = useMemo(() => {
    return derived
      .filter((c) => `${c.caseName} ${c.court} ${c.judge} ${c.advocate}`.toLowerCase().includes(search.toLowerCase()))
      .filter((c) => priorityFilter === "All" || c.priority === priorityFilter)
      .filter((c) => statusFilter === "All" || c.effectiveStatus === statusFilter)
      .sort((a, b) => a.hearingTime - b.hearingTime);
  }, [derived, search, priorityFilter, statusFilter]);

  const stats = useMemo(() => ({
    upcoming: derived.filter((c) => c.effectiveStatus === "Scheduled").length,
    missed: derived.filter((c) => c.effectiveStatus === "Missed").length,
    today: derived.filter((c) => { const d = c.hearingTime; const n = new Date(now); return d.toDateString() === n.toDateString(); }).length,
    critical: derived.filter((c) => c.priority === "High" && c.effectiveStatus !== "Completed").length,
  }), [derived, now]);

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 p-6 space-y-5" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-red-600 text-white flex items-center justify-center"><Gavel size={15} /></span>
            Court Hearing Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">{stats.upcoming} upcoming · {stats.missed} missed</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 font-medium">
          <Plus size={15} /> Schedule Hearing
        </button>
      </div>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Upcoming Hearings" value={stats.upcoming} tone="text-red-600" />
        <StatCard label="Missed Hearings" value={stats.missed} />
        <StatCard label="Today's Hearings" value={stats.today} />
        <StatCard label="High Priority Active" value={stats.critical} />
      </section>

      {/* TOOLBAR */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md w-64 bg-gray-50 border border-gray-200">
          <Search size={14} className="text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search case, court, judge, advocate..." className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400" />
        </div>
        <div className="relative">
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700">
            <option value="All">All Priority</option>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700">
            <option value="All">All Status</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
        </div>
      </section>

      {/* CASE LIST */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((c) => {
          const overdue = c.effectiveStatus === "Missed" && c.status === "Scheduled";
          return (
            <div key={c.id} className={`bg-white border rounded-lg p-5 flex flex-col gap-3 ${overdue ? "border-red-300" : "border-gray-200"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-gray-400">{c.id}</div>
                  <button onClick={() => setDetailCase(c)} className="text-sm font-semibold text-gray-900 hover:underline text-left">{c.caseName}</button>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <PriorityBadge p={c.priority} />
                  <StatusBadge s={c.effectiveStatus} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Scale size={11} /> {c.court}</span>
                <span className="flex items-center gap-1.5"><User size={11} /> {c.judge}</span>
                <span className="flex items-center gap-1.5"><User size={11} /> Adv. {c.advocate}</span>
                <span className="flex items-center gap-1.5"><Calendar size={11} /> {fmtDateTime(c.hearingTime)}</span>
              </div>

              <div className={`text-xs font-medium ${overdue ? "text-red-600" : "text-gray-700"}`}>
                {countdownLabel(c.hearingTime.getTime() - now)}
              </div>

              <ReminderTimeline hearingTime={c.hearingTime} now={now} />

              {overdue && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-md px-2.5 py-1.5">
                  <AlertOctagon size={11} /> Critical Reminder + Admin Escalation triggered
                </div>
              )}

              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                {c.status !== "Completed" && (
                  <button onClick={() => attendCase(c.id)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                    <CheckCircle2 size={12} /> Mark Attended
                  </button>
                )}
                {c.status !== "Completed" && (
                  <button onClick={() => adjournCase(c.id)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                    <RotateCcw size={12} /> Adjourn
                  </button>
                )}
                <button onClick={() => setDetailCase(c)} className="flex items-center justify-center w-9 py-2 rounded-md text-gray-400 hover:bg-gray-100">
                  <Send size={13} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-16 text-sm bg-white border border-gray-200 rounded-lg">No hearings match your filters.</div>
        )}
      </section>

      <CaseModal open={modalOpen} form={form} setForm={setForm} onClose={() => setModalOpen(false)} onSave={saveCase} />
      <DetailModal c={detailCase} now={now} onClose={() => setDetailCase(null)} onAttend={attendCase} onAdjourn={adjournCase} onEscalate={escalateCase} />

      {toast && <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md shadow-lg z-50">{toast}</div>}
    </div>
  );
}
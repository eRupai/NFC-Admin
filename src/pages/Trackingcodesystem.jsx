import React, { useState, useMemo } from "react";
import {
  Hash, ChevronDown, Copy, RefreshCw, Check, Calendar, Layers, Link2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Topbar from "../shared/components/Topbar";

const USED_FOR = ["Access Tracking", "Activity Tracking", "Audit Investigation", "Legal Justification", "Security Review"];
const MODULE_USED_FOR = {
  "Entry & Exit Tracking": "Access Tracking",
  "Activity Tracking": "Activity Tracking",
  "Audit Trail": "Audit Investigation",
  "Court Hearing Management": "Legal Justification",
  "Multi-Factor Verification": "Security Review",
};
const MODULES = Object.keys(MODULE_USED_FOR);

let seq = 1;
function pad(n, len) { return String(n).padStart(len, "0"); }
function genCode(date, n) {
  const y = date.getFullYear(), m = pad(date.getMonth() + 1, 2), d = pad(date.getDate(), 2);
  return `TRK-${y}${m}${d}-${pad(n, 6)}`;
}

function seedRegistry() {
  const now = Date.now();
  const rows = [
    { module: "Entry & Exit Tracking", note: "Main Entrance — Aditi Sharma entry" },
    { module: "Multi-Factor Verification", note: "Fingerprint mismatch — Rohan Verma" },
    { module: "Audit Trail", note: "Manual Door 003 override" },
    { module: "Activity Tracking", note: "Verification failure logged" },
    { module: "Court Hearing Management", note: "Hearing reminder — Mehta vs. State Bank" },
    { module: "Entry & Exit Tracking", note: "Server Room exit — Kavya Iyer" },
    { module: "Audit Trail", note: "Cloned card flagged for investigation" },
    { module: "Multi-Factor Verification", note: "Smart card access granted" },
  ];
  return rows.map((r, i) => {
    seq += 1;
    const time = new Date(now - i * 34 * 60000);
    return {
      id: time.getTime() + i,
      code: genCode(time, seq),
      module: r.module,
      usedFor: MODULE_USED_FOR[r.module],
      note: r.note,
      time,
    };
  });
}

function fmtDateTime(d) {
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

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

function UsedForTag({ value }) {
  return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">{value}</span>;
}

function FormatBlock({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`px-3 py-2 rounded-md font-mono text-sm font-semibold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE                                                              */
/* ---------------------------------------------------------------------- */
export default function TrackingCodeSystem({ onMenuClick }) {
  const [registry, setRegistry] = useState(seedRegistry);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [generated, setGenerated] = useState(null);
  const [copied, setCopied] = useState(false);

  function generateCode() {
    seq += 1;
    const now = new Date();
    setGenerated({ code: genCode(now, seq), time: now });
    setCopied(false);
  }

  function copyCode() {
    if (!generated) return;
    navigator.clipboard?.writeText(generated.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const filtered = useMemo(() => {
    return registry.filter((r) => {
      const matchesSearch = `${r.code} ${r.note}`.toLowerCase().includes(search.toLowerCase());
      const matchesModule = moduleFilter === "All" || r.module === moduleFilter;
      return matchesSearch && matchesModule;
    });
  }, [registry, search, moduleFilter]);

  const stats = useMemo(() => {
    const counts = {};
    registry.forEach((r) => { counts[r.usedFor] = (counts[r.usedFor] || 0) + 1; });
    const chartData = USED_FOR.map((u) => ({ usedFor: u, count: counts[u] || 0 }));
    const topModuleEntry = Object.entries(
      registry.reduce((acc, r) => { acc[r.module] = (acc[r.module] || 0) + 1; return acc; }, {})
    ).sort((a, b) => b[1] - a[1])[0];
    return {
      total: registry.length,
      todayCount: registry.length,
      topModule: topModuleEntry ? topModuleEntry[0] : "—",
      chartData,
    };
  }, [registry]);

  const exactMatch = registry.find((r) => r.code === search.trim());

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 text-gray-900" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');`}</style>

      {/* TOPBAR (shared shell) */}
      <Topbar onMenuClick={onMenuClick} />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto min-h-0 p-6 space-y-5">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Unique Tracking Code System</h1>
          <p className="text-xs text-gray-500">Format: TRK-YYYYMMDD-XXXXXX</p>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Codes Issued" value={stats.total} tone="text-red-600" />
          <StatCard label="Codes Issued Today" value={stats.todayCount} />
          <StatCard label="Most Referenced Module" value={stats.topModule} />
          <StatCard label="Used-For Categories" value={USED_FOR.length} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* FORMAT + GENERATOR */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-4">Code Format</div>
            <div className="flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-md py-4 mb-2">
              <FormatBlock label="Prefix" value="TRK" color="bg-red-50 text-red-600" />
              <span className="text-gray-300">—</span>
              <FormatBlock label="Date (YYYYMMDD)" value="20260624" color="bg-gray-100 text-gray-700" />
              <span className="text-gray-300">—</span>
              <FormatBlock label="Sequence" value="000001" color="bg-gray-100 text-gray-700" />
            </div>
            <p className="text-xs text-gray-400 mb-5">Every access, activity, audit, court, and verification event receives a unique, chronologically sortable code.</p>

            <button
              onClick={generateCode}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-500"
            >
              <RefreshCw size={14} /> Generate New Code
            </button>

            {generated && (
              <div className="mt-4 flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5">
                <div>
                  <div className="font-mono text-sm font-semibold text-gray-900">{generated.code}</div>
                  <div className="text-[11px] text-gray-400">{fmtDateTime(generated.time)}</div>
                </div>
                <button onClick={copyCode} className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 shrink-0">
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-3">Used For</div>
              <div className="flex flex-wrap gap-2">
                {USED_FOR.map((u) => <UsedForTag key={u} value={u} />)}
              </div>
            </div>
          </div>

          {/* BREAKDOWN CHART */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-4">Codes by Purpose</div>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={stats.chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis dataKey="usedFor" type="category" tick={{ fill: "#374151", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "#F3F4F6" }} />
                  <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LOOKUP RESULT */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-4">Lookup Result</div>
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-md bg-gray-50 border border-gray-200">
              <Hash size={14} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Paste a tracking code..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400 font-mono"
              />
            </div>
            {exactMatch ? (
              <div className="space-y-3">
                <div className="font-mono text-sm font-semibold text-red-600">{exactMatch.code}</div>
                <div className="flex items-center gap-2 text-sm text-gray-700"><Layers size={13} className="text-gray-400" /> {exactMatch.module}</div>
                <div className="flex items-center gap-2 text-sm text-gray-700"><Link2 size={13} className="text-gray-400" /> {exactMatch.note}</div>
                <div className="flex items-center gap-2 text-sm text-gray-700"><Calendar size={13} className="text-gray-400" /> {fmtDateTime(exactMatch.time)}</div>
                <UsedForTag value={exactMatch.usedFor} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <Hash size={28} className="text-gray-300 mb-2" />
                <p className="text-xs text-gray-400">Paste a full tracking code into the search bar above to resolve its exact source record.</p>
              </div>
            )}
          </div>
        </section>

        {/* TOOLBAR + REGISTRY */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400">Cross-Module Registry</div>
            <div className="relative">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs rounded-md border border-gray-200 bg-gray-50 text-gray-700"
              >
                <option value="All">All Modules</option>
                {MODULES.map((m) => <option key={m}>{m}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left font-medium px-4 py-3">Tracking Code</th>
                <th className="text-left font-medium px-4 py-3">Module</th>
                <th className="text-left font-medium px-4 py-3">Reference</th>
                <th className="text-left font-medium px-4 py-3">Used For</th>
                <th className="text-left font-medium px-4 py-3">Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-red-600">{r.code}</td>
                  <td className="px-4 py-3 text-gray-900">{r.module}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{r.note}</td>
                  <td className="px-4 py-3"><UsedForTag value={r.usedFor} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{fmtDateTime(r.time)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-10 text-sm">No tracking codes match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
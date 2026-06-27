import React, { useState, useMemo } from "react";
import {
  LogIn, LogOut, Search, ChevronDown, ArrowRight, CreditCard, ScanFace,
  Fingerprint, Eye, Plus,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import Topbar from "../shared/components/Topbar";

const DOORS = [
  { number: "Door 001", name: "Main Entrance" },
  { number: "Door 002", name: "Server Room" },
  { number: "Door 003", name: "Judge Chamber" },
  { number: "Door 004", name: "Records Room" },
];
const USERS = [
  { id: "USR-1001", name: "Aditi Sharma" },
  { id: "USR-1002", name: "Rohan Verma" },
  { id: "USR-1003", name: "Kavya Iyer" },
  { id: "USR-1004", name: "Sanjay Nair" },
  { id: "USR-1005", name: "Meera Krishnan" },
];
const DEVICES = [
  { label: "Smart Card Reader", icon: CreditCard },
  { label: "Face Scanner", icon: ScanFace },
  { label: "Fingerprint Scanner", icon: Fingerprint },
  { label: "Retina Scanner", icon: Eye },
];

const REPORT_VIEWS = ["Daily", "Weekly", "Monthly"];
const dailyData = [
  { label: "8 AM", entries: 32, exits: 4 }, { label: "10 AM", entries: 88, exits: 21 },
  { label: "12 PM", entries: 64, exits: 58 }, { label: "2 PM", entries: 40, exits: 36 },
  { label: "4 PM", entries: 56, exits: 72 }, { label: "6 PM", entries: 18, exits: 96 },
];
const weeklyData = [
  { label: "Mon", entries: 210, exits: 198 }, { label: "Tue", entries: 240, exits: 232 },
  { label: "Wed", entries: 198, exits: 190 }, { label: "Thu", entries: 256, exits: 244 },
  { label: "Fri", entries: 280, exits: 260 }, { label: "Sat", entries: 64, exits: 60 },
  { label: "Sun", entries: 20, exits: 18 },
];
const monthlyData = [
  { label: "Wk 1", entries: 1180, exits: 1140 }, { label: "Wk 2", entries: 1340, exits: 1290 },
  { label: "Wk 3", entries: 1260, exits: 1230 }, { label: "Wk 4", entries: 1410, exits: 1380 },
];
const reportData = { Daily: dailyData, Weekly: weeklyData, Monthly: monthlyData };

/* ---------------------------------------------------------------------- */
/*  HELPERS                                                                */
/* ---------------------------------------------------------------------- */
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
let trkCounter = 412;
function genTrackingCode(date) {
  trkCounter += 1;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `TRK-${y}${m}${d}-${String(trkCounter).padStart(6, "0")}`;
}
function fmtDate(d) { return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtTime(d) { return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }
function fmtDuration(mins) {
  if (mins == null) return "—";
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function seedSessions() {
  const now = new Date();
  const mk = (offsetMin, exitOffsetMin, userIdx, doorIdx, deviceIdx) => {
    const entry = new Date(now.getTime() - offsetMin * 60000);
    const exit = exitOffsetMin != null ? new Date(now.getTime() - exitOffsetMin * 60000) : null;
    return {
      trackingCode: genTrackingCode(entry),
      userId: USERS[userIdx].id,
      userName: USERS[userIdx].name,
      doorNumber: DOORS[doorIdx].number,
      doorName: DOORS[doorIdx].name,
      entryAt: entry,
      exitAt: exit,
      verification: "Verified",
      device: DEVICES[deviceIdx].label,
    };
  };
  return [
    mk(12, null, 0, 0, 1),
    mk(48, 5, 1, 1, 2),
    mk(95, 40, 2, 3, 0),
    mk(140, 20, 3, 0, 0),
    mk(200, null, 4, 2, 3),
    mk(260, 180, 0, 1, 2),
  ];
}

/* ---------------------------------------------------------------------- */
/*  SMALL UI                                                               */
/* ---------------------------------------------------------------------- */
function StatCard({ label, value, sub, tone }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-semibold mt-2 ${tone || "text-gray-900"}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

function DeviceTag({ label }) {
  const d = DEVICES.find((x) => x.label === label) || DEVICES[0];
  const Icon = d.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
      <Icon size={12} className="text-gray-400" /> {label}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE                                                              */
/* ---------------------------------------------------------------------- */
export default function EntryExitTracking({ onMenuClick }) {
  const [sessions, setSessions] = useState(seedSessions);
  const [search, setSearch] = useState("");
  const [doorFilter, setDoorFilter] = useState("All");
  const [reportView, setReportView] = useState("Daily");

  function simulateEntry() {
    const now = new Date();
    const user = randomFrom(USERS);
    const door = randomFrom(DOORS);
    const device = randomFrom(DEVICES);
    setSessions((prev) => [
      {
        trackingCode: genTrackingCode(now),
        userId: user.id,
        userName: user.name,
        doorNumber: door.number,
        doorName: door.name,
        entryAt: now,
        exitAt: null,
        verification: "Verified",
        device: device.label,
      },
      ...prev,
    ]);
  }

  function markExit(trackingCode) {
    setSessions((prev) => prev.map((s) => (s.trackingCode === trackingCode ? { ...s, exitAt: new Date() } : s)));
  }

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch = `${s.userName} ${s.trackingCode} ${s.doorName}`.toLowerCase().includes(search.toLowerCase());
      const matchesDoor = doorFilter === "All" || s.doorNumber === doorFilter;
      return matchesSearch && matchesDoor;
    });
  }, [sessions, search, doorFilter]);

  const analytics = useMemo(() => {
    const totalEntries = sessions.length;
    const totalExits = sessions.filter((s) => s.exitAt).length;
    const counts = {};
    sessions.forEach((s) => { counts[s.doorName] = (counts[s.doorName] || 0) + 1; });
    const entries = Object.entries(counts);
    const most = entries.length ? entries.reduce((a, b) => (b[1] > a[1] ? b : a)) : ["—", 0];
    const least = entries.length ? entries.reduce((a, b) => (b[1] < a[1] ? b : a)) : ["—", 0];
    return { totalEntries, totalExits, mostUsed: most[0], leastUsed: least[0], insideNow: totalEntries - totalExits };
  }, [sessions]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 text-gray-900" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      {/* TOPBAR (shared shell) */}
      <Topbar onMenuClick={onMenuClick} />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto min-h-0 p-6 space-y-5">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Entry & Exit Tracking</h1>
          <p className="text-xs text-gray-500">{analytics.insideNow} currently inside</p>
        </div>

        {/* ANALYTICS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Entries" value={analytics.totalEntries} tone="text-red-600" />
          <StatCard label="Total Exits" value={analytics.totalExits} />
          <StatCard label="Most Used Door" value={analytics.mostUsed} />
          <StatCard label="Least Used Door" value={analytics.leastUsed} />
        </section>

        {/* REPORT CHART */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400">Access Report</div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
              {REPORT_VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setReportView(v)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                    reportView === v ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={reportData[reportView]} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "#F3F4F6" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="entries" fill="#dc2626" radius={[4, 4, 0, 0]} name="Entries" />
                <Bar dataKey="exits" fill="#9CA3AF" radius={[4, 4, 0, 0]} name="Exits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* TOOLBAR */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md w-64 bg-gray-50 border border-gray-200">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracking code, user, door..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
          <div className="relative">
            <select
              value={doorFilter}
              onChange={(e) => setDoorFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700"
            >
              <option value="All">All Doors</option>
              {DOORS.map((d) => <option key={d.number} value={d.number}>{d.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={simulateEntry}
            className="ml-auto flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 font-medium"
          >
            <Plus size={15} /> Simulate Entry
          </button>
        </section>

        {/* SESSION LOG */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left font-medium px-4 py-3">Tracking Code</th>
                <th className="text-left font-medium px-4 py-3">User</th>
                <th className="text-left font-medium px-4 py-3">Door</th>
                <th className="text-left font-medium px-4 py-3">Entry</th>
                <th className="text-left font-medium px-4 py-3">Exit</th>
                <th className="text-left font-medium px-4 py-3">Duration</th>
                <th className="text-left font-medium px-4 py-3">Device</th>
                <th className="text-right font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((s) => {
                const inside = !s.exitAt;
                const duration = s.exitAt ? Math.round((s.exitAt - s.entryAt) / 60000) : null;
                return (
                  <tr key={s.trackingCode} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-red-600">{s.trackingCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.userName}</div>
                      <div className="text-[11px] text-gray-400">{s.userId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{s.doorName}</div>
                      <div className="text-[11px] text-gray-400">{s.doorNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-700 text-xs flex items-center gap-1"><LogIn size={11} className="text-gray-400" /> {fmtTime(s.entryAt)}</div>
                      <div className="text-[11px] text-gray-400">{fmtDate(s.entryAt)}</div>
                    </td>
                    <td className="px-4 py-3">
                      {s.exitAt ? (
                        <>
                          <div className="text-gray-700 text-xs flex items-center gap-1"><LogOut size={11} className="text-gray-400" /> {fmtTime(s.exitAt)}</div>
                          <div className="text-[11px] text-gray-400">{fmtDate(s.exitAt)}</div>
                        </>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Inside</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{fmtDuration(duration)}</td>
                    <td className="px-4 py-3"><DeviceTag label={s.device} /></td>
                    <td className="px-4 py-3 text-right">
                      {inside ? (
                        <button
                          onClick={() => markExit(s.trackingCode)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700"
                        >
                          Mark Exit <ArrowRight size={11} />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center text-gray-400 py-10 text-sm">No sessions match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
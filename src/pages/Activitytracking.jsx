import React, { useState, useMemo } from "react";
import {
  LogIn, LogOut, DoorOpen, DoorClosed, CreditCard, ScanFace, Fingerprint,
  Eye, CheckCircle2, XCircle, ListPlus, RefreshCw, CheckSquare, StickyNote,
  Gavel, Search, ChevronDown, MapPin, Wifi, Plus,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Topbar from "../shared/components/Topbar";

const ACTIVITY_TYPES = [
  { key: "Login", icon: LogIn, tone: "neutral" },
  { key: "Logout", icon: LogOut, tone: "neutral" },
  { key: "Entry", icon: DoorOpen, tone: "neutral" },
  { key: "Exit", icon: DoorClosed, tone: "neutral" },
  { key: "Card Scan", icon: CreditCard, tone: "neutral" },
  { key: "Face Scan", icon: ScanFace, tone: "neutral" },
  { key: "Fingerprint Scan", icon: Fingerprint, tone: "neutral" },
  { key: "Retina Scan", icon: Eye, tone: "neutral" },
  { key: "Verification Success", icon: CheckCircle2, tone: "success" },
  { key: "Verification Failure", icon: XCircle, tone: "danger" },
  { key: "Task Created", icon: ListPlus, tone: "neutral" },
  { key: "Task Updated", icon: RefreshCw, tone: "neutral" },
  { key: "Task Completed", icon: CheckSquare, tone: "success" },
  { key: "Note Created", icon: StickyNote, tone: "neutral" },
  { key: "Court Reminder Viewed", icon: Gavel, tone: "danger" },
];

const USERS = ["Aditi Sharma", "Rohan Verma", "Kavya Iyer", "Sanjay Nair", "Meera Krishnan"];
const DEVICES = ["Smart Card Reader", "Face Scanner", "Fingerprint Scanner", "Retina Scanner", "Admin Console", "Mobile App"];
const LOCATIONS = ["Main Entrance", "Server Room", "Judge Chamber", "Records Room", "West Wing Office"];

function toneClasses(tone) {
  if (tone === "success") return "bg-green-50 text-green-700 border-green-200";
  if (tone === "danger") return "bg-red-50 text-red-600 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomIp() { return `10.${randomFrom([0, 1, 2])}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`; }
let trkCounter = 512;
function genTrackingCode(date) {
  trkCounter += 1;
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, "0"), d = String(date.getDate()).padStart(2, "0");
  return `TRK-${y}${m}${d}-${String(trkCounter).padStart(6, "0")}`;
}
function fmtTime(d) { return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }

function seedActivities() {
  const now = Date.now();
  const types = ["Verification Success", "Card Scan", "Entry", "Verification Failure", "Task Completed", "Court Reminder Viewed", "Face Scan", "Login", "Note Created", "Exit"];
  return types.map((type, i) => {
    const time = new Date(now - i * 6 * 60000);
    return {
      id: time.getTime() + i,
      trackingCode: genTrackingCode(time),
      type,
      user: randomFrom(USERS),
      time,
      device: randomFrom(DEVICES),
      ip: randomIp(),
      location: randomFrom(LOCATIONS),
    };
  });
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

function ActivityBadge({ type }) {
  const def = ACTIVITY_TYPES.find((t) => t.key === type) || ACTIVITY_TYPES[0];
  const Icon = def.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${toneClasses(def.tone)}`}>
      <Icon size={12} /> {type}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE                                                              */
/* ---------------------------------------------------------------------- */
export default function ActivityTracking({ onMenuClick }) {
  const [activities, setActivities] = useState(seedActivities);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");

  function simulateActivity() {
    const now = new Date();
    const type = randomFrom(ACTIVITY_TYPES).key;
    setActivities((prev) => [
      {
        id: now.getTime(),
        trackingCode: genTrackingCode(now),
        type,
        user: randomFrom(USERS),
        time: now,
        device: randomFrom(DEVICES),
        ip: randomIp(),
        location: randomFrom(LOCATIONS),
      },
      ...prev,
    ].slice(0, 30));
  }

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const matchesSearch = `${a.user} ${a.trackingCode} ${a.type}`.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || a.type === typeFilter;
      const matchesUser = userFilter === "All" || a.user === userFilter;
      return matchesSearch && matchesType && matchesUser;
    });
  }, [activities, search, typeFilter, userFilter]);

  const stats = useMemo(() => {
    const total = activities.length;
    const success = activities.filter((a) => a.type === "Verification Success").length;
    const failure = activities.filter((a) => a.type === "Verification Failure").length;
    const counts = {};
    activities.forEach((a) => { counts[a.type] = (counts[a.type] || 0) + 1; });
    const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const activeUsers = new Set(activities.map((a) => a.user)).size;
    return {
      total,
      successRate: success + failure > 0 ? `${Math.round((success / (success + failure)) * 100)}%` : "—",
      mostCommon: mostCommon ? mostCommon[0] : "—",
      activeUsers,
      chartData: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([type, count]) => ({ type, count })),
    };
  }, [activities]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 text-gray-900" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      {/* TOPBAR (shared shell) */}
      <Topbar onMenuClick={onMenuClick} />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto min-h-0 p-6 space-y-5">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Activity Tracking System</h1>
          <p className="text-xs text-gray-500">{stats.total} activities logged</p>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Activities" value={stats.total} tone="text-red-600" />
          <StatCard label="Verification Success Rate" value={stats.successRate} />
          <StatCard label="Most Common Activity" value={stats.mostCommon} />
          <StatCard label="Active Users" value={stats.activeUsers} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* BREAKDOWN CHART */}
          <div className="xl:col-span-1 bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-xs font-semibold tracking-wide uppercase text-gray-400 mb-4">Activity Breakdown</div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={stats.chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="type" type="category" tick={{ fill: "#374151", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "#F3F4F6" }} />
                  <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LIVE FEED */}
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="text-xs font-semibold tracking-wide uppercase text-gray-400">Activity Log</div>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Wifi size={11} /> Live</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md w-48 bg-gray-50 border border-gray-200">
                  <Search size={13} className="text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tracking code, user..."
                    className="bg-transparent outline-none text-xs w-full placeholder:text-gray-400"
                  />
                </div>
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 text-xs rounded-md border border-gray-200 bg-gray-50 text-gray-700"
                  >
                    <option value="All">All Activities</option>
                    {ACTIVITY_TYPES.map((t) => <option key={t.key} value={t.key}>{t.key}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 text-xs rounded-md border border-gray-200 bg-gray-50 text-gray-700"
                  >
                    <option value="All">All Users</option>
                    {USERS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={simulateActivity}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-500"
                >
                  <Plus size={12} /> Simulate
                </button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
              {filtered.map((a) => (
                <div key={a.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <ActivityBadge type={a.type} />
                      <span className="text-xs font-medium text-gray-900">{a.user}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                      <span>{a.trackingCode}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {a.location}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-500">{fmtTime(a.time)}</div>
                    <div className="text-[11px] text-gray-400">{a.device}</div>
                    <div className="text-[10px] text-gray-300">{a.ip}</div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-gray-400 py-10 text-sm">No activities match your filters.</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
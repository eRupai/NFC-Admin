// import { useState } from "react";
// import {
//   Globe2, MapPin, Download, Calendar, ArrowUpRight,
//   CheckCircle2, X, TrendingUp, Users, Radio, BarChart2,
//   Navigation, Layers, Filter,
// } from "lucide-react";
// import {
//   AreaChart, Area, BarChart, Bar,
//   PieChart, Pie, Cell,
//   ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
// } from "recharts";
// import Topbar from "../shared/components/Topbar";

// // ─── DATA ─────────────────────────────────────────────────────────────────────

// const COUNTRIES = [
//   { flag: "🇮🇳", country: "India",          city: "Mumbai",   scans: 7245, pct: 100, growth: "+24.3%" },
//   { flag: "🇺🇸", country: "United States",  city: "New York", scans: 4582, pct: 63,  growth: "+18.7%" },
//   { flag: "🇬🇧", country: "United Kingdom", city: "London",   scans: 2154, pct: 30,  growth: "+12.1%" },
//   { flag: "🇨🇦", country: "Canada",         city: "Toronto",  scans: 1245, pct: 17,  growth: "+9.4%"  },
//   { flag: "🇦🇺", country: "Australia",      city: "Sydney",   scans: 982,  pct: 14,  growth: "+7.8%"  },
//   { flag: "🇩🇪", country: "Germany",        city: "Berlin",   scans: 824,  pct: 11,  growth: "+6.2%"  },
//   { flag: "🇦🇪", country: "UAE",            city: "Dubai",    scans: 632,  pct: 9,   growth: "+15.5%" },
//   { flag: "🇸🇬", country: "Singapore",      city: "Singapore",scans: 498,  pct: 7,   growth: "+21.0%" },
// ];

// const CITIES = [
//   { city: "Mumbai",        country: "India",   scans: 3120, pct: 100 },
//   { city: "New York",      country: "USA",     scans: 2340, pct: 75  },
//   { city: "London",        country: "UK",      scans: 1890, pct: 61  },
//   { city: "Dubai",         country: "UAE",     scans: 1450, pct: 46  },
//   { city: "Toronto",       country: "Canada",  scans: 1120, pct: 36  },
//   { city: "Sydney",        country: "AUS",     scans: 890,  pct: 29  },
//   { city: "Berlin",        country: "Germany", scans: 720,  pct: 23  },
//   { city: "Singapore",     country: "SGP",     scans: 498,  pct: 16  },
// ];

// const REGION_DATA = [
//   { name: "Asia Pacific",  value: 44.2, fill: "#ef4444" },
//   { name: "North America", value: 28.6, fill: "#f87171" },
//   { name: "Europe",        value: 18.3, fill: "#fca5a5" },
//   { name: "Middle East",   value: 6.8,  fill: "#fecaca" },
//   { name: "Others",        value: 2.1,  fill: "#fee2e2" },
// ];

// const TREND_DAILY   = [
//   { l: "May 1",  asia: 480, na: 280, eu: 140 },
//   { l: "May 6",  asia: 620, na: 380, eu: 195 },
//   { l: "May 11", asia: 570, na: 320, eu: 165 },
//   { l: "May 16", asia: 740, na: 430, eu: 220 },
//   { l: "May 21", asia: 690, na: 395, eu: 205 },
//   { l: "May 26", asia: 820, na: 490, eu: 248 },
//   { l: "May 31", asia: 870, na: 520, eu: 260 },
// ];
// const TREND_WEEKLY  = [
//   { l: "W1", asia: 3100, na: 1820, eu: 925 },
//   { l: "W2", asia: 3850, na: 2240, eu: 1130 },
//   { l: "W3", asia: 3520, na: 2050, eu: 1040 },
//   { l: "W4", asia: 4200, na: 2460, eu: 1250 },
// ];
// const TREND_MONTHLY = [
//   { l: "Jan", asia: 12000, na: 7200, eu: 3600 },
//   { l: "Feb", asia: 14500, na: 8400, eu: 4200 },
//   { l: "Mar", asia: 13200, na: 7800, eu: 3900 },
//   { l: "Apr", asia: 16000, na: 9200, eu: 4600 },
//   { l: "May", asia: 17800, na: 10400, eu: 5200 },
// ];

// const GROWTH_DATA = [
//   { l: "Jan", India: 5200, USA: 3100, UK: 1500 },
//   { l: "Feb", India: 5800, USA: 3500, UK: 1700 },
//   { l: "Mar", India: 6100, USA: 3800, UK: 1900 },
//   { l: "Apr", India: 6700, USA: 4100, UK: 2000 },
//   { l: "May", India: 7245, USA: 4582, UK: 2154 },
// ];

// const SCAN_HOTSPOTS = [
//   { label: "Connaught Place, Delhi",  country: "🇮🇳", scans: 1240, type: "Business Hub"  },
//   { label: "Times Square, NYC",       country: "🇺🇸", scans: 1105, type: "Tourist Area"  },
//   { label: "Canary Wharf, London",    country: "🇬🇧", scans: 890,  type: "Business Hub"  },
//   { label: "Dubai Mall, Dubai",       country: "🇦🇪", scans: 780,  type: "Retail"        },
//   { label: "BKC, Mumbai",             country: "🇮🇳", scans: 720,  type: "Business Hub"  },
//   { label: "Shibuya, Tokyo",          country: "🇯🇵", scans: 665,  type: "Tourist Area"  },
// ];

// const TOOLTIP_STYLE = {
//   contentStyle: { background: "#fff", border: "1px solid #fecaca", borderRadius: 8, fontSize: 11 },
//   labelStyle:   { color: "#991b1b" },
// };

// // SVG world map hotspot dots
// const MAP_DOTS = [
//   { x: 390, y: 125, s: 10, c: "#ef4444", label: "India" },
//   { x: 195, y: 130, s: 8,  c: "#ef4444", label: "USA"   },
//   { x: 310, y: 90,  s: 6,  c: "#dc2626", label: "UK"    },
//   { x: 325, y: 95,  s: 5,  c: "#fca5a5", label: "DE"    },
//   { x: 460, y: 115, s: 5,  c: "#fca5a5", label: "AUS"   },
//   { x: 365, y: 107, s: 6,  c: "#f87171", label: "UAE"   },
//   { x: 440, y: 130, s: 4,  c: "#fca5a5", label: "SGP"   },
//   { x: 235, y: 118, s: 4,  c: "#fca5a5", label: "CAN"   },
// ];

// // ─── HELPERS ──────────────────────────────────────────────────────────────────

// function RangeToggle({ value, onChange }) {
//   return (
//     <div className="flex gap-0.5 bg-red-50 border border-red-200 rounded-lg p-0.5">
//       {["Daily", "Weekly", "Monthly"].map(r => (
//         <button key={r} onClick={() => onChange(r)}
//           className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${value === r ? "bg-red-600 text-white shadow-sm" : "text-red-500 hover:text-red-700"}`}>
//           {r}
//         </button>
//       ))}
//     </div>
//   );
// }

// function Toast({ msg, onClose }) {
//   if (!msg) return null;
//   return (
//     <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold bg-red-600 border-red-400 text-white">
//       <CheckCircle2 className="w-4 h-4" />{msg}
//       <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100" /></button>
//     </div>
//   );
// }

// // ─── MAIN PAGE ────────────────────────────────────────────────────────────────

// export default function GeographicReportsPage({ onMenuClick }) {
//   const [tab,        setTab]        = useState("overview");
//   const [trendRange, setTrendRange] = useState("Daily");
//   const [period,     setPeriod]     = useState("This Month");
//   const [toast,      setToast]      = useState("");

//   const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

//   const trendData = trendRange === "Daily" ? TREND_DAILY : trendRange === "Weekly" ? TREND_WEEKLY : TREND_MONTHLY;

//   const handleExport = () => {
//     const rows = COUNTRIES.map(c => `${c.country},${c.scans},${c.growth}`);
//     const blob = new Blob([["Country,Scans,Growth", ...rows].join("\n")], { type: "text/csv" });
//     const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
//     a.download = "geographic_reports.csv"; a.click();
//     showToast("Report exported!");
//   };

//   const TABS = [
//     { id: "overview",  label: "Overview",       Icon: Globe2    },
//     { id: "countries", label: "Countries",       Icon: MapPin    },
//     { id: "cities",    label: "Top Cities",      Icon: Navigation},
//     { id: "hotspots",  label: "Scan Hotspots",   Icon: Layers    },
//   ];

//   const STATS = [
//     { Icon: Globe2,     bg: "from-red-500 to-rose-600",  label: "Countries Reached", value: "38",     change: "+5 new" },
//     { Icon: MapPin,     bg: "from-rose-500 to-red-600",  label: "Cities Reached",    value: "124",    change: "+12 new" },
//     { Icon: Radio,      bg: "from-red-600 to-rose-700",  label: "Intl. Scans",       value: "21,162", change: "+28.4%" },
//     { Icon: Users,      bg: "from-rose-600 to-red-800",  label: "Global Users",      value: "8,721",  change: "+21.4%" },
//     { Icon: TrendingUp, bg: "from-red-700 to-rose-600",  label: "Fastest Growing",   value: "India",  change: "+24.3%" },
//     { Icon: BarChart2,  bg: "from-rose-700 to-red-700",  label: "Top Continent",     value: "Asia",   change: "44.2%" },
//   ];

//   return (
//     <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">

//       {/* Topbar */}
//       <Topbar onMenuClick={onMenuClick} />

//       <div className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-5 py-4">

//         {/* Title + Controls */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
//               <Globe2 className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Geographic Reports</h1>
//               <p className="text-red-400 text-xs hidden sm:block">Track NFC scan activity across countries and cities</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="hidden sm:flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-xs text-red-500">
//               <Calendar className="w-3.5 h-3.5" />May 1 – May 31, 2025
//             </div>
//             <select value={period} onChange={e => setPeriod(e.target.value)}
//               className="bg-white border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer">
//               {["This Month", "Last Month", "Last 7 Days", "Last 90 Days"].map(o => <option key={o}>{o}</option>)}
//             </select>
//             <button onClick={handleExport}
//               className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 hover:border-red-400 transition-all shadow-sm">
//               <Download className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex items-center gap-0 mb-4 border-b border-red-200 overflow-x-auto">
//           {TABS.map(t => (
//             <button key={t.id} onClick={() => setTab(t.id)}
//               className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"}`}>
//               <t.Icon className="w-3.5 h-3.5" />{t.label}
//             </button>
//           ))}
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 mb-4">
//           {STATS.map(s => (
//             <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 hover:border-red-300 transition-colors shadow-sm hover:shadow-md">
//               <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center mb-2 shadow-md shadow-red-100`}>
//                 <s.Icon className="w-4 h-4 text-white" />
//               </div>
//               <div className="text-red-400 text-[9px] leading-tight mb-0.5 truncate">{s.label}</div>
//               <div className="text-red-900 font-bold text-sm leading-tight">{s.value}</div>
//               <div className="text-red-500 text-[10px] font-semibold flex items-center gap-0.5">
//                 <ArrowUpRight className="w-3 h-3" />{s.change}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Row 1: World Map + Region Breakdown */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

//           {/* World Map */}
//           <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "cities" || tab === "hotspots" ? "opacity-40 pointer-events-none" : ""}`}>
//             <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
//               <Globe2 className="w-4 h-4 text-red-500" />Global Scan Map
//             </h3>
//             <div className="relative">
//               <svg viewBox="0 0 560 220" className="w-full rounded-lg" style={{ height: 130, background: "linear-gradient(135deg,#fff5f5,#fef2f2)" }}>
//                 {/* Continents — simplified shapes */}
//                 {/* North America */}
//                 <path d="M60,55 Q90,42 135,48 Q175,52 185,88 Q190,118 165,138 Q140,152 112,148 Q82,142 65,118 Q48,92 60,55Z" fill="#fecaca" opacity="0.7" />
//                 {/* South America */}
//                 <path d="M130,158 Q162,153 178,173 Q188,198 178,228 Q168,248 148,252 Q122,252 112,232 Q102,208 107,183 Q112,162 130,158Z" fill="#fecaca" opacity="0.7" />
//                 {/* Europe */}
//                 <path d="M252,45 Q278,40 298,52 Q314,62 309,82 Q304,98 284,102 Q262,102 252,88 Q244,72 252,45Z" fill="#fecaca" opacity="0.7" />
//                 {/* Africa */}
//                 <path d="M262,112 Q293,107 308,128 Q318,153 312,183 Q305,208 288,218 Q268,222 256,203 Q246,178 248,153 Q250,128 262,112Z" fill="#fecaca" opacity="0.7" />
//                 {/* Asia */}
//                 <path d="M312,42 Q378,32 440,48 Q492,58 507,83 Q512,108 492,123 Q462,133 422,128 Q382,123 343,108 Q313,93 308,73 Q306,55 312,42Z" fill="#fecaca" opacity="0.7" />
//                 {/* Middle East */}
//                 <path d="M316,106 Q336,102 348,116 Q354,132 344,142 Q330,146 320,136 Q312,124 316,106Z" fill="#fecaca" opacity="0.7" />
//                 {/* Australia */}
//                 <path d="M448,158 Q488,154 508,174 Q518,192 508,206 Q494,218 470,216 Q447,212 439,194 Q433,176 448,158Z" fill="#fecaca" opacity="0.7" />

//                 {/* Scan hotspot dots */}
//                 {MAP_DOTS.map((d, i) => (
//                   <g key={i}>
//                     <circle cx={d.x} cy={d.y} r={d.s + 6} fill={d.c} opacity="0.12" />
//                     <circle cx={d.x} cy={d.y} r={d.s + 3} fill={d.c} opacity="0.20" />
//                     <circle cx={d.x} cy={d.y} r={d.s}     fill={d.c} opacity="0.95" />
//                     <circle cx={d.x} cy={d.y} r={d.s - 2} fill="white" opacity="0.35" />
//                   </g>
//                 ))}
//               </svg>
//               <div className="flex items-center gap-3 mt-2 flex-wrap">
//                 {[
//                   { c: "#ef4444", label: "High (>5k)" },
//                   { c: "#f87171", label: "Mid (1–5k)" },
//                   { c: "#fca5a5", label: "Low (<1k)"  },
//                 ].map(l => (
//                   <div key={l.label} className="flex items-center gap-1">
//                     <div className="w-2 h-2 rounded-full" style={{ background: l.c }} />
//                     <span className="text-red-400 text-[10px]">{l.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Region Breakdown Donut */}
//           <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "hotspots" ? "opacity-40 pointer-events-none" : ""}`}>
//             <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
//               <Layers className="w-4 h-4 text-red-500" />Regional Breakdown
//             </h3>
//             <div className="flex items-center gap-4">
//               <div className="relative flex-shrink-0">
//                 <ResponsiveContainer width={120} height={120}>
//                   <PieChart>
//                     <Pie data={REGION_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={2}>
//                       {REGION_DATA.map((d, i) => <Cell key={i} fill={d.fill} />)}
//                     </Pie>
//                     <Tooltip contentStyle={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 8, fontSize: 11 }} itemStyle={{ color: "#ef4444" }} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                   <span className="text-red-900 font-bold text-xs">38</span>
//                   <span className="text-red-400 text-[8px]">Countries</span>
//                 </div>
//               </div>
//               <div className="flex-1 space-y-2">
//                 {REGION_DATA.map(r => (
//                   <div key={r.name}>
//                     <div className="flex items-center gap-2 mb-0.5">
//                       <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.fill }} />
//                       <span className="text-red-600 text-xs flex-1">{r.name}</span>
//                       <span className="text-red-900 text-xs font-bold">{r.value}%</span>
//                     </div>
//                     <div className="h-1 bg-red-100 rounded-full overflow-hidden">
//                       <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: r.fill }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Row 2: Regional Trend + Country Growth */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

//           {/* Regional Trend — Stacked Area */}
//           <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "hotspots" ? "opacity-40 pointer-events-none" : ""}`}>
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-red-900 font-semibold text-sm">Region Trend</h3>
//               <RangeToggle value={trendRange} onChange={setTrendRange} />
//             </div>
//             <div className="flex flex-wrap gap-3 mb-2">
//               {[{ l: "Asia Pacific", c: "#ef4444" }, { l: "N. America", c: "#f87171" }, { l: "Europe", c: "#fca5a5" }].map(s => (
//                 <div key={s.l} className="flex items-center gap-1">
//                   <div className="w-2 h-2 rounded-full" style={{ background: s.c }} />
//                   <span className="text-red-400 text-[10px]">{s.l}</span>
//                 </div>
//               ))}
//             </div>
//             <ResponsiveContainer width="100%" height={145}>
//               <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="asiaGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="naGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%"  stopColor="#f87171" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false} />
//                 <XAxis dataKey="l" tick={{ fontSize: 8, fill: "#f87171" }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 8, fill: "#f87171" }} axisLine={false} tickLine={false} />
//                 <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: "#ef4444" }} />
//                 <Area type="monotone" dataKey="asia" name="Asia Pacific" stroke="#ef4444" strokeWidth={2} fill="url(#asiaGrad)" dot={{ r: 2.5, fill: "#ef4444", stroke: "#fff", strokeWidth: 1.5 }} />
//                 <Area type="monotone" dataKey="na"   name="N. America"   stroke="#f87171" strokeWidth={2} fill="url(#naGrad)"   dot={{ r: 2.5, fill: "#f87171", stroke: "#fff", strokeWidth: 1.5 }} />
//                 <Area type="monotone" dataKey="eu"   name="Europe"       stroke="#fca5a5" strokeWidth={2} fill="transparent"    dot={{ r: 2.5, fill: "#fca5a5", stroke: "#fff", strokeWidth: 1.5 }} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Top Country Growth — Bar */}
//           <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "hotspots" ? "opacity-40 pointer-events-none" : ""}`}>
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-red-900 font-semibold text-sm">Top Country Growth</h3>
//               <span className="text-red-400 text-[10px]">Jan – May 2025</span>
//             </div>
//             <div className="flex flex-wrap gap-3 mb-2">
//               {[{ l: "India", c: "#ef4444" }, { l: "USA", c: "#f87171" }, { l: "UK", c: "#fca5a5" }].map(s => (
//                 <div key={s.l} className="flex items-center gap-1">
//                   <div className="w-2 h-2 rounded-full" style={{ background: s.c }} />
//                   <span className="text-red-400 text-[10px]">{s.l}</span>
//                 </div>
//               ))}
//             </div>
//             <ResponsiveContainer width="100%" height={145}>
//               <BarChart data={GROWTH_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="20%">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false} />
//                 <XAxis dataKey="l" tick={{ fontSize: 8, fill: "#f87171" }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 8, fill: "#f87171" }} axisLine={false} tickLine={false} />
//                 <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: "#ef4444" }} />
//                 <Bar dataKey="India" name="India" fill="#ef4444" radius={[3, 3, 0, 0]} />
//                 <Bar dataKey="USA"   name="USA"   fill="#f87171" radius={[3, 3, 0, 0]} />
//                 <Bar dataKey="UK"    name="UK"    fill="#fca5a5" radius={[3, 3, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Row 3: Country Table + City Table + Hotspots */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

//           {/* Country Table */}
//           <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "cities" || tab === "hotspots" ? "opacity-40 pointer-events-none" : ""}`}>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
//                 <MapPin className="w-4 h-4 text-red-500" />Countries
//               </h3>
//               <button onClick={() => showToast("Loading full country report...")} className="text-red-500 hover:text-red-700 text-[10px] font-semibold">View All</button>
//             </div>
//             <div className="space-y-2.5">
//               {COUNTRIES.map((c, i) => (
//                 <div key={c.country} className="flex items-center gap-2">
//                   <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm shadow-red-200">
//                     {i + 1}
//                   </div>
//                   <span className="text-base flex-shrink-0">{c.flag}</span>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between mb-0.5">
//                       <span className="text-red-900 text-[11px] font-medium truncate">{c.country}</span>
//                       <span className="text-red-900 text-[11px] font-bold ml-1 flex-shrink-0">{c.scans.toLocaleString()}</span>
//                     </div>
//                     <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
//                       <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500" style={{ width: `${c.pct}%` }} />
//                     </div>
//                   </div>
//                   <span className="text-red-500 text-[10px] font-semibold flex-shrink-0">{c.growth}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Top Cities */}
//           <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "countries" || tab === "hotspots" ? "opacity-40 pointer-events-none" : ""}`}>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
//                 <Navigation className="w-4 h-4 text-red-500" />Top Cities
//               </h3>
//               <button onClick={() => showToast("Loading all cities...")} className="text-red-500 hover:text-red-700 text-[10px] font-semibold">View All</button>
//             </div>
//             <div className="space-y-2.5">
//               {CITIES.map((c, i) => (
//                 <div key={c.city} className="flex items-center gap-2">
//                   <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm shadow-red-200">
//                     {i + 1}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between mb-0.5">
//                       <div>
//                         <span className="text-red-900 text-[11px] font-medium">{c.city}</span>
//                         <span className="text-red-400 text-[9px] ml-1">{c.country}</span>
//                       </div>
//                       <span className="text-red-900 text-[11px] font-bold">{c.scans.toLocaleString()}</span>
//                     </div>
//                     <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
//                       <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500" style={{ width: `${c.pct}%` }} />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Scan Hotspots */}
//           <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "countries" || tab === "cities" ? "opacity-40 pointer-events-none" : ""}`}>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
//                 <Layers className="w-4 h-4 text-red-500" />Scan Hotspots
//               </h3>
//               <button className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[10px] font-semibold">
//                 <Filter className="w-3 h-3" />Filter
//               </button>
//             </div>
//             <div className="space-y-2.5">
//               {SCAN_HOTSPOTS.map((h, i) => (
//                 <div key={h.label} className="bg-red-50 border border-red-100 rounded-xl p-2.5 hover:border-red-300 transition-colors cursor-pointer"
//                   onClick={() => showToast(`Viewing ${h.label}`)}>
//                   <div className="flex items-start gap-2">
//                     <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm shadow-red-200 mt-0.5">
//                       {i + 1}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <span className="text-red-900 text-[11px] font-semibold truncate">{h.label}</span>
//                         <span className="text-base ml-1 flex-shrink-0">{h.country}</span>
//                       </div>
//                       <div className="flex items-center justify-between mt-0.5">
//                         <span className="text-[9px] font-medium px-1.5 py-0.5 bg-red-100 text-red-600 rounded-md">{h.type}</span>
//                         <span className="text-red-900 text-[11px] font-bold">{h.scans.toLocaleString()} scans</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button onClick={() => showToast("Loading all hotspots...")}
//               className="w-full mt-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-semibold py-1.5 rounded-lg transition-all">
//               View All Hotspots
//             </button>
//           </div>

//         </div>
//       </div>

//       <Toast msg={toast} onClose={() => setToast("")} />
//     </div>
//   );
// }
import { useState } from "react";
import {
  Globe2, MapPin, Download, Calendar, ArrowUpRight,
  CheckCircle2, X, TrendingUp, Users, Radio, BarChart2,
  Navigation, Layers, Filter, Shield, Edit3, Trash2,
  Plus, Save, RefreshCw, Eye, EyeOff, AlertTriangle,
  Search, ChevronDown, Power, ToggleLeft, ToggleRight,
  Bell, Flag, Lock,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { flag: "🇮🇳", country: "India",          city: "Mumbai",    scans: 7245, pct: 100, growth: "+24.3%", status: "active"   },
  { flag: "🇺🇸", country: "United States",  city: "New York",  scans: 4582, pct: 63,  growth: "+18.7%", status: "active"   },
  { flag: "🇬🇧", country: "United Kingdom", city: "London",    scans: 2154, pct: 30,  growth: "+12.1%", status: "active"   },
  { flag: "🇨🇦", country: "Canada",         city: "Toronto",   scans: 1245, pct: 17,  growth: "+9.4%",  status: "active"   },
  { flag: "🇦🇺", country: "Australia",      city: "Sydney",    scans: 982,  pct: 14,  growth: "+7.8%",  status: "active"   },
  { flag: "🇩🇪", country: "Germany",        city: "Berlin",    scans: 824,  pct: 11,  growth: "+6.2%",  status: "active"   },
  { flag: "🇦🇪", country: "UAE",            city: "Dubai",     scans: 632,  pct: 9,   growth: "+15.5%", status: "active"   },
  { flag: "🇸🇬", country: "Singapore",      city: "Singapore", scans: 498,  pct: 7,   growth: "+21.0%", status: "inactive" },
];

const CITIES = [
  { city: "Mumbai",    country: "India",   scans: 3120, pct: 100, status: "active"   },
  { city: "New York",  country: "USA",     scans: 2340, pct: 75,  status: "active"   },
  { city: "London",    country: "UK",      scans: 1890, pct: 61,  status: "active"   },
  { city: "Dubai",     country: "UAE",     scans: 1450, pct: 46,  status: "active"   },
  { city: "Toronto",   country: "Canada",  scans: 1120, pct: 36,  status: "active"   },
  { city: "Sydney",    country: "AUS",     scans: 890,  pct: 29,  status: "inactive" },
  { city: "Berlin",    country: "Germany", scans: 720,  pct: 23,  status: "active"   },
  { city: "Singapore", country: "SGP",     scans: 498,  pct: 16,  status: "active"   },
];

const SCAN_HOTSPOTS = [
  { label: "Connaught Place, Delhi", country: "🇮🇳", scans: 1240, type: "Business Hub",  flagged: false },
  { label: "Times Square, NYC",      country: "🇺🇸", scans: 1105, type: "Tourist Area",  flagged: false },
  { label: "Canary Wharf, London",   country: "🇬🇧", scans: 890,  type: "Business Hub",  flagged: false },
  { label: "Dubai Mall, Dubai",      country: "🇦🇪", scans: 780,  type: "Retail",        flagged: true  },
  { label: "BKC, Mumbai",            country: "🇮🇳", scans: 720,  type: "Business Hub",  flagged: false },
  { label: "Shibuya, Tokyo",         country: "🇯🇵", scans: 665,  type: "Tourist Area",  flagged: false },
];

const REGION_DATA = [
  { name: "Asia Pacific",  value: 44.2, fill: "#ef4444" },
  { name: "North America", value: 28.6, fill: "#f87171" },
  { name: "Europe",        value: 18.3, fill: "#fca5a5" },
  { name: "Middle East",   value: 6.8,  fill: "#fecaca" },
  { name: "Others",        value: 2.1,  fill: "#fee2e2" },
];

const TREND_DAILY = [
  { l: "May 1",  asia: 480, na: 280, eu: 140 },
  { l: "May 6",  asia: 620, na: 380, eu: 195 },
  { l: "May 11", asia: 570, na: 320, eu: 165 },
  { l: "May 16", asia: 740, na: 430, eu: 220 },
  { l: "May 21", asia: 690, na: 395, eu: 205 },
  { l: "May 26", asia: 820, na: 490, eu: 248 },
  { l: "May 31", asia: 870, na: 520, eu: 260 },
];
const TREND_WEEKLY = [
  { l: "W1", asia: 3100, na: 1820, eu: 925  },
  { l: "W2", asia: 3850, na: 2240, eu: 1130 },
  { l: "W3", asia: 3520, na: 2050, eu: 1040 },
  { l: "W4", asia: 4200, na: 2460, eu: 1250 },
];
const TREND_MONTHLY = [
  { l: "Jan", asia: 12000, na: 7200,  eu: 3600 },
  { l: "Feb", asia: 14500, na: 8400,  eu: 4200 },
  { l: "Mar", asia: 13200, na: 7800,  eu: 3900 },
  { l: "Apr", asia: 16000, na: 9200,  eu: 4600 },
  { l: "May", asia: 17800, na: 10400, eu: 5200 },
];
const GROWTH_DATA = [
  { l: "Jan", India: 5200, USA: 3100, UK: 1500 },
  { l: "Feb", India: 5800, USA: 3500, UK: 1700 },
  { l: "Mar", India: 6100, USA: 3800, UK: 1900 },
  { l: "Apr", India: 6700, USA: 4100, UK: 2000 },
  { l: "May", India: 7245, USA: 4582, UK: 2154 },
];

const MAP_DOTS = [
  { x: 390, y: 125, s: 10, c: "#ef4444", label: "India" },
  { x: 195, y: 130, s: 8,  c: "#ef4444", label: "USA"   },
  { x: 310, y: 90,  s: 6,  c: "#dc2626", label: "UK"    },
  { x: 325, y: 95,  s: 5,  c: "#fca5a5", label: "DE"    },
  { x: 460, y: 115, s: 5,  c: "#fca5a5", label: "AUS"   },
  { x: 365, y: 107, s: 6,  c: "#f87171", label: "UAE"   },
  { x: 440, y: 130, s: 4,  c: "#fca5a5", label: "SGP"   },
  { x: 235, y: 118, s: 4,  c: "#fca5a5", label: "CAN"   },
];

const AUDIT_LOGS = [
  { id: 1, user: "Rahul Singh",  action: "Flagged Dubai Mall hotspot",         time: "5 min ago",  type: "flag"     },
  { id: 2, user: "Arjun Sharma", action: "Disabled Singapore country tracking", time: "1 hr ago",   type: "settings" },
  { id: 3, user: "Priya Mehta",  action: "Exported India geographic report",   time: "3 hrs ago",  type: "export"   },
  { id: 4, user: "Rahul Singh",  action: "Added new hotspot: BKC Mumbai",      time: "Yesterday",  type: "add"      },
  { id: 5, user: "Neha Gupta",   action: "Edited city: Sydney scan limit",     time: "2 days ago", type: "edit"     },
];

const LOG_STYLES = {
  flag:     "bg-red-100 text-red-600",
  settings: "bg-amber-100 text-amber-700",
  export:   "bg-blue-100 text-blue-600",
  add:      "bg-green-100 text-green-700",
  edit:     "bg-purple-100 text-purple-700",
};

const TOOLTIP_STYLE = {
  contentStyle: { background: "#fff", border: "1px solid #fecaca", borderRadius: 8, fontSize: 11 },
  labelStyle:   { color: "#991b1b" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function RangeToggle({ value, onChange }) {
  return (
    <div className="flex gap-0.5 bg-red-50 border border-red-200 rounded-lg p-0.5">
      {["Daily","Weekly","Monthly"].map(r => (
        <button key={r} onClick={() => onChange(r)}
          className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${value === r ? "bg-red-600 text-white shadow-sm" : "text-red-500 hover:text-red-700"}`}>
          {r}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-red-600" : "bg-red-100 border border-red-200"}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s = {
    success: "bg-red-600 border-red-400 text-white",
    error:   "bg-red-800 border-red-600 text-white",
    info:    "bg-rose-600 border-rose-400 text-white",
  };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type] || s.success}`}>
      {type === "error" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100" /></button>
    </div>
  );
}

// ─── ADD HOTSPOT MODAL ────────────────────────────────────────────────────────

function AddHotspotModal({ onClose, onSave }) {
  const [form, setForm]     = useState({ label: "", country: "🇮🇳", scans: "", type: "Business Hub" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = (err) => `w-full bg-red-50 border ${err ? "border-red-500" : "border-red-200"} text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors`;
  const FLAGS = ["🇮🇳","🇺🇸","🇬🇧","🇦🇪","🇦🇺","🇩🇪","🇸🇬","🇨🇦","🇯🇵","🇫🇷"];

  const handleSave = () => {
    const e = {};
    if (!form.label.trim()) e.label = "Required";
    if (!form.scans || isNaN(form.scans)) e.scans = "Enter a valid number";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ ...form, scans: parseInt(form.scans), flagged: false });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-red-900 font-bold text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-500" />Add Scan Hotspot
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Location Name *</label>
            <input value={form.label} onChange={e => set("label", e.target.value)} placeholder="e.g. Connaught Place, Delhi" className={inp(errors.label)} />
            {errors.label && <p className="text-red-500 text-[10px] mt-1">{errors.label}</p>}
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Country Flag</label>
            <div className="flex gap-1.5 flex-wrap">
              {FLAGS.map(f => (
                <button key={f} onClick={() => set("country", f)}
                  className={`w-8 h-8 rounded-lg border text-base flex items-center justify-center transition-all ${form.country === f ? "border-red-500 bg-red-50" : "border-red-200 hover:border-red-400"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Scan Count *</label>
            <input type="number" value={form.scans} onChange={e => set("scans", e.target.value)} placeholder="e.g. 850" className={inp(errors.scans)} />
            {errors.scans && <p className="text-red-500 text-[10px] mt-1">{errors.scans}</p>}
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Location Type</label>
            <div className="relative">
              <select value={form.type} onChange={e => set("type", e.target.value)}
                className="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 pr-8 rounded-lg focus:outline-none focus:border-red-500 appearance-none cursor-pointer">
                {["Business Hub","Tourist Area","Retail","Transport Hub","Education","Healthcare"].map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
          <button onClick={handleSave} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />Add Hotspot
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB CONTENT ─────────────────────────────────────────────────────

function OverviewContent({ trendRange, setTrendRange }) {
  const trendData = trendRange === "Daily" ? TREND_DAILY : trendRange === "Weekly" ? TREND_WEEKLY : TREND_MONTHLY;
  return (
    <div className="space-y-4">
      {/* Map + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-red-500" />Global Scan Map
          </h3>
          <svg viewBox="0 0 560 220" className="w-full rounded-lg" style={{ height: 130, background: "linear-gradient(135deg,#fff5f5,#fef2f2)" }}>
            <path d="M60,55 Q90,42 135,48 Q175,52 185,88 Q190,118 165,138 Q140,152 112,148 Q82,142 65,118 Q48,92 60,55Z" fill="#fecaca" opacity="0.7" />
            <path d="M130,158 Q162,153 178,173 Q188,198 178,228 Q168,248 148,252 Q122,252 112,232 Q102,208 107,183 Q112,162 130,158Z" fill="#fecaca" opacity="0.7" />
            <path d="M252,45 Q278,40 298,52 Q314,62 309,82 Q304,98 284,102 Q262,102 252,88 Q244,72 252,45Z" fill="#fecaca" opacity="0.7" />
            <path d="M262,112 Q293,107 308,128 Q318,153 312,183 Q305,208 288,218 Q268,222 256,203 Q246,178 248,153 Q250,128 262,112Z" fill="#fecaca" opacity="0.7" />
            <path d="M312,42 Q378,32 440,48 Q492,58 507,83 Q512,108 492,123 Q462,133 422,128 Q382,123 343,108 Q313,93 308,73 Q306,55 312,42Z" fill="#fecaca" opacity="0.7" />
            <path d="M316,106 Q336,102 348,116 Q354,132 344,142 Q330,146 320,136 Q312,124 316,106Z" fill="#fecaca" opacity="0.7" />
            <path d="M448,158 Q488,154 508,174 Q518,192 508,206 Q494,218 470,216 Q447,212 439,194 Q433,176 448,158Z" fill="#fecaca" opacity="0.7" />
            {MAP_DOTS.map((d, i) => (
              <g key={i}>
                <circle cx={d.x} cy={d.y} r={d.s+6} fill={d.c} opacity="0.12" />
                <circle cx={d.x} cy={d.y} r={d.s+3} fill={d.c} opacity="0.20" />
                <circle cx={d.x} cy={d.y} r={d.s}   fill={d.c} opacity="0.95" />
                <circle cx={d.x} cy={d.y} r={d.s-2} fill="white" opacity="0.35" />
              </g>
            ))}
          </svg>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {[{ c:"#ef4444",label:"High (>5k)"},{c:"#f87171",label:"Mid (1–5k)"},{c:"#fca5a5",label:"Low (<1k)"}].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: l.c }} />
                <span className="text-red-400 text-[10px]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-500" />Regional Breakdown
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={REGION_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={2}>
                    {REGION_DATA.map((d,i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11 }} itemStyle={{ color:"#ef4444" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-red-900 font-bold text-xs">38</span>
                <span className="text-red-400 text-[8px]">Countries</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {REGION_DATA.map(r => (
                <div key={r.name}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.fill }} />
                    <span className="text-red-600 text-xs flex-1">{r.name}</span>
                    <span className="text-red-900 text-xs font-bold">{r.value}%</span>
                  </div>
                  <div className="h-1 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${r.value}%`, background:r.fill }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trend + Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-red-900 font-semibold text-sm">Region Trend</h3>
            <RangeToggle value={trendRange} onChange={setTrendRange} />
          </div>
          <ResponsiveContainer width="100%" height={145}>
            <AreaChart data={trendData} margin={{ top:4,right:4,left:-20,bottom:0 }}>
              <defs>
                <linearGradient id="asiaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="naGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false} />
              <XAxis dataKey="l" tick={{ fontSize:8,fill:"#f87171" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:8,fill:"#f87171" }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color:"#ef4444" }} />
              <Area type="monotone" dataKey="asia" name="Asia Pacific" stroke="#ef4444" strokeWidth={2} fill="url(#asiaGrad)" dot={{ r:2.5,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5 }} />
              <Area type="monotone" dataKey="na"   name="N. America"   stroke="#f87171" strokeWidth={2} fill="url(#naGrad)"   dot={{ r:2.5,fill:"#f87171",stroke:"#fff",strokeWidth:1.5 }} />
              <Area type="monotone" dataKey="eu"   name="Europe"       stroke="#fca5a5" strokeWidth={2} fill="transparent"    dot={{ r:2.5,fill:"#fca5a5",stroke:"#fff",strokeWidth:1.5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-red-900 font-semibold text-sm">Top Country Growth</h3>
            <span className="text-red-400 text-[10px]">Jan – May 2025</span>
          </div>
          <ResponsiveContainer width="100%" height={145}>
            <BarChart data={GROWTH_DATA} margin={{ top:4,right:4,left:-20,bottom:0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false} />
              <XAxis dataKey="l" tick={{ fontSize:8,fill:"#f87171" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:8,fill:"#f87171" }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color:"#ef4444" }} />
              <Bar dataKey="India" name="India" fill="#ef4444" radius={[3,3,0,0]} />
              <Bar dataKey="USA"   name="USA"   fill="#f87171" radius={[3,3,0,0]} />
              <Bar dataKey="UK"    name="UK"    fill="#fca5a5" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── COUNTRIES TAB ────────────────────────────────────────────────────────────

function CountriesTab({ showToast }) {
  const [countries, setCountries] = useState(COUNTRIES);
  const [search, setSearch]       = useState("");

  const filtered = countries.filter(c =>
    !search || c.country.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (idx) => {
    setCountries(prev => prev.map((c, i) => i === idx ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
    showToast("Country status updated.", "info");
  };

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex-1">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search countries…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
        </div>
        <button onClick={() => showToast("Exporting countries…", "info")}
          className="flex items-center gap-1.5 text-xs px-3 py-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all flex-shrink-0">
          <Download className="w-3.5 h-3.5" />Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[520px]">
          <thead>
            <tr className="bg-red-50 border-b border-red-100">
              {["#","Country","Top City","Scans","Growth","Status","Action"].map(h => (
                <th key={h} className="text-left text-red-500 font-semibold px-3 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white border border-red-100">
            {filtered.map((c, i) => (
              <tr key={c.country} className={`hover:bg-red-50/50 transition-colors ${i < filtered.length-1 ? "border-b border-red-50" : ""}`}>
                <td className="px-3 py-2.5 text-red-400 font-mono">{i+1}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span className="text-red-900 font-semibold">{c.country}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-red-500">{c.city}</td>
                <td className="px-3 py-2.5 text-red-900 font-bold">{c.scans.toLocaleString()}</td>
                <td className="px-3 py-2.5">
                  <span className="text-green-600 font-semibold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />{c.growth}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => showToast(`Editing ${c.country}…`, "info")} className="text-red-400 hover:text-red-600 transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toggleStatus(i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── CITIES TAB ───────────────────────────────────────────────────────────────

function CitiesTab({ showToast }) {
  const [cities, setCities] = useState(CITIES);
  const [search, setSearch] = useState("");

  const filtered = cities.filter(c =>
    !search || c.city.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (idx) => {
    setCities(prev => prev.map((c, i) => i === idx ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
    showToast("City status updated.", "info");
  };

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex-1">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cities…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={c.city} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 hover:bg-red-50/80 transition-colors">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm shadow-red-200">
              {i+1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div>
                  <span className="text-red-900 text-xs font-semibold">{c.city}</span>
                  <span className="text-red-400 text-[10px] ml-1">{c.country}</span>
                </div>
                <span className="text-red-900 text-xs font-bold">{c.scans.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-red-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500" style={{ width:`${c.pct}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${c.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                {c.status}
              </span>
              <button onClick={() => showToast(`Editing ${c.city}…`, "info")} className="text-red-400 hover:text-red-600 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => toggleStatus(i)} className="text-red-400 hover:text-red-600 transition-colors">
                <Power className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => { setCities(p => p.filter((_,j) => j !== i)); showToast(`${c.city} removed.`, "error"); }} className="text-red-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOTSPOTS TAB ─────────────────────────────────────────────────────────────

function HotspotsTab({ showToast }) {
  const [hotspots, setHotspots]   = useState(SCAN_HOTSPOTS);
  const [showModal, setShowModal] = useState(false);
  const [logs]                    = useState(AUDIT_LOGS);
  const [logSearch, setLogSearch] = useState("");

  const toggleFlag = (i) => {
    setHotspots(prev => prev.map((h, idx) => idx === i ? { ...h, flagged: !h.flagged } : h));
    showToast(hotspots[i].flagged ? "Flag removed." : "Hotspot flagged.", hotspots[i].flagged ? "success" : "error");
  };

  const handleAdd = (form) => {
    setHotspots(prev => [...prev, form]);
    setShowModal(false);
    showToast("Hotspot added successfully!");
  };

  const filteredLogs = logs.filter(l =>
    !logSearch || l.action.toLowerCase().includes(logSearch.toLowerCase()) || l.user.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <>
      {showModal && <AddHotspotModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hotspot management */}
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />Scan Hotspots
            </h3>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm shadow-red-200">
              <Plus className="w-3.5 h-3.5" />Add
            </button>
          </div>
          <div className="space-y-2">
            {hotspots.map((h, i) => (
              <div key={h.label} className={`flex items-start gap-2 p-2.5 rounded-xl border transition-colors ${h.flagged ? "bg-red-50 border-red-300" : "bg-red-50/50 border-red-100"}`}>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm mt-0.5">
                  {i+1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-red-900 text-xs font-semibold truncate">{h.label}</span>
                    <span className="text-base flex-shrink-0">{h.country}</span>
                    {h.flagged && <Flag className="w-3 h-3 text-red-600 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md font-medium">{h.type}</span>
                    <span className="text-red-900 text-[10px] font-bold">{h.scans.toLocaleString()} scans</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => showToast(`Editing ${h.label}…`, "info")} className="text-red-400 hover:text-red-600 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => toggleFlag(i)} className={`transition-colors ${h.flagged ? "text-red-600 hover:text-red-800" : "text-red-300 hover:text-red-600"}`}>
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { setHotspots(p => p.filter((_,j) => j !== i)); showToast("Hotspot removed.", "error"); }} className="text-red-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit log */}
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />Audit Log
          </h3>
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
            <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <input value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Search logs…"
              className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
          </div>
          <div className="space-y-2">
            {filteredLogs.map(l => (
              <div key={l.id} className="flex items-start gap-2.5 p-2.5 bg-red-50/60 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${LOG_STYLES[l.type]}`}>{l.type}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-red-900 text-[11px] font-semibold">{l.user}</div>
                  <div className="text-red-500 text-[10px] leading-snug">{l.action}</div>
                </div>
                <span className="text-red-300 text-[10px] flex-shrink-0 whitespace-nowrap">{l.time}</span>
              </div>
            ))}
          </div>
          <button onClick={() => showToast("Exporting audit log…", "info")}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
            <Download className="w-3.5 h-3.5" />Export Full Log
          </button>
        </div>
      </div>
    </>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",  label: "Overview",     Icon: Globe2      },
  { id: "countries", label: "Countries",    Icon: MapPin      },
  { id: "cities",    label: "Top Cities",   Icon: Navigation  },
  { id: "hotspots",  label: "Hotspots",     Icon: Layers      },
];

const STATS = [
  { Icon: Globe2,     bg: "from-red-500 to-rose-600",  label: "Countries Reached", value: "38",     change: "+5 new"  },
  { Icon: MapPin,     bg: "from-rose-500 to-red-600",  label: "Cities Reached",    value: "124",    change: "+12 new" },
  { Icon: Radio,      bg: "from-red-600 to-rose-700",  label: "Intl. Scans",       value: "21,162", change: "+28.4%"  },
  { Icon: Users,      bg: "from-rose-600 to-red-800",  label: "Global Users",      value: "8,721",  change: "+21.4%"  },
  { Icon: TrendingUp, bg: "from-red-700 to-rose-600",  label: "Fastest Growing",   value: "India",  change: "+24.3%"  },
  { Icon: BarChart2,  bg: "from-rose-700 to-red-700",  label: "Top Continent",     value: "Asia",   change: "44.2%"   },
];

export default function GeographicReportsPage({ onMenuClick }) {
  const [tab,        setTab]        = useState("overview");
  const [trendRange, setTrendRange] = useState("Daily");
  const [period,     setPeriod]     = useState("This Month");
  const [toast,      setToast]      = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "" }), 3000); };

  const handleExport = () => {
    const rows = COUNTRIES.map(c => `${c.country},${c.scans},${c.growth}`);
    const blob = new Blob([["Country,Scans,Growth", ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "geographic_reports.csv"; a.click();
    showToast("Report exported!");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-5 py-4">

        {/* Title + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Geographic Reports</h1>
              <p className="text-red-400 text-xs hidden sm:block">Admin — manage countries, cities and scan hotspots</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-xs text-red-500">
              <Calendar className="w-3.5 h-3.5" />May 1 – May 31, 2025
            </div>
            <select value={period} onChange={e => setPeriod(e.target.value)}
              className="bg-white border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              {["This Month","Last Month","Last 7 Days","Last 90 Days"].map(o => <option key={o}>{o}</option>)}
            </select>
            <button onClick={handleExport}
              className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 hover:border-red-400 transition-all shadow-sm">
              <Download className="w-3.5 h-3.5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <span className="text-red-400 text-xs">Rahul Singh</span>
              <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">RS</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-4 border-b border-red-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 mb-4">
          {STATS.map(s => (
            <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 hover:border-red-300 transition-colors shadow-sm hover:shadow-md">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center mb-2 shadow-md shadow-red-100`}>
                <s.Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-red-400 text-[9px] leading-tight mb-0.5 truncate">{s.label}</div>
              <div className="text-red-900 font-bold text-sm leading-tight">{s.value}</div>
              <div className="text-red-500 text-[10px] font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />{s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Tab content */}
        {tab === "overview"  && <OverviewContent trendRange={trendRange} setTrendRange={setTrendRange} />}
        {tab === "countries" && <CountriesTab showToast={showToast} />}
        {tab === "cities"    && <CitiesTab    showToast={showToast} />}
        {tab === "hotspots"  && <HotspotsTab  showToast={showToast} />}

      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "" })} />
    </div>
  );
}
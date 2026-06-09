import { useState } from "react";
import {
  CreditCard, Download, Plus, CheckCircle2, X, AlertTriangle,
  ChevronDown, ArrowUpRight, Crown, Zap, Users, Calendar,
  Receipt, TrendingUp, Shield, RefreshCw, Edit3, Trash2,
  Clock, Globe, Package,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PLANS = [
  { name:"Free",       price:"₹0",      period:"/mo", users:"Up to 50",   credits:"500/mo",    api:false, bulk:false, current:false, color:"border-red-200"  },
  { name:"Basic",      price:"₹499",    period:"/mo", users:"Up to 200",  credits:"3,000/mo",  api:false, bulk:false, current:false, color:"border-red-300"  },
  { name:"Premium",    price:"₹1,499",  period:"/mo", users:"Up to 1,000",credits:"15,000/mo", api:true,  bulk:true,  current:true,  color:"border-red-600"  },
  { name:"Enterprise", price:"Custom",  period:"",    users:"Unlimited",  credits:"Unlimited", api:true,  bulk:true,  current:false, color:"border-rose-700" },
];

const TRANSACTIONS = [
  { id:"TXN-20240531-001", desc:"Premium Plan — May 2025",   amount:"₹1,499", status:"Success", date:"31 May 2025", method:"Visa •••4242"    },
  { id:"TXN-20240501-001", desc:"Premium Plan — Apr 2025",   amount:"₹1,499", status:"Success", date:"01 May 2025", method:"Visa •••4242"    },
  { id:"TXN-20240401-001", desc:"Credit Top-Up — 5,000",     amount:"₹499",   status:"Success", date:"12 Apr 2025", method:"UPI"              },
  { id:"TXN-20240401-002", desc:"Premium Plan — Mar 2025",   amount:"₹1,499", status:"Success", date:"01 Apr 2025", method:"Visa •••4242"    },
  { id:"TXN-20240315-001", desc:"Credit Top-Up — 10,000",    amount:"₹999",   status:"Success", date:"15 Mar 2025", method:"Net Banking"      },
  { id:"TXN-20240301-001", desc:"Premium Plan — Feb 2025",   amount:"₹1,499", status:"Failed",  date:"01 Mar 2025", method:"Visa •••4242"    },
  { id:"TXN-20240215-001", desc:"Credit Top-Up — 1,000",     amount:"₹149",   status:"Success", date:"15 Feb 2025", method:"UPI"              },
];

const REVENUE_DATA = [
  { m:"Jan", revenue:128400 },
  { m:"Feb", revenue:142600 },
  { m:"Mar", revenue:156800 },
  { m:"Apr", revenue:171200 },
  { m:"May", revenue:189500 },
];

const PLAN_DIST = [
  { plan:"Enterprise", count:12,  fill:"#7f1d1d" },
  { plan:"Premium",    count:348, fill:"#ef4444" },
  { plan:"Basic",      count:891, fill:"#f87171" },
  { plan:"Free",       count:2410,fill:"#fecaca" },
];

const TOOLTIP = {
  contentStyle:{ background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11 },
  labelStyle:{ color:"#991b1b" }, itemStyle:{ color:"#ef4444" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s = { success:"bg-red-600 border-red-400 text-white", error:"bg-red-800 border-red-600 text-white", info:"bg-rose-600 border-rose-400 text-white" };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type]||s.info}`}>
      {type==="error"?<AlertTriangle className="w-4 h-4"/>:<CheckCircle2 className="w-4 h-4"/>}
      {msg}<button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── PLANS PANEL ──────────────────────────────────────────────────────────────

function PlansPanel({ showToast }) {
  const [plans, setPlans] = useState(PLANS);
  const [selected, setSelected] = useState("Premium");

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {plans.map(p=>(
          <div key={p.name} onClick={()=>setSelected(p.name)}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selected===p.name?"border-red-600 shadow-md shadow-red-100":"border-red-100 hover:border-red-300"} ${p.current?"relative":""}`}>
            {p.current&&<div className="absolute top-2 right-2 text-[9px] bg-green-100 text-green-700 border border-green-200 font-bold px-1.5 py-0.5 rounded-full">Current</div>}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-red-900 font-bold text-sm flex items-center gap-1.5">
                  {p.name==="Enterprise"&&<Crown className="w-3.5 h-3.5 text-amber-500"/>}
                  {p.name}
                </div>
                <div className="flex items-end gap-0.5 mt-0.5">
                  <span className="text-red-900 font-bold text-lg">{p.price}</span>
                  <span className="text-red-400 text-xs mb-0.5">{p.period}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-red-400 text-[11px]">{p.users} users</div>
                <div className="text-red-600 text-[11px] font-semibold">{p.credits}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className={`flex items-center gap-1 font-semibold ${p.api?"text-green-600":"text-red-300"}`}>
                {p.api?<CheckCircle2 className="w-3 h-3"/>:<X className="w-3 h-3"/>}API Access
              </span>
              <span className={`flex items-center gap-1 font-semibold ${p.bulk?"text-green-600":"text-red-300"}`}>
                {p.bulk?<CheckCircle2 className="w-3 h-3"/>:<X className="w-3 h-3"/>}Bulk Ops
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={()=>showToast(`Editing ${selected} plan limits…`,"info")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
          <Edit3 className="w-3.5 h-3.5"/>Edit Plan
        </button>
        <button onClick={()=>showToast("Plan changes saved!")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
          <CheckCircle2 className="w-3.5 h-3.5"/>Apply Changes
        </button>
      </div>
    </div>
  );
}

// ─── TRANSACTIONS PANEL ───────────────────────────────────────────────────────

function TransactionsPanel({ showToast }) {
  const [search, setSearch] = useState("");
  const filtered = TRANSACTIONS.filter(t=>
    !search||t.desc.toLowerCase().includes(search.toLowerCase())||t.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const rows = TRANSACTIONS.map(t=>`${t.id},${t.desc},${t.amount},${t.status},${t.date}`);
    const blob = new Blob([["ID,Description,Amount,Status,Date",...rows].join("\n")],{type:"text/csv"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv"; a.click();
    showToast("Transactions exported!");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex-1">
          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all flex-shrink-0">
          <Download className="w-3.5 h-3.5"/>Export
        </button>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filtered.map(t=>(
          <div key={t.id} className="flex items-center gap-3 p-3 bg-red-50/60 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.status==="Success"?"bg-green-100":"bg-red-100"}`}>
              {t.status==="Success"?<CheckCircle2 className="w-4 h-4 text-green-600"/>:<AlertTriangle className="w-4 h-4 text-red-500"/>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-red-900 text-xs font-semibold truncate">{t.desc}</div>
              <div className="text-red-400 text-[10px]">{t.id} · {t.method}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-red-900 text-xs font-bold">{t.amount}</div>
              <div className="text-red-400 text-[10px]">{t.date}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Revenue chart */}
      <div className="pt-2 border-t border-red-100">
        <div className="text-red-700 text-xs font-semibold mb-2">Monthly Revenue (₹)</div>
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={REVENUE_DATA} margin={{top:2,right:2,left:-15,bottom:0}}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
            <XAxis dataKey="m" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
            <Tooltip {...TOOLTIP}/>
            <Area type="monotone" dataKey="revenue" name="Revenue ₹" stroke="#ef4444" strokeWidth={2} fill="url(#revGrad)" dot={{r:2.5,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"plans",        label:"Plans & Pricing",   Icon:Crown   },
  { id:"transactions", label:"Transactions",       Icon:Receipt },
  { id:"overview",     label:"Revenue Overview",   Icon:TrendingUp },
];

const STATS = [
  { Icon:TrendingUp, bg:"from-red-500 to-rose-600", label:"MRR",            val:"₹7,84,200", sub:"+22.4% MoM",   up:true  },
  { Icon:Users,      bg:"from-rose-500 to-red-600", label:"Paid Users",     val:"1,251",     sub:"+87 this month",up:true  },
  { Icon:Crown,      bg:"from-red-600 to-rose-700", label:"Premium Users",  val:"348",       sub:"27.8% of paid", up:null  },
  { Icon:Zap,        bg:"from-rose-600 to-red-700", label:"Credits Sold",   val:"4.2M",      sub:"+18.5% MoM",   up:true  },
];

export default function AdminBillingPage({ onMenuClick, navigate }) {
  const [tab,   setTab]   = useState("plans");
  const [toast, setToast] = useState({ msg:"", type:"success" });
  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast({msg:""}),3000); };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} navigate={navigate}/>
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <CreditCard className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Billing & Plans</h1>
            <p className="text-red-400 text-xs hidden sm:block">Manage subscription plans, pricing and transaction history</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="text-red-400 text-xs">Rahul Singh</span>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">RS</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {STATS.map(s=>(
            <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 flex items-center gap-2.5 shadow-sm hover:border-red-300 transition-all">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center shadow-md shadow-red-100 flex-shrink-0`}>
                <s.Icon className="w-4 h-4 text-white"/>
              </div>
              <div className="min-w-0">
                <div className="text-red-400 text-[10px] truncate">{s.label}</div>
                <div className="text-red-900 font-bold text-sm leading-tight">{s.val}</div>
                <div className={`text-[10px] flex items-center gap-0.5 ${s.up===true?"text-green-600":"text-red-400"}`}>
                  {s.up&&<ArrowUpRight className="w-3 h-3"/>}{s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Col 1: Plans */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="plans"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><Crown className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">Plans & Pricing</h2>
            </div>
            <PlansPanel showToast={showToast}/>
          </div>

          {/* Col 2: Transactions */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="transactions"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><Receipt className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">Transactions</h2>
            </div>
            <TransactionsPanel showToast={showToast}/>
          </div>

          {/* Col 3: Revenue Overview */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="overview"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">Revenue Overview</h2>
            </div>
            <div className="space-y-4">
              {/* Plan distribution */}
              <div>
                <div className="text-red-700 text-xs font-semibold mb-2">Users by Plan</div>
                <div className="space-y-2">
                  {PLAN_DIST.map(p=>(
                    <div key={p.plan} className="flex items-center gap-2">
                      <span className="text-red-600 text-xs w-20 flex-shrink-0">{p.plan}</span>
                      <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${Math.round(p.count/2410*100)}%`,background:p.fill}}/>
                      </div>
                      <span className="text-red-400 text-[11px] w-10 text-right flex-shrink-0">{p.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Revenue bar chart */}
              <div>
                <div className="text-red-700 text-xs font-semibold mb-2">Monthly Revenue Trend</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={REVENUE_DATA} margin={{top:4,right:4,left:-15,bottom:0}} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                    <XAxis dataKey="m" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <Tooltip {...TOOLTIP}/>
                    <Bar dataKey="revenue" name="Revenue ₹" fill="#ef4444" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Summary stats */}
              <div className="border-t border-red-100 pt-3 space-y-1.5">
                {[
                  { k:"Total Revenue (YTD)",    v:"₹32,46,500" },
                  { k:"Avg Revenue per User",   v:"₹2,595"     },
                  { k:"Churn Rate",             v:"2.1%"        },
                  { k:"Avg Plan Duration",      v:"7.4 months"  },
                ].map(s=>(
                  <div key={s.k} className="flex justify-between text-xs">
                    <span className="text-red-400">{s.k}</span>
                    <span className="text-red-900 font-semibold">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}
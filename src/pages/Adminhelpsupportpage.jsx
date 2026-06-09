import { useState } from "react";
import {
  HelpCircle, MessageCircle, FileText, CheckCircle2, X,
  AlertTriangle, Search, Clock, Send, Trash2, Edit3,
  ChevronDown, ArrowUpRight, Users, Star, Shield,
  ThumbsUp, ThumbsDown, RefreshCw, Download, Flag,
  Eye, Archive, Plus, BookOpen, Video, Radio,
} from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TICKETS = [
  { id:"TKT-1042", user:"Priya Mehta",  email:"priya@gmail.com",  subject:"NFC write failing on NTAG216",      status:"Open",        priority:"High",   cat:"NFC Cards",   date:"31 May 2025", assignee:"Arjun S."  },
  { id:"TKT-1041", user:"Aditya Kumar", email:"aditya@tc.in",     subject:"API rate limit exceeded",           status:"In Progress", priority:"Normal", cat:"API",         date:"30 May 2025", assignee:"Priya M."  },
  { id:"TKT-1040", user:"Sunita Rao",   email:"sunita@ep.com",    subject:"Invoice discrepancy ₹1,200",        status:"Open",        priority:"High",   cat:"Billing",     date:"29 May 2025", assignee:"Neha G."   },
  { id:"TKT-1039", user:"Karan Shah",   email:"karan@sx.io",      subject:"Bulk CSV import not working",       status:"Resolved",    priority:"Normal", cat:"Bulk Ops",    date:"28 May 2025", assignee:"Rohan D."  },
  { id:"TKT-1038", user:"Meera Pillai", email:"meera@hp.co",      subject:"API key permissions question",      status:"Resolved",    priority:"Low",    cat:"API",         date:"27 May 2025", assignee:"Priya M."  },
  { id:"TKT-1037", user:"Rohan Verma",  email:"rohan@edu.in",     subject:"iOS NFC support query",             status:"Closed",      priority:"Low",    cat:"NFC Cards",   date:"26 May 2025", assignee:"Arjun S."  },
];

const FAQS = [
  { id:1, q:"How do I write data to an NFC card?",        cat:"NFC Cards", views:4821, helpful:94, status:"published" },
  { id:2, q:"Which devices support Web NFC?",             cat:"NFC Cards", views:3210, helpful:89, status:"published" },
  { id:3, q:"How do I top up my credits?",                cat:"Billing",   views:2105, helpful:87, status:"published" },
  { id:4, q:"What is the difference between plans?",      cat:"Billing",   views:1890, helpful:92, status:"draft"     },
  { id:5, q:"How do I generate an API key?",              cat:"API",       views:1540, helpful:88, status:"published" },
  { id:6, q:"Why is my NFC write failing?",               cat:"NFC Cards", views:3780, helpful:85, status:"published" },
];

const TICKET_STATUS_STYLES = {
  "Open":        "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  "Resolved":    "bg-purple-100 text-purple-700 border-purple-200",
  "Closed":      "bg-gray-100 text-gray-500 border-gray-200",
};

const PRIORITY_STYLES = {
  High:   "bg-red-100 text-red-700 border-red-200",
  Normal: "bg-red-50 text-red-500 border-red-200",
  Low:    "bg-gray-100 text-gray-500 border-gray-200",
};

const CHART_DATA = [
  { day:"Mon", tickets:8, resolved:6 },
  { day:"Tue", tickets:14,resolved:11},
  { day:"Wed", tickets:9, resolved:8 },
  { day:"Thu", tickets:17,resolved:13},
  { day:"Fri", tickets:11,resolved:9 },
  { day:"Sat", tickets:4, resolved:4 },
  { day:"Sun", tickets:3, resolved:3 },
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

// ─── TICKETS PANEL ────────────────────────────────────────────────────────────

function TicketsPanel({ showToast }) {
  const [tickets, setTickets]   = useState(TICKETS);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [reply, setReply]       = useState("");

  const filtered = tickets.filter(t=>{
    const matchS = filter==="All"||t.status===filter;
    const matchQ = !search||t.subject.toLowerCase().includes(search.toLowerCase())||t.user.toLowerCase().includes(search.toLowerCase());
    return matchS&&matchQ;
  });

  const updateTicket = (id, patch) => {
    setTickets(p=>p.map(t=>t.id===id?{...t,...patch}:t));
    if (selected?.id===id) setSelected(p=>({...p,...patch}));
  };

  const handleReply = () => {
    if (!reply.trim()) { showToast("Type a reply first.","error"); return; }
    updateTicket(selected.id, {status:"In Progress"});
    setReply("");
    showToast(`Reply sent to ${selected.user.split(" ")[0]}!`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
        <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tickets…"
          className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {["All","Open","In Progress","Resolved","Closed"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${filter===s?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {filtered.map(t=>(
          <div key={t.id} onClick={()=>{setSelected(t);setReply("");}}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.id===t.id?"border-red-400 bg-red-50":"border-red-100 bg-white hover:bg-red-50/50"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-red-400 text-[10px] font-mono">{t.id}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
              </div>
              <div className="text-red-900 text-xs font-semibold truncate">{t.subject}</div>
              <div className="text-red-400 text-[10px] mt-0.5">{t.user} · {t.cat}</div>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-[10px] text-red-300">{t.date}</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${TICKET_STATUS_STYLES[t.status]}`}>{t.status}</span>
            </div>
          </div>
        ))}
      </div>
      {selected&&(
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-900 text-xs font-bold">{selected.subject}</div>
              <div className="text-red-400 text-[10px]">{selected.user} · {selected.email}</div>
            </div>
            <button onClick={()=>setSelected(null)} className="text-red-300 hover:text-red-600 transition-colors"><X className="w-4 h-4"/></button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["Open","In Progress","Resolved","Closed"].map(s=>(
              <button key={s} onClick={()=>{updateTicket(selected.id,{status:s});showToast("Status updated to "+s,"info");}}
                className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium transition-all ${selected.status===s?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
                {s}
              </button>
            ))}
          </div>
          <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={2} placeholder="Reply to user…"
            className="w-full bg-white border border-red-200 text-red-900 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 resize-none"/>
          <div className="flex justify-between items-center">
            <button onClick={()=>{setTickets(p=>p.filter(t=>t.id!==selected.id));setSelected(null);showToast("Ticket deleted.","error");}}
              className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 transition-colors">
              <Trash2 className="w-3 h-3"/>Delete
            </button>
            <button onClick={handleReply}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
              <Send className="w-3 h-3"/>Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FAQS PANEL ───────────────────────────────────────────────────────────────

function FaqsPanel({ showToast }) {
  const [faqs, setFaqs] = useState(FAQS);
  const [open, setOpen] = useState(null);

  const toggleStatus = (id) => {
    setFaqs(p=>p.map(f=>f.id===id?{...f,status:f.status==="published"?"draft":"published"}:f));
    showToast("FAQ status updated.","info");
  };

  return (
    <div className="space-y-3">
      <button onClick={()=>showToast("New FAQ editor opened","info")}
        className="w-full flex items-center justify-center gap-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-xs font-semibold py-2 rounded-xl transition-all">
        <Plus className="w-3.5 h-3.5"/>Add New FAQ
      </button>
      <div className="space-y-2">
        {faqs.map(f=>(
          <div key={f.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${open===f.id?"border-red-300":"border-red-100 hover:border-red-200"}`}>
            <div className="flex items-center gap-2 p-3">
              <button onClick={()=>setOpen(open===f.id?null:f.id)} className="flex-1 text-left">
                <div className="text-red-900 text-xs font-semibold truncate">{f.q}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{f.cat}</span>
                  <span className="text-[10px] text-red-400">{f.views.toLocaleString()} views · {f.helpful}% helpful</span>
                </div>
              </button>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${f.status==="published"?"bg-green-100 text-green-700 border-green-200":"bg-gray-100 text-gray-500 border-gray-200"}`}>
                  {f.status}
                </span>
                <button onClick={()=>toggleStatus(f.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5"/>
                </button>
                <button onClick={()=>showToast("Edit FAQ","info")} className="text-red-400 hover:text-red-600 transition-colors">
                  <Edit3 className="w-3.5 h-3.5"/>
                </button>
                <button onClick={()=>{setFaqs(p=>p.filter(x=>x.id!==f.id));showToast("FAQ deleted.","error");}} className="text-red-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OVERVIEW PANEL ───────────────────────────────────────────────────────────

function OverviewPanel({ showToast }) {
  const AGENTS = [
    { name:"Arjun Sharma",  initials:"AS", bg:"bg-red-600",  open:8, resolved:34, csat:"4.9", online:true  },
    { name:"Priya Mehta",   initials:"PM", bg:"bg-rose-600", open:5, resolved:27, csat:"5.0", online:true  },
    { name:"Rohan Das",     initials:"RD", bg:"bg-red-700",  open:6, resolved:19, csat:"4.8", online:false },
    { name:"Neha Gupta",    initials:"NG", bg:"bg-red-800",  open:4, resolved:22, csat:"4.7", online:true  },
  ];

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {[{l:"Tickets",c:"#ef4444"},{l:"Resolved",c:"#fca5a5"}].map(s=>(
            <div key={s.l} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
              <span className="text-red-400 text-[10px]">{s.l}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={CHART_DATA} margin={{top:4,right:4,left:-25,bottom:0}} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
            <XAxis dataKey="day" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
            <Tooltip {...TOOLTIP}/>
            <Bar dataKey="tickets"  name="Tickets"  fill="#ef4444" radius={[2,2,0,0]}/>
            <Bar dataKey="resolved" name="Resolved" fill="#fca5a5" radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agents */}
      <div>
        <div className="text-red-700 text-xs font-semibold mb-2">Agent Performance</div>
        <div className="space-y-2">
          {AGENTS.map(a=>(
            <div key={a.name} className="flex items-center gap-2.5 p-2.5 bg-red-50/50 border border-red-100 rounded-xl">
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-full ${a.bg} text-white text-[10px] font-bold flex items-center justify-center`}>{a.initials}</div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${a.online?"bg-green-500":"bg-gray-300"}`}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold">{a.name}</div>
                <div className="text-red-400 text-[10px]">{a.open} open · {a.resolved} resolved · {a.csat}★</div>
              </div>
              <button onClick={()=>showToast(`Assigning tickets to ${a.name}…`,"info")}
                className="text-[10px] px-2 py-1 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all flex-shrink-0">
                Assign
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="border-t border-red-100 pt-3 space-y-1.5">
        {[
          { k:"Open tickets",   v:"23" },
          { k:"Avg response",   v:"1.8h"},
          { k:"CSAT score",     v:"4.9★"},
          { k:"FAQ helpfulness",v:"91%" },
        ].map(s=>(
          <div key={s.k} className="flex justify-between text-xs">
            <span className="text-red-400">{s.k}</span>
            <span className="text-red-900 font-semibold">{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"tickets",  label:"Tickets",  Icon:FileText     },
  { id:"faqs",     label:"FAQs",     Icon:HelpCircle   },
  { id:"overview", label:"Overview", Icon:Users        },
];

export default function AdminHelpSupportPage({ onMenuClick, navigate }) {
  const [tab,   setTab]   = useState("tickets");
  const [toast, setToast] = useState({ msg:"", type:"success" });
  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast({msg:""}),3000); };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} navigate={navigate}/>
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Help & Support Admin</h1>
            <p className="text-red-400 text-xs hidden sm:block">Manage tickets, FAQs and agent performance</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="text-red-400 text-xs">Rahul Singh</span>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">RS</div>
          </div>
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
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="tickets"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">Support Tickets</h2>
            </div>
            <TicketsPanel showToast={showToast}/>
          </div>
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="faqs"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><HelpCircle className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">FAQ Management</h2>
            </div>
            <FaqsPanel showToast={showToast}/>
          </div>
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="overview"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><Users className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">Overview & Agents</h2>
            </div>
            <OverviewPanel showToast={showToast}/>
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}
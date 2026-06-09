import { useState } from "react";
import {
  Search, HelpCircle, MessageCircle, Mail, Phone, FileText,
  ChevronDown, ChevronRight, ExternalLink, Send,
  CheckCircle2, X, Clock, Radio, Shield, Book,
  Video, Star, ThumbsUp, ThumbsDown, AlertTriangle,
  ArrowUpRight, Users, CreditCard, Settings, Wifi,
  Package, BarChart2, Link2, PenLine, Plus, RefreshCw,
  Headphones, Globe, MessageSquare, Trash2, Edit3,
  Eye, Filter, Download, Flag, UserCheck, TrendingUp,
  Bell, ToggleLeft, ToggleRight, Lock, Unlock,
  ChevronUp, Save, BarChart, Activity,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { Icon: PenLine,    label: "Getting Started",   count: 12 },
  { Icon: CreditCard, label: "NFC Cards",          count: 18 },
  { Icon: CreditCard, label: "Billing & Credits",  count: 9  },
  { Icon: Link2,      label: "API & Integrations", count: 15 },
  { Icon: Settings,   label: "Account & Settings", count: 11 },
  { Icon: BarChart2,  label: "Analytics",          count: 7  },
  { Icon: Package,    label: "Bulk Operations",    count: 6  },
  { Icon: Shield,     label: "Security & Privacy", count: 8  },
];

const ALL_FAQS = [
  { id: 1, q: "How do I write data to an NFC card?",           a: "Select 'Write NFC Card' from the sidebar, choose your data type (URL, vCard, WiFi, etc.), enter your data, then tap your NFC card to the back of your Android device. Make sure NFC is enabled in your device settings and you're using Chrome browser for Web NFC support.", cat: "NFC Cards",          views: 4821, helpful: 94, status: "published" },
  { id: 2, q: "Which devices and browsers support Web NFC?",   a: "Web NFC is currently supported on Android devices running Chrome 89 or higher. iOS devices and desktop browsers do not support Web NFC. For iOS, you'll need a dedicated NFC app. Make sure your device has NFC hardware and it's enabled in Settings → Connected Devices.", cat: "NFC Cards",          views: 3210, helpful: 89, status: "published" },
  { id: 3, q: "What NFC card types are supported?",            a: "NFC Writer supports NTAG213, NTAG215, NTAG216, MIFARE Classic, MIFARE Ultralight, and DESFire cards. Most standard NFC tags purchased from retailers are NTAG213 or NTAG215 and will work perfectly.", cat: "NFC Cards",          views: 2908, helpful: 91, status: "published" },
  { id: 4, q: "How do I top up my credits?",                   a: "Go to Wallet & Credits in the sidebar. Choose a preset amount (1,000 / 5,000 / 10,000 / 25,000 credits) or enter a custom amount. Select your payment method and click 'Proceed to Payment'. Credits are added instantly after successful payment.", cat: "Billing & Credits",  views: 2105, helpful: 87, status: "published" },
  { id: 5, q: "What is the difference between Free and Premium plans?", a: "The Free plan includes 500 credits/month, basic card types, and standard analytics. Premium unlocks 15,000 credits/month, all card types including vCard and Custom JSON, advanced analytics, bulk operations, API access, priority support, and custom templates.", cat: "Billing & Credits",  views: 1890, helpful: 92, status: "draft"     },
  { id: 6, q: "How do I generate an API key?",                 a: "Navigate to API & Integrations in the sidebar, click 'Create New Key', enter a key name and select permissions. Your key is generated instantly. Store it securely — it's only shown once.", cat: "API & Integrations", views: 1540, helpful: 88, status: "published" },
  { id: 7, q: "Why is my NFC write failing?",                  a: "Common causes: NFC is disabled on your device, card is locked or password protected, card memory is full, incompatible card type, browser permissions denied, or card removed too quickly during write.", cat: "NFC Cards",          views: 3780, helpful: 85, status: "published" },
  { id: 8, q: "How do I set up a webhook?",                    a: "Go to API & Integrations → Webhooks → Add Webhook. Enter your endpoint URL and select which events to subscribe to. We'll send POST requests to your URL when events occur. Use the Test button to verify your endpoint is working.", cat: "API & Integrations", views: 1230, helpful: 90, status: "draft"     },
];

const ALL_TICKETS = [
  { id: "TKT-1042", user: "Priya Mehta",   email: "priya.m@gmail.com",   subject: "NFC write failing on NTAG216",       status: "Open",        priority: "High",   cat: "NFC Cards",          date: "31 May 2025", assignee: "Arjun S." },
  { id: "TKT-1041", user: "Aditya Kumar",  email: "aditya.k@techcorp.in",subject: "API rate limit exceeded",            status: "In Progress", priority: "Normal", cat: "API & Integrations", date: "30 May 2025", assignee: "Priya M." },
  { id: "TKT-1040", user: "Sunita Rao",    email: "sunita@eventpro.com", subject: "Invoice discrepancy ₹1,200",         status: "Open",        priority: "High",   cat: "Billing & Credits",  date: "29 May 2025", assignee: "Neha G."  },
  { id: "TKT-1039", user: "Karan Shah",    email: "karan@startup.io",    subject: "Bulk CSV import not working",        status: "Resolved",    priority: "Normal", cat: "Bulk Operations",    date: "28 May 2025", assignee: "Rohan D." },
  { id: "TKT-1038", user: "Meera Pillai",  email: "meera@healthplus.co", subject: "API key permissions question",       status: "Resolved",    priority: "Low",    cat: "API & Integrations", date: "27 May 2025", assignee: "Priya M." },
  { id: "TKT-1037", user: "Rohan Verma",   email: "rohan@edutech.in",    subject: "iOS NFC support query",              status: "Closed",      priority: "Low",    cat: "NFC Cards",          date: "26 May 2025", assignee: "Arjun S." },
];

const ALL_ARTICLES = [
  { id: 1, Icon: PenLine,   title: "Quick Start: Write Your First NFC Card",      cat: "Getting Started", views: 12400, status: "published", updated: "2 days ago"  },
  { id: 2, Icon: Wifi,      title: "Setting Up WiFi NFC Cards for Your Office",   cat: "NFC Cards",       views: 8200,  status: "published", updated: "5 days ago"  },
  { id: 3, Icon: Users,     title: "Creating vCard Business Cards with NFC",      cat: "NFC Cards",       views: 7100,  status: "published", updated: "1 week ago"  },
  { id: 4, Icon: Package,   title: "Bulk Writing 100+ NFC Cards with CSV Import", cat: "Bulk Operations", views: 5800,  status: "draft",     updated: "3 days ago"  },
  { id: 5, Icon: Link2,     title: "Integrating NFC Writer API with Zapier",      cat: "API",             views: 4300,  status: "published", updated: "2 weeks ago" },
  { id: 6, Icon: BarChart2, title: "Understanding Your NFC Scan Analytics",       cat: "Analytics",       views: 3900,  status: "published", updated: "1 week ago"  },
];

const SUPPORT_AGENTS = [
  { name: "Arjun Sharma", role: "Support Lead",     initials: "AS", bg: "bg-red-600",  open: 8,  resolved: 34, csat: "4.9", online: true  },
  { name: "Priya Mehta",  role: "Technical Expert", initials: "PM", bg: "bg-rose-600", open: 5,  resolved: 27, csat: "5.0", online: true  },
  { name: "Rohan Das",    role: "API Specialist",   initials: "RD", bg: "bg-red-700",  open: 6,  resolved: 19, csat: "4.8", online: false },
  { name: "Neha Gupta",   role: "Billing Expert",   initials: "NG", bg: "bg-red-800",  open: 4,  resolved: 22, csat: "4.7", online: true  },
];

const STATUS_SERVICES = [
  { service: "NFC Writing API",     status: "Operational", uptime: "99.98%" },
  { service: "Analytics Service",   status: "Operational", uptime: "99.95%" },
  { service: "Webhook Delivery",    status: "Degraded",    uptime: "98.12%" },
  { service: "Payment Processing",  status: "Operational", uptime: "99.99%" },
  { service: "Dashboard & Web App", status: "Operational", uptime: "99.97%" },
];

const METRICS = [
  { label: "Total Tickets",    val: "86",   sub: "+12 today",           up: true  },
  { label: "Open",             val: "23",   sub: "4 high priority",     up: false },
  { label: "Avg Response",     val: "1.8h", sub: "−0.3h vs yesterday",  up: true  },
  { label: "Resolved Today",   val: "31",   sub: "↑ 8 from yesterday",  up: true  },
  { label: "CSAT Score",       val: "4.9",  sub: "from 48 ratings",     up: true  },
  { label: "FAQ Helpfulness",  val: "91%",  sub: "+2% this week",       up: true  },
];

const STATUS_STYLES = {
  Open:        "bg-green-100 text-green-700 border-green-200",
  "In Progress":"bg-amber-100 text-amber-700 border-amber-200",
  Resolved:    "bg-blue-100 text-blue-700 border-blue-200",
  Closed:      "bg-gray-100 text-gray-500 border-gray-200",
};

const PRIORITY_STYLES = {
  High:   "bg-red-100 text-red-700 border-red-200",
  Normal: "bg-red-50 text-red-500 border-red-200",
  Low:    "bg-gray-100 text-gray-500 border-gray-200",
  Urgent: "bg-rose-100 text-rose-700 border-rose-200",
};

// ─── TOAST ────────────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl">
      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
      <button onClick={onClose}><X className="w-3 h-3 opacity-70 hover:opacity-100" /></button>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────

function OverviewTab({ showToast, setActiveTab }) {
  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {METRICS.map(m => (
          <div key={m.label} className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
            <div className="text-red-400 text-[11px] mb-1">{m.label}</div>
            <div className="text-red-900 text-xl font-bold">{m.val}</div>
            <div className={`text-[11px] mt-1 ${m.up ? "text-green-600" : "text-red-500"}`}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recent tickets */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <FileText className="w-4 h-4 text-red-500" />Recent Tickets
            </div>
            <button onClick={() => setActiveTab("tickets")} className="text-red-500 text-[11px] hover:text-red-700 flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {ALL_TICKETS.slice(0, 4).map(t => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50/50 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="text-red-900 text-xs font-semibold truncate">{t.subject}</div>
                  <div className="text-red-400 text-[10px]">{t.id} · {t.user}</div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[t.status]}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent status */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-4">
            <Users className="w-4 h-4 text-red-500" />Agent Status
          </div>
          <div className="space-y-2">
            {SUPPORT_AGENTS.map(a => (
              <div key={a.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50/50 transition-all">
                <div className="relative flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full ${a.bg} text-white text-[10px] font-bold flex items-center justify-center`}>{a.initials}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${a.online ? "bg-green-500" : "bg-gray-300"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-red-900 text-xs font-semibold">{a.name}</div>
                  <div className="text-red-400 text-[10px]">{a.open} open · {a.resolved} resolved</div>
                </div>
                <span className={`text-[10px] font-medium ${a.online ? "text-green-600" : "text-gray-400"}`}>{a.online ? "Online" : "Offline"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-4">
          <BarChart2 className="w-4 h-4 text-red-500" />Tickets by Category
        </div>
        <div className="space-y-2.5">
          {CATEGORIES.map(c => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="text-red-600 text-[11px] w-36 truncate flex-shrink-0">{c.label}</span>
              <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.round(c.count / 18 * 100)}%` }} />
              </div>
              <span className="text-red-400 text-[11px] w-5 text-right">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TICKETS TAB ──────────────────────────────────────────────────────────────

function TicketsTab({ showToast }) {
  const [tickets, setTickets]   = useState(ALL_TICKETS);
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [reply, setReply]       = useState("");

  const statuses = ["All", "Open", "In Progress", "Resolved", "Closed"];
  const counts   = statuses.reduce((acc, s) => { acc[s] = s === "All" ? tickets.length : tickets.filter(t => t.status === s).length; return acc; }, {});

  const filtered = tickets.filter(t => {
    const matchS = filter === "All" || t.status === filter;
    const matchQ = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchS && matchQ;
  });

  const setStatus = (id, status) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    showToast("Status updated to " + status);
  };

  const handleReply = () => {
    if (!reply.trim()) { showToast("Please type a reply first"); return; }
    setStatus(selected.id, "In Progress");
    setReply("");
    showToast(`Reply sent to ${selected.user.split(" ")[0]}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* List */}
      <div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
        </div>
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[11px] px-3 py-1 rounded-full border font-medium transition-all ${filter === s ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
              {s} <span className="opacity-70">{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} onClick={() => setSelected(t)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.id === t.id ? "border-red-400 bg-red-50" : "border-red-100 bg-white hover:bg-red-50/50"}`}>
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
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[t.status]}`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-red-400 text-xs">
            <FileText className="w-8 h-8 mb-2 opacity-30" />Select a ticket to view
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-red-100">
              <div>
                <div className="text-[10px] font-mono text-red-400 mb-0.5">{selected.id}</div>
                <div className="text-red-900 text-sm font-bold">{selected.subject}</div>
                <div className="text-red-400 text-xs mt-0.5">{selected.user} · {selected.email}</div>
              </div>
              <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
            </div>
            <div className="space-y-0 mb-4">
              {[
                { k: "Category", v: selected.cat      },
                { k: "Priority", v: selected.priority  },
                { k: "Assignee", v: selected.assignee  },
                { k: "Date",     v: selected.date      },
              ].map(r => (
                <div key={r.k} className="flex justify-between items-center py-1.5 border-b border-red-50 last:border-0">
                  <span className="text-red-400 text-[11px]">{r.k}</span>
                  <span className="text-red-900 text-[11px] font-medium">{r.v}</span>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <div className="text-red-700 text-[11px] font-semibold mb-1.5">Reply to {selected.user.split(" ")[0]}</div>
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3}
                placeholder="Type your reply…"
                className="w-full bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 placeholder-red-300 px-3 py-2 outline-none focus:border-red-400 resize-none" />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-red-300">Sends from support@nfcwriter.com</span>
                <button onClick={handleReply}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
                  <Send className="w-3 h-3" />Send
                </button>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { label: "In Progress", action: () => setStatus(selected.id, "In Progress") },
                { label: "Resolved",    action: () => setStatus(selected.id, "Resolved")    },
                { label: "Close",       action: () => setStatus(selected.id, "Closed")      },
              ].map(a => (
                <button key={a.label} onClick={a.action}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-red-100 bg-white hover:bg-red-50 text-red-700 transition-all">
                  {a.label}
                </button>
              ))}
              <button onClick={() => { setTickets(p => p.filter(t => t.id !== selected.id)); setSelected(null); showToast("Ticket deleted"); }}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-red-100 bg-white hover:bg-red-50 text-red-500 transition-all">
                <Trash2 className="w-3 h-3" />Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── FAQS TAB ─────────────────────────────────────────────────────────────────

function FaqsTab({ showToast }) {
  const [faqs, setFaqs]     = useState(ALL_FAQS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [open, setOpen]     = useState(null);

  const cats     = ["All", ...new Set(ALL_FAQS.map(f => f.cat))];
  const filtered = faqs.filter(f => {
    const matchCat = filter === "All" || f.cat === filter;
    const matchQ   = !search || f.q.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const toggleStatus = (id) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, status: f.status === "published" ? "draft" : "published" } : f));
    showToast("FAQ status updated");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex-1">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
        </div>
        <button onClick={() => showToast("New FAQ form opened")}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-red-200 flex-shrink-0">
          <Plus className="w-3.5 h-3.5" />Add FAQ
        </button>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`text-[11px] px-3 py-1 rounded-full border font-medium transition-all ${filter === c ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(f => (
          <div key={f.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${open === f.id ? "border-red-300 shadow-sm shadow-red-100" : "border-red-100 hover:border-red-200"}`}>
            <div className="flex items-center gap-3 p-3">
              <button onClick={() => setOpen(open === f.id ? null : f.id)} className="flex-1 flex items-start gap-2 text-left min-w-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${open === f.id ? "bg-red-600" : "bg-red-100"}`}>
                  {open === f.id ? <ChevronUp className="w-3 h-3 text-white" /> : <ChevronDown className="w-3 h-3 text-red-500" />}
                </div>
                <span className={`font-semibold text-xs flex-1 ${open === f.id ? "text-red-700" : "text-red-900"}`}>{f.q}</span>
              </button>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-red-400 hidden sm:block">{f.views.toLocaleString()} views</span>
                <span className="text-[10px] text-green-600 font-medium hidden sm:block">{f.helpful}% helpful</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${f.status === "published" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                  {f.status}
                </span>
                <button onClick={() => toggleStatus(f.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  {f.status === "published" ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => showToast("Edit FAQ opened")} className="text-red-400 hover:text-red-600 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setFaqs(p => p.filter(x => x.id !== f.id)); showToast("FAQ deleted"); }} className="text-red-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {open === f.id && (
              <div className="px-4 pb-4 pl-10 border-t border-red-50">
                <p className="text-red-700 text-xs leading-relaxed mt-3">{f.a}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full">{f.cat}</span>
                  <span className="text-[10px] text-green-600 flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{f.helpful}% found helpful</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ARTICLES TAB ─────────────────────────────────────────────────────────────

function ArticlesTab({ showToast }) {
  const [articles, setArticles] = useState(ALL_ARTICLES);

  const toggleStatus = (id) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "published" ? "draft" : "published" } : a));
    showToast("Article status updated");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-red-500 text-xs">{articles.length} articles total · {articles.filter(a => a.status === "published").length} published</div>
        <button onClick={() => showToast("New article editor opened")}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-red-200">
          <Plus className="w-3.5 h-3.5" />New Article
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map(a => (
          <div key={a.id} className="bg-white border border-red-100 rounded-xl p-4 shadow-sm hover:border-red-200 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <a.Icon className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold leading-tight mb-1">{a.title}</div>
                <div className="flex items-center gap-2 text-[10px] text-red-400">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{a.views.toLocaleString()}</span>
                  <span className="bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{a.cat}</span>
                  <span>{a.updated}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-red-50">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${a.status === "published" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                {a.status}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleStatus(a.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  {a.status === "published" ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => showToast("Opening editor…")} className="text-red-400 hover:text-red-600 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => { setArticles(p => p.filter(x => x.id !== a.id)); showToast("Article deleted"); }} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AGENTS TAB ───────────────────────────────────────────────────────────────

function AgentsTab({ showToast }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SUPPORT_AGENTS.map(a => (
        <div key={a.name} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <div className={`w-10 h-10 rounded-full ${a.bg} text-white text-xs font-bold flex items-center justify-center`}>{a.initials}</div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${a.online ? "bg-green-500" : "bg-gray-300"}`} />
            </div>
            <div>
              <div className="text-red-900 text-sm font-semibold">{a.name}</div>
              <div className="text-red-400 text-xs">{a.role}</div>
            </div>
          </div>
          <div className="space-y-1.5 mb-4">
            {[
              { label: "Open tickets",  val: a.open      },
              { label: "Resolved",      val: a.resolved  },
              { label: "CSAT rating",   val: `${a.csat} ★` },
            ].map(s => (
              <div key={s.label} className="flex justify-between text-xs py-1 border-b border-red-50 last:border-0">
                <span className="text-red-400">{s.label}</span>
                <span className="text-red-900 font-semibold">{s.val}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => showToast(`Viewing ${a.name} profile`)}
              className="flex-1 flex items-center justify-center gap-1 text-[11px] py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all">
              <Eye className="w-3 h-3" />Profile
            </button>
            <button onClick={() => showToast("Assigning tickets…")}
              className="flex-1 flex items-center justify-center gap-1 text-[11px] py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all">
              <FileText className="w-3 h-3" />Assign
            </button>
          </div>
        </div>
      ))}
      <div onClick={() => showToast("Invite agent")}
        className="bg-white border border-dashed border-red-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-red-50/50 transition-all min-h-[200px]">
        <UserCheck className="w-7 h-7 text-red-300" />
        <span className="text-red-400 text-xs">Invite agent</span>
      </div>
    </div>
  );
}

// ─── STATUS TAB ───────────────────────────────────────────────────────────────

function StatusTab({ showToast }) {
  const [services, setServices] = useState(STATUS_SERVICES);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <div className="text-amber-800 font-bold text-sm">Partial Degradation Detected</div>
          <div className="text-amber-600 text-xs">Webhook Delivery is experiencing elevated latency.</div>
        </div>
        <button onClick={() => showToast("Status page refreshed")} className="ml-auto text-amber-600 hover:text-amber-800 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-xs min-w-[420px]">
          <thead>
            <tr className="bg-red-50 border-b border-red-100">
              {["Service", "Status", "Uptime (30d)", "Action"].map(h => (
                <th key={h} className="text-left text-red-500 font-semibold px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={s.service} className={`hover:bg-red-50/50 transition-colors ${i < services.length - 1 ? "border-b border-red-50" : ""}`}>
                <td className="px-4 py-3 text-red-900 font-medium">{s.service}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${s.status === "Operational" ? "text-green-700" : "text-amber-700"}`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${s.status === "Operational" ? "bg-green-500" : "bg-amber-500"}`} />
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-red-900 font-bold">{s.uptime}</td>
                <td className="px-4 py-3">
                  <button onClick={() => { setServices(prev => prev.map((x, j) => j === i ? { ...x, status: x.status === "Operational" ? "Degraded" : "Operational" } : x)); showToast("Service status updated"); }}
                    className="text-[11px] px-2.5 py-1 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all">
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <Bell className="w-4 h-4 text-red-500" />Incident Management
          </div>
          <button onClick={() => showToast("New incident reported")}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
            <Plus className="w-3.5 h-3.5" />Report incident
          </button>
        </div>
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <div className="text-amber-800 text-xs font-semibold">Webhook Delivery — Elevated latency</div>
            <div className="text-amber-600 text-[10px]">Started 45 min ago · Investigating · Engineers notified</div>
          </div>
          <button onClick={() => showToast("Incident resolved")} className="ml-auto text-xs text-amber-700 font-semibold hover:text-amber-900 transition-colors flex-shrink-0">Resolve</button>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────

const SETTING_GROUPS = [
  {
    title: "Auto-reply", Icon: RefreshCw,
    items: [
      { label: "Enable auto-reply on weekends",              checked: true  },
      { label: "Send ticket confirmation email on submit",   checked: true  },
      { label: "Auto-close resolved tickets after 7 days",  checked: false },
    ],
  },
  {
    title: "Notifications", Icon: Bell,
    items: [
      { label: "Email alert for new high-priority tickets",  checked: true  },
      { label: "Slack ping for unassigned tickets",          checked: false },
      { label: "Daily support digest to team",               checked: true  },
    ],
  },
  {
    title: "FAQ & Articles", Icon: Book,
    items: [
      { label: "Show helpfulness voting on FAQs",            checked: true  },
      { label: "Allow public article suggestions",           checked: false },
      { label: "Auto-suggest FAQs on ticket submit",         checked: true  },
    ],
  },
];

function SettingsTab({ showToast }) {
  const [groups, setGroups] = useState(SETTING_GROUPS);

  const toggle = (gi, ii) => {
    setGroups(prev => prev.map((g, gIdx) => gIdx !== gi ? g : {
      ...g,
      items: g.items.map((item, iIdx) => iIdx !== ii ? item : { ...item, checked: !item.checked }),
    }));
    showToast("Setting updated");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {groups.map((g, gi) => (
        <div key={g.title} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-4">
            <g.Icon className="w-4 h-4 text-red-500" />{g.title}
          </div>
          {g.items.map((item, ii) => (
            <label key={item.label} className="flex items-center gap-3 py-2.5 border-b border-red-50 last:border-0 cursor-pointer group">
              <input type="checkbox" checked={item.checked} onChange={() => toggle(gi, ii)} className="w-3.5 h-3.5 accent-red-500 flex-shrink-0" />
              <span className="text-red-600 text-xs group-hover:text-red-900 transition-colors">{item.label}</span>
            </label>
          ))}
        </div>
      ))}
      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-4">
          <Clock className="w-4 h-4 text-red-500" />SLA Thresholds
        </div>
        {[
          { label: "First response — High",   val: "2 hours"  },
          { label: "First response — Normal", val: "4 hours"  },
          { label: "Resolution target",       val: "24 hours" },
          { label: "Escalation after",        val: "8 hours"  },
        ].map(s => (
          <div key={s.label} className="flex justify-between items-center py-2.5 border-b border-red-50 last:border-0">
            <span className="text-red-400 text-xs">{s.label}</span>
            <button onClick={() => showToast(`Edit: ${s.label}`)}
              className="flex items-center gap-1 text-red-600 text-xs font-semibold hover:text-red-800 transition-colors">
              {s.val} <Edit3 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button onClick={() => showToast("SLA settings saved")}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
          <Save className="w-3.5 h-3.5" />Save SLA settings
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",  label: "Overview",       Icon: BarChart2       },
  { id: "tickets",   label: "Tickets",        Icon: FileText        },
  { id: "faqs",      label: "FAQs",           Icon: HelpCircle      },
  { id: "articles",  label: "Articles",       Icon: Book            },
  { id: "agents",    label: "Agents",         Icon: Users           },
  { id: "status",    label: "System Status",  Icon: Radio           },
  { id: "settings",  label: "Settings",       Icon: Settings        },
];

export default function HelpSupportPage({ onMenuClick }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast]         = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":  return <OverviewTab  showToast={showToast} setActiveTab={setActiveTab} />;
      case "tickets":   return <TicketsTab   showToast={showToast} />;
      case "faqs":      return <FaqsTab      showToast={showToast} />;
      case "articles":  return <ArticlesTab  showToast={showToast} />;
      case "agents":    return <AgentsTab    showToast={showToast} />;
      case "status":    return <StatusTab    showToast={showToast} />;
      case "settings":  return <SettingsTab  showToast={showToast} />;
      default:          return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} />
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── Admin hero ── */}
        <div className="bg-gradient-to-br from-red-600 to-rose-600 px-4 sm:px-8 py-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg sm:text-xl leading-tight">Help & Support Admin</h1>
                <p className="text-red-100 text-[11px]">Manage tickets, FAQs, articles and agents</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-auto">
              {[{ val: "86", label: "Tickets" }, { val: "91%", label: "CSAT" }, { val: "< 2h", label: "Response" }].map(s => (
                <div key={s.label} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-red-200 flex-shrink-0" />
                  <span className="text-red-100 text-[11px]"><span className="font-bold text-white">{s.val}</span> {s.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <span className="text-red-200 text-xs">Rahul Singh</span>
                <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-bold flex items-center justify-center">RS</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="bg-white border-b border-red-100 flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${activeTab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="px-3 sm:px-5 py-5">
          {renderTab()}
        </div>
      </div>

      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}
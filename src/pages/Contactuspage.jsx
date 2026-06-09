import { useState } from "react";
import {
  Mail, Phone, MapPin, Clock, CheckCircle2, X,
  MessageCircle, Globe, Send, Shield,
  ArrowUpRight, ChevronDown, Users, Star,
  Building, HelpCircle, BarChart2, Settings,
  Inbox, Trash2, Edit3, UserPlus, Power,
  Bot, Bell, FileText, Save, RefreshCw,
  User, Shuffle, PlusCircle, CircleDot,
  CircleCheck, AlertCircle,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const MESSAGES = [
  { id: 1, name: "Priya Mehta",   email: "priya.mehta@gmail.com",  company: "RetailMax",  reason: "Technical Support", msg: "I'm having trouble writing NFC tags using the Android app. The app crashes after the 3rd write operation. I'm on a Samsung S23 running Android 14.", time: "2 min ago",  status: "new",     initials: "PM", color: "bg-red-500"  },
  { id: 2, name: "Aditya Kumar",  email: "aditya.k@techcorp.in",   company: "TechCorp",   reason: "Enterprise Plan",   msg: "We are looking to onboard around 200 users across our facilities. Would love to discuss a custom enterprise pricing plan and dedicated support.", time: "18 min ago", status: "open",    initials: "AK", color: "bg-red-700"  },
  { id: 3, name: "Sunita Rao",    email: "sunita.rao@eventpro.com", company: "EventPro",   reason: "Billing & Payments", msg: "My invoice from last month shows an extra charge of ₹1,200 that I don't recognize. Transaction ID: TXN-20240401-8871.", time: "1 hr ago",   status: "pending", initials: "SR", color: "bg-rose-500" },
  { id: 4, name: "Karan Shah",    email: "karan.shah@startup.io",  company: "StartupXYZ", reason: "Feature Request",   msg: "It would be great if you could add bulk import from CSV for NFC tag profiles. This would save a lot of time for large deployments.", time: "3 hrs ago",  status: "closed",  initials: "KS", color: "bg-red-800"  },
  { id: 5, name: "Meera Pillai",  email: "meera@healthplus.co",    company: "HealthPlus",  reason: "Sales & Pricing",   msg: "Interested in the business plan for our clinic chain (12 locations). Please share pricing and onboarding details.", time: "5 hrs ago",  status: "open",    initials: "MP", color: "bg-red-600"  },
  { id: 6, name: "Rohan Verma",   email: "rohan.v@edutech.in",     company: "EduTech",     reason: "General Inquiry",   msg: "Hi, I wanted to know if your NFC writer supports iOS 17 and if there are any limitations with newer iPhones.", time: "Yesterday",  status: "closed",  initials: "RV", color: "bg-red-900"  },
];

const REASONS_DATA = [
  { label: "Technical Support", count: 18, max: 18 },
  { label: "Enterprise Plan",   count: 14, max: 18 },
  { label: "Billing",           count: 11, max: 18 },
  { label: "Feature Request",   count: 9,  max: 18 },
  { label: "Sales & Pricing",   count: 8,  max: 18 },
  { label: "General Inquiry",   count: 6,  max: 18 },
];

const OFFICES = [
  { city: "Mumbai (HQ)", country: "India", flag: "🇮🇳", addr: "Level 12, One BKC, Bandra Kurla Complex", phone: "+91 22 6789 0000", email: "india@nfcwriter.com", hours: "Mon–Fri 9am–6pm IST", open: true  },
  { city: "New York",    country: "USA",   flag: "🇺🇸", addr: "350 5th Avenue, Suite 4800",               phone: "+1 (212) 555-0100", email: "us@nfcwriter.com",     hours: "Mon–Fri 9am–6pm EST", open: true  },
  { city: "London",      country: "UK",    flag: "🇬🇧", addr: "1 Canada Square, Canary Wharf",            phone: "+44 20 7946 0200",  email: "uk@nfcwriter.com",     hours: "Mon–Fri 9am–5pm GMT", open: false },
];

const TEAM = [
  { name: "Arjun Sharma", role: "Support Lead",     initials: "AS", bg: "bg-red-600",  msgs: 34, resolved: 28, rating: "4.9" },
  { name: "Priya Mehta",  role: "Technical Expert", initials: "PM", bg: "bg-rose-600", msgs: 27, resolved: 25, rating: "5.0" },
  { name: "Rohan Das",    role: "Sales Manager",    initials: "RD", bg: "bg-red-700",  msgs: 19, resolved: 17, rating: "4.8" },
  { name: "Neha Gupta",   role: "Account Manager",  initials: "NG", bg: "bg-red-800",  msgs: 22, resolved: 20, rating: "4.7" },
];

const METRICS = [
  { label: "Total Messages", val: "86",   sub: "+12 today",          up: true  },
  { label: "Open",           val: "23",   sub: "4 urgent",           up: false },
  { label: "Avg Response",   val: "1.8h", sub: "−0.3h vs yesterday", up: true  },
  { label: "Resolved Today", val: "31",   sub: "↑ 8 from yesterday", up: true  },
  { label: "CSAT Score",     val: "4.9",  sub: "from 48 ratings",    up: true  },
  { label: "Newsletter Subs",val: "1,204",sub: "+18 this week",      up: true  },
];

const RESPONSE_DIST = [
  { label: "< 1 hour",   pct: 42, color: "bg-green-500"  },
  { label: "1–4 hours",  pct: 33, color: "bg-red-500"    },
  { label: "4–12 hours", pct: 18, color: "bg-amber-500"  },
  { label: "> 12 hours", pct: 7,  color: "bg-gray-400"   },
];

const STATUS_STYLES = {
  new:     "bg-red-100 text-red-600 border border-red-200",
  open:    "bg-amber-100 text-amber-700 border border-amber-200",
  pending: "bg-gray-100 text-gray-600 border border-gray-200",
  closed:  "bg-green-100 text-green-700 border border-green-200",
};

// ─── TOAST ─────────────────────────────────────────────────────────────────────

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

// ─── MESSAGES TAB ──────────────────────────────────────────────────────────────

function MessagesTab({ showToast }) {
  const [messages, setMessages] = useState(MESSAGES);
  const [selected, setSelected] = useState(MESSAGES[0]);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [reply, setReply]       = useState("");

  const counts = ["all","new","open","pending","closed"].reduce((acc, s) => {
    acc[s] = s === "all" ? messages.length : messages.filter(m => m.status === s).length;
    return acc;
  }, {});

  const filtered = messages.filter(m => {
    const matchStatus = filter === "all" || m.status === filter;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.reason.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const setStatus = (id, status) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    showToast("Status updated to " + status);
  };

  const handleReply = () => {
    if (!reply.trim()) { showToast("Please type a reply first"); return; }
    setStatus(selected.id, "open");
    setReply("");
    showToast(`Reply sent to ${selected.name.split(" ")[0]}`);
  };

  const handleDelete = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
    showToast("Message deleted");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left: list */}
      <div>
        {/* Search */}
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {["all","new","open","pending","closed"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[11px] px-3 py-1 rounded-full border font-medium transition-all ${filter === s ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
              {s} <span className="opacity-70">{counts[s]}</span>
            </button>
          ))}
        </div>

        {/* Message list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-red-400 text-xs">
              <Inbox className="w-7 h-7 mx-auto mb-2 opacity-40" />No messages found
            </div>
          ) : filtered.map(m => (
            <div key={m.id} onClick={() => setSelected(m)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.id === m.id ? "border-red-400 bg-red-50" : "border-red-100 bg-white hover:bg-red-50/50"}`}>
              <div className={`w-8 h-8 rounded-full ${m.color} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>{m.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-red-900 text-xs font-semibold">{m.name}</span>
                  <span className="text-red-400 text-[10px]">{m.company}</span>
                </div>
                <div className="text-red-400 text-[11px] truncate mt-0.5">{m.reason} — {m.msg}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-[10px] text-red-300">{m.time}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[m.status]}`}>{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: detail */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-red-400 text-xs">
            <MessageCircle className="w-8 h-8 mb-2 opacity-30" />Select a message
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${selected.color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{selected.initials}</div>
                <div>
                  <div className="text-red-900 text-sm font-semibold">{selected.name}</div>
                  <div className="text-red-400 text-xs">{selected.email}</div>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
            </div>

            {/* Message */}
            <div className="bg-red-50 rounded-xl p-3 text-red-800 text-xs leading-relaxed mb-4">{selected.msg}</div>

            {/* Meta */}
            <div className="space-y-0 mb-4">
              {[
                { k: "Company",   v: selected.company },
                { k: "Topic",     v: selected.reason  },
                { k: "Received",  v: selected.time    },
                { k: "Newsletter",v: "Subscribed"     },
              ].map(r => (
                <div key={r.k} className="flex justify-between items-center py-1.5 border-b border-red-50 last:border-0">
                  <span className="text-red-400 text-[11px]">{r.k}</span>
                  <span className="text-red-900 text-[11px] font-medium">{r.v}</span>
                </div>
              ))}
            </div>

            {/* Reply */}
            <div className="mb-3">
              <div className="text-red-700 text-[11px] font-semibold mb-1.5">Reply to {selected.name.split(" ")[0]}</div>
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Type your reply…"
                className="w-full bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 placeholder-red-300 px-3 py-2 outline-none focus:border-red-400 resize-none" />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-red-300">Sends from support@nfcwriter.com</span>
                <button onClick={handleReply}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
                  <Send className="w-3 h-3" />Send
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { label: "Mark open",    icon: CircleDot,    action: () => setStatus(selected.id, "open"),    cls: "" },
                { label: "Mark closed",  icon: CircleCheck,  action: () => setStatus(selected.id, "closed"),  cls: "" },
                { label: "Pending",      icon: Clock,        action: () => setStatus(selected.id, "pending"), cls: "" },
                { label: "Delete",       icon: Trash2,       action: () => handleDelete(selected.id),         cls: "border-red-200 text-red-500" },
              ].map(a => (
                <button key={a.label} onClick={a.action}
                  className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-red-100 bg-white hover:bg-red-50 text-red-700 transition-all ${a.cls}`}>
                  <a.icon className="w-3 h-3" />{a.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ANALYTICS TAB ─────────────────────────────────────────────────────────────

function AnalyticsTab() {
  return (
    <div className="space-y-4">
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
        {/* By topic */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-900 font-semibold text-sm mb-4">
            <BarChart2 className="w-4 h-4 text-red-500" />Messages by topic
          </div>
          <div className="space-y-2.5">
            {REASONS_DATA.map(r => (
              <div key={r.label} className="flex items-center gap-2">
                <span className="text-red-600 text-[11px] w-28 truncate flex-shrink-0">{r.label}</span>
                <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${Math.round(r.count / r.max * 100)}%` }} />
                </div>
                <span className="text-red-400 text-[11px] w-5 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response time */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-900 font-semibold text-sm mb-4">
            <Clock className="w-4 h-4 text-red-500" />Response time
          </div>
          <div className="space-y-2.5 mb-4">
            {RESPONSE_DIST.map(r => (
              <div key={r.label} className="flex items-center gap-2">
                <span className="text-red-600 text-[11px] w-20 flex-shrink-0">{r.label}</span>
                <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-red-400 text-[11px] w-8 text-right">{r.pct}%</span>
              </div>
            ))}
          </div>
          <div className="border-t border-red-100 pt-3 space-y-1.5">
            {[
              { label: "Newsletter subscribers", val: "1,204" },
              { label: "Avg. CSAT",              val: "4.9 / 5" },
              { label: "Countries reached",      val: "38" },
            ].map(s => (
              <div key={s.label} className="flex justify-between text-xs">
                <span className="text-red-400">{s.label}</span>
                <span className="text-red-900 font-semibold">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADD OFFICE MODAL ──────────────────────────────────────────────────────────

function AddOfficeModal({ onClose, onSave }) {
  const [form, setForm]     = useState({ city: "", country: "", flag: "🏢", addr: "", phone: "", email: "", hours: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = (err) => `w-full bg-red-50 border ${err ? "border-red-400" : "border-red-200"} text-red-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors`;
  const lbl = "text-red-700 text-[11px] font-semibold block mb-1";

  const FLAGS = ["🇮🇳","🇺🇸","🇬🇧","🇦🇺","🇸🇬","🇦🇪","🇩🇪","🇫🇷","🇯🇵","🇨🇦","🏢"];

  const handleSave = () => {
    const e = {};
    if (!form.city.trim())    e.city    = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.addr.trim())    e.addr    = "Required";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({ ...form, open: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-red-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
              <Building className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-red-900 font-bold text-sm">Add New Office</span>
          </div>
          <button onClick={onClose} className="text-red-300 hover:text-red-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {/* Flag picker */}
          <div>
            <label className={lbl}>Country Flag</label>
            <div className="flex gap-1.5 flex-wrap">
              {FLAGS.map(f => (
                <button key={f} onClick={() => set("flag", f)}
                  className={`w-8 h-8 rounded-lg border text-base flex items-center justify-center transition-all ${form.flag === f ? "border-red-500 bg-red-50" : "border-red-200 hover:border-red-400"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>City / Office Name *</label>
              <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Dubai" className={inp(errors.city)} />
              {errors.city && <p className="text-red-500 text-[10px] mt-0.5">{errors.city}</p>}
            </div>
            <div>
              <label className={lbl}>Country *</label>
              <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="e.g. UAE" className={inp(errors.country)} />
              {errors.country && <p className="text-red-500 text-[10px] mt-0.5">{errors.country}</p>}
            </div>
          </div>
          <div>
            <label className={lbl}>Address *</label>
            <input value={form.addr} onChange={e => set("addr", e.target.value)} placeholder="Street, Building, City" className={inp(errors.addr)} />
            {errors.addr && <p className="text-red-500 text-[10px] mt-0.5">{errors.addr}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Phone</label>
              <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+971 4 000 0000" className={inp(false)} />
            </div>
            <div>
              <label className={lbl}>Email</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="dubai@nfcwriter.com" className={inp(false)} />
            </div>
          </div>
          <div>
            <label className={lbl}>Business Hours</label>
            <input value={form.hours} onChange={e => set("hours", e.target.value)} placeholder="e.g. Mon–Fri 9am–6pm GST" className={inp(false)} />
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 text-xs font-semibold py-2.5 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
            <PlusCircle className="w-3.5 h-3.5" />Add Office
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OFFICES TAB ───────────────────────────────────────────────────────────────

function OfficesTab({ showToast }) {
  const [offices, setOffices]     = useState(OFFICES);
  const [showModal, setShowModal] = useState(false);

  const toggle = (i) => {
    setOffices(prev => prev.map((o, idx) => idx === i ? { ...o, open: !o.open } : o));
    showToast("Office status updated");
  };

  const handleSave = (form) => {
    setOffices(prev => [...prev, form]);
    setShowModal(false);
    showToast(`${form.city} office added`);
  };

  return (
    <>
      {showModal && <AddOfficeModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {offices.map((o, i) => (
          <div key={o.city + i} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{o.flag}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${o.open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {o.open ? "Open" : "Closed"}
              </span>
            </div>
            <div className="text-red-900 font-bold text-sm mb-0.5">{o.city}</div>
            <div className="text-red-400 text-xs mb-3">{o.country}</div>
            <div className="space-y-2">
              {[
                { Icon: MapPin, v: o.addr  },
                { Icon: Phone,  v: o.phone },
                { Icon: Mail,   v: o.email },
                { Icon: Clock,  v: o.hours },
              ].map((r, j) => (
                <div key={j} className="flex items-start gap-2">
                  <r.Icon className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-red-600 text-[11px] leading-snug">{r.v || "—"}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => showToast(`Editing ${o.city}…`)}
                className="flex-1 flex items-center justify-center gap-1 text-[11px] py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all">
                <Edit3 className="w-3 h-3" />Edit
              </button>
              <button onClick={() => toggle(i)}
                className={`flex-1 flex items-center justify-center gap-1 text-[11px] py-1.5 border rounded-lg transition-all ${o.open ? "border-red-200 text-red-500 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
                <Power className="w-3 h-3" />{o.open ? "Close" : "Open"}
              </button>
            </div>
          </div>
        ))}

        {/* Add office */}
        <div onClick={() => setShowModal(true)}
          className="bg-white border border-dashed border-red-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-red-50/50 transition-all min-h-[200px]">
          <PlusCircle className="w-7 h-7 text-red-300" />
          <span className="text-red-400 text-xs">Add office</span>
        </div>
      </div>
    </>
  );
}

// ─── INVITE MEMBER MODAL ───────────────────────────────────────────────────────

function InviteMemberModal({ onClose, onSave }) {
  const [form, setForm]     = useState({ name: "", email: "", role: "Support Lead", phone: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = (err) => `w-full bg-red-50 border ${err ? "border-red-400" : "border-red-200"} text-red-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors`;
  const lbl = "text-red-700 text-[11px] font-semibold block mb-1";

  const handleSave = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-red-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-red-900 font-bold text-sm">Invite Team Member</span>
          </div>
          <button onClick={onClose} className="text-red-300 hover:text-red-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className={lbl}>Full Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Arjun Sharma" className={inp(errors.name)} />
            {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
          </div>
          <div>
            <label className={lbl}>Email Address *</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="arjun@nfcwriter.com" className={inp(errors.email)} />
            {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
          </div>
          <div>
            <label className={lbl}>Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inp(false)} />
          </div>
          <div>
            <label className={lbl}>Role</label>
            <div className="relative">
              <select value={form.role} onChange={e => set("role", e.target.value)} className={`${inp(false)} pr-8 appearance-none cursor-pointer`}>
                {["Support Lead","Technical Expert","Sales Manager","Account Manager","Billing Expert","API Specialist"].map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 text-xs font-semibold py-2.5 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
            <UserPlus className="w-3.5 h-3.5" />Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TEAM TAB ──────────────────────────────────────────────────────────────────

function TeamTab({ showToast }) {
  const [team, setTeam]           = useState(TEAM);
  const [showModal, setShowModal] = useState(false);

  const BG_COLORS = ["bg-red-600","bg-rose-600","bg-red-700","bg-red-800","bg-rose-700","bg-red-500"];

  const handleSave = (form) => {
    const initials = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const bg = BG_COLORS[team.length % BG_COLORS.length];
    setTeam(prev => [...prev, { name: form.name, role: form.role, initials, bg, msgs: 0, resolved: 0, rating: "—" }]);
    setShowModal(false);
    showToast(`Invite sent to ${form.name.split(" ")[0]}`);
  };

  return (
    <>
      {showModal && <InviteMemberModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map(m => (
          <div key={m.name} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full ${m.bg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{m.initials}</div>
              <div>
                <div className="text-red-900 text-sm font-semibold">{m.name}</div>
                <div className="text-red-400 text-xs">{m.role}</div>
              </div>
            </div>
            <div className="space-y-1.5 mb-4">
              {[
                { label: "Messages handled", val: m.msgs      },
                { label: "Resolved",          val: m.resolved  },
                { label: "CSAT rating",       val: `${m.rating} ★` },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-xs py-1 border-b border-red-50 last:border-0">
                  <span className="text-red-400">{s.label}</span>
                  <span className="text-red-900 font-semibold">{s.val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast(`Viewing ${m.name} profile`)}
                className="flex-1 flex items-center justify-center gap-1 text-[11px] py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all">
                <User className="w-3 h-3" />Profile
              </button>
              <button onClick={() => showToast("Assigning messages…")}
                className="flex-1 flex items-center justify-center gap-1 text-[11px] py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all">
                <Shuffle className="w-3 h-3" />Assign
              </button>
            </div>
          </div>
        ))}

        {/* Invite member */}
        <div onClick={() => setShowModal(true)}
          className="bg-white border border-dashed border-red-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-red-50/50 transition-all min-h-[200px]">
          <UserPlus className="w-7 h-7 text-red-300" />
          <span className="text-red-400 text-xs">Invite member</span>
        </div>
      </div>
    </>
  );
}

// ─── SETTINGS TAB ──────────────────────────────────────────────────────────────

const SETTING_GROUPS = [
  {
    title: "Auto-reply", Icon: RefreshCw,
    items: [
      { label: "Enable auto-reply on weekends",          checked: true  },
      { label: "Send confirmation email on submit",      checked: true  },
      { label: "Auto-close after 7 days of inactivity", checked: false },
    ],
  },
  {
    title: "Notifications", Icon: Bell,
    items: [
      { label: "Email alert for new messages",  checked: true  },
      { label: "Slack ping for urgent topics",  checked: false },
      { label: "Daily digest summary",          checked: true  },
    ],
  },
  {
    title: "Form settings", Icon: FileText,
    items: [
      { label: "Require company field",    checked: false },
      { label: "Show newsletter checkbox", checked: true  },
      { label: "Enable file attachments",  checked: false },
    ],
  },
];

const SLA = [
  { label: "First response target", val: "2 hours"  },
  { label: "Resolution target",     val: "24 hours" },
  { label: "Escalation after",      val: "8 hours"  },
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
          <div className="flex items-center gap-2 text-red-900 font-semibold text-sm mb-4">
            <g.Icon className="w-4 h-4 text-red-500" />{g.title}
          </div>
          <div className="space-y-0">
            {g.items.map((item, ii) => (
              <label key={item.label}
                className="flex items-center gap-3 py-2.5 border-b border-red-50 last:border-0 cursor-pointer group">
                <input type="checkbox" checked={item.checked} onChange={() => toggle(gi, ii)}
                  className="w-3.5 h-3.5 accent-red-500 flex-shrink-0" />
                <span className="text-red-600 text-xs group-hover:text-red-900 transition-colors">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* SLA */}
      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-red-900 font-semibold text-sm mb-4">
          <Clock className="w-4 h-4 text-red-500" />SLA thresholds
        </div>
        <div className="space-y-0">
          {SLA.map(s => (
            <div key={s.label} className="flex justify-between items-center py-2.5 border-b border-red-50 last:border-0">
              <span className="text-red-400 text-xs">{s.label}</span>
              <button onClick={() => showToast(`Edit SLA: ${s.label}`)}
                className="flex items-center gap-1 text-red-600 text-xs font-semibold hover:text-red-800 transition-colors">
                {s.val} <Edit3 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
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
  { id: "messages",  label: "Messages",  Icon: Inbox     },
  { id: "analytics", label: "Analytics", Icon: BarChart2 },
  { id: "offices",   label: "Offices",   Icon: Building  },
  { id: "team",      label: "Team",      Icon: Users     },
  { id: "settings",  label: "Settings",  Icon: Settings  },
];

export default function ContactUsPage({ onMenuClick }) {
  const [activeTab, setActiveTab] = useState("messages");
  const [toast, setToast]         = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "messages":  return <MessagesTab  showToast={showToast} />;
      case "analytics": return <AnalyticsTab />;
      case "offices":   return <OfficesTab   showToast={showToast} />;
      case "team":      return <TeamTab      showToast={showToast} />;
      case "settings":  return <SettingsTab  showToast={showToast} />;
      default:          return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── Admin topbar ── */}
        <div className="bg-white border-b border-red-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-red-900 font-bold text-sm">Contact Admin</span>
            <span className="text-[10px] bg-red-600 text-white font-semibold px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-xs hidden sm:block">Rahul Singh</span>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">RS</div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="bg-white border-b border-red-100 flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-red-400 hover:text-red-700"
              }`}>
              <t.Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="p-3 sm:p-5">
          {renderTab()}
        </div>
      </div>

      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}
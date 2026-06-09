import { useState, useRef } from "react";
import {
  Shield, Users, Settings, Bell, Lock, Globe, Key,
  Trash2, Edit3, Plus, CheckCircle2, X, AlertTriangle,
  ChevronDown, Save, Eye, EyeOff, RefreshCw, Download,
  Upload, Mail, Phone, Monitor, Smartphone, Power,
  ToggleLeft, ToggleRight, UserPlus, Crown, Zap,
  Database, Activity, Clock, Search, Filter,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const ALL_USERS = [
  { id: 1,  name: "Rahul Singh",    email: "rahul@nfcwriter.com",  role: "Super Admin", status: "active",   last: "Just now",     avatar: "RS", bg: "bg-red-600",  plan: "Enterprise" },
  { id: 2,  name: "Arjun Sharma",   email: "arjun@nfcwriter.com",  role: "Admin",       status: "active",   last: "2 min ago",    avatar: "AS", bg: "bg-rose-600", plan: "Premium"    },
  { id: 3,  name: "Priya Mehta",    email: "priya@nfcwriter.com",  role: "Support",     status: "active",   last: "15 min ago",   avatar: "PM", bg: "bg-red-700",  plan: "Premium"    },
  { id: 4,  name: "Rohan Das",      email: "rohan@nfcwriter.com",  role: "Support",     status: "inactive", last: "2 days ago",   avatar: "RD", bg: "bg-red-800",  plan: "Basic"      },
  { id: 5,  name: "Neha Gupta",     email: "neha@nfcwriter.com",   role: "Analyst",     status: "active",   last: "1 hr ago",     avatar: "NG", bg: "bg-rose-700", plan: "Premium"    },
  { id: 6,  name: "Vikram Iyer",    email: "vikram@nfcwriter.com", role: "Developer",   status: "active",   last: "30 min ago",   avatar: "VI", bg: "bg-red-900",  plan: "Enterprise" },
];

const AUDIT_LOGS = [
  { id: 1,  user: "Rahul Singh",  action: "Updated system email settings",       time: "2 min ago",   type: "settings" },
  { id: 2,  user: "Arjun Sharma", action: "Added new admin user: Vikram Iyer",   time: "1 hr ago",    type: "user"     },
  { id: 3,  user: "Priya Mehta",  action: "Disabled 2FA requirement for Rohan",  time: "3 hrs ago",   type: "security" },
  { id: 4,  user: "Rahul Singh",  action: "Changed plan limits for Premium tier", time: "Yesterday",   type: "billing"  },
  { id: 5,  user: "Neha Gupta",   action: "Exported user analytics report",      time: "Yesterday",   type: "data"     },
  { id: 6,  user: "Vikram Iyer",  action: "Rotated API master key",              time: "2 days ago",  type: "security" },
  { id: 7,  user: "Rahul Singh",  action: "Updated notification templates",       time: "3 days ago",  type: "settings" },
];

const LOG_TYPE_STYLES = {
  settings: "bg-red-100 text-red-600",
  user:     "bg-blue-100 text-blue-600",
  security: "bg-amber-100 text-amber-700",
  billing:  "bg-purple-100 text-purple-700",
  data:     "bg-green-100 text-green-700",
};

const ROLES = ["Super Admin", "Admin", "Support", "Analyst", "Developer"];

const PLAN_LIMITS = [
  { plan: "Free",       credits: "500",    cards: "5",   api: false, bulk: false },
  { plan: "Basic",      credits: "3,000",  cards: "25",  api: false, bulk: false },
  { plan: "Premium",    credits: "15,000", cards: "100", api: true,  bulk: true  },
  { plan: "Enterprise", credits: "Custom", cards: "∞",   api: true,  bulk: true  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type] || s.info}`}>
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : type === "error" ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100" /></button>
    </div>
  );
}

// ─── INVITE MODAL ─────────────────────────────────────────────────────────────

function InviteModal({ onClose, onSave }) {
  const [form, setForm]     = useState({ name: "", email: "", role: "Support", phone: "" });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = (err) => `w-full bg-red-50 border ${err ? "border-red-500" : "border-red-200"} text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors`;

  const handleSave = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-red-900 font-bold text-base flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-red-500" />Invite Admin User
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Full Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Arjun Sharma" className={inp(errors.name)} />
            {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Email Address *</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="arjun@nfcwriter.com" className={inp(errors.email)} />
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inp(false)} />
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Role</label>
            <div className="relative">
              <select value={form.role} onChange={e => set("role", e.target.value)}
                className="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 pr-8 rounded-lg focus:outline-none focus:border-red-500 appearance-none cursor-pointer">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
          <button onClick={handleSave} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COL 1: USER MANAGEMENT ───────────────────────────────────────────────────

function UserManagement({ showToast }) {
  const [users, setUsers]         = useState(ALL_USERS);
  const [search, setSearch]       = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
    showToast("User status updated.", "info");
  };

  const changeRole = (id, role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    showToast("Role updated successfully!");
  };

  const handleInvite = (form) => {
    const initials = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const bgs = ["bg-red-600","bg-rose-600","bg-red-700","bg-red-800"];
    setUsers(prev => [...prev, { id: Date.now(), name: form.name, email: form.email, role: form.role, status: "active", last: "Just invited", avatar: initials, bg: bgs[prev.length % bgs.length], plan: "Basic" }]);
    setShowInvite(false);
    showToast(`Invite sent to ${form.name.split(" ")[0]}!`);
  };

  return (
    <>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onSave={handleInvite} />}
      <div className="space-y-4">
        {/* Search + invite */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex-1">
            <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
              className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
          </div>
          <button onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-md shadow-red-200 flex-shrink-0">
            <UserPlus className="w-3.5 h-3.5" />Invite
          </button>
        </div>

        {/* User list */}
        <div className="space-y-2">
          {filtered.map(u => (
            <div key={u.id} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 hover:bg-red-50/80 transition-colors">
              <div className={`w-8 h-8 rounded-full ${u.bg} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>{u.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold truncate">{u.name}</div>
                <div className="text-red-400 text-[10px] truncate">{u.email}</div>
                <div className="text-red-300 text-[10px]">{u.last}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {/* Role select */}
                <div className="relative">
                  <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                    className="text-[10px] bg-white border border-red-200 text-red-700 font-semibold px-2 py-0.5 pr-5 rounded-full appearance-none cursor-pointer focus:outline-none">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-red-400 pointer-events-none" />
                </div>
                {/* Status toggle */}
                <button onClick={() => toggleStatus(u.id)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${u.status === "active" ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}>
                  {u.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-red-100">
          {[
            { label: "Total",    val: users.length                                   },
            { label: "Active",   val: users.filter(u => u.status === "active").length },
            { label: "Admins",   val: users.filter(u => u.role === "Admin" || u.role === "Super Admin").length },
          ].map(s => (
            <div key={s.label} className="text-center bg-red-50 rounded-lg py-2">
              <div className="text-red-900 font-bold text-lg">{s.val}</div>
              <div className="text-red-400 text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── COL 2: SECURITY & SYSTEM ─────────────────────────────────────────────────

function SecuritySystem({ showToast }) {
  const [twoFARequired,  setTwoFARequired]  = useState(true);
  const [maintenanceMode,setMaintenanceMode] = useState(false);
  const [registrations,  setRegistrations]  = useState(true);
  const [apiEnabled,     setApiEnabled]     = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [showKey, setShowKey]               = useState(false);
  const masterKey = "sk_live_nfc_••••••••••••••••••••••••••••••••";

  return (
    <div className="space-y-4">

      {/* Access controls */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-500" />Access Controls
        </h3>
        <div className="space-y-3">
          {[
            { label: "Require 2FA for all admins",   val: twoFARequired,   set: (v) => { setTwoFARequired(v);   showToast(v ? "2FA required for all admins." : "2FA requirement disabled.", v ? "success" : "info"); } },
            { label: "Allow new user registrations", val: registrations,   set: (v) => { setRegistrations(v);   showToast(v ? "Registrations enabled." : "Registrations disabled.", v ? "success" : "info"); } },
            { label: "API access enabled",           val: apiEnabled,      set: (v) => { setApiEnabled(v);      showToast(v ? "API access enabled." : "API access disabled.", v ? "success" : "error"); } },
            { label: "Maintenance mode",             val: maintenanceMode, set: (v) => { setMaintenanceMode(v); showToast(v ? "⚠️ Maintenance mode ON." : "Maintenance mode OFF.", v ? "error" : "success"); } },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-red-700 text-sm flex-1">{item.label}</span>
              <Toggle checked={item.val} onChange={item.set} />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-red-500" />Session & Login
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Session timeout (minutes)</label>
            <div className="relative">
              <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                className="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 pr-8 rounded-lg focus:outline-none focus:border-red-500 appearance-none cursor-pointer">
                {["15","30","60","120","240"].map(v => <option key={v}>{v}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Max login attempts before lockout</label>
            <div className="relative">
              <select value={maxLoginAttempts} onChange={e => setMaxLoginAttempts(e.target.value)}
                className="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 pr-8 rounded-lg focus:outline-none focus:border-red-500 appearance-none cursor-pointer">
                {["3","5","10"].map(v => <option key={v}>{v}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Master API key */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-red-500" />Master API Key
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-2">
            <code className="text-red-700 text-[11px] flex-1 truncate font-mono">
              {showKey ? "sk_live_nfc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" : masterKey}
            </code>
            <button onClick={() => setShowKey(s => !s)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button onClick={() => showToast("Master API key rotated! Update all integrations.", "error")}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
          <RefreshCw className="w-3.5 h-3.5" />Rotate Master Key
        </button>
      </div>

      <button onClick={() => showToast("Security settings saved!")}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
        <Save className="w-4 h-4" />Save Security Settings
      </button>
    </div>
  );
}

// ─── COL 3: PLAN LIMITS + AUDIT LOG ───────────────────────────────────────────

function PlanLimitsAudit({ showToast }) {
  const [logs, setLogs]     = useState(AUDIT_LOGS);
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(l =>
    !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">

      {/* Plan limits */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-red-500" />Plan Limits
        </h3>
        <div className="space-y-2">
          {PLAN_LIMITS.map(p => (
            <div key={p.plan} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold">{p.plan}</div>
                <div className="text-red-400 text-[10px]">{p.credits} credits · {p.cards} cards</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.api ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>API</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.bulk ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>Bulk</span>
                <button onClick={() => showToast(`Editing ${p.plan} plan limits…`, "info")}
                  className="text-red-400 hover:text-red-600 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System stats */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-500" />System Stats
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Total Users",    val: "50,241" },
            { label: "Active Today",   val: "3,812"  },
            { label: "NFC Writes",     val: "2.4M"   },
            { label: "API Calls Today",val: "142K"   },
          ].map(s => (
            <div key={s.label} className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              <div className="text-red-900 font-bold text-base">{s.val}</div>
              <div className="text-red-400 text-[10px] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit log */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" />Audit Log
        </h3>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {filteredLogs.map(l => (
            <div key={l.id} className="flex items-start gap-2.5 p-2.5 bg-red-50/60 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${LOG_TYPE_STYLES[l.type]}`}>{l.type}</span>
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
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "users",    label: "User Management", Icon: Users    },
  { id: "security", label: "Security",        Icon: Shield   },
  { id: "system",   label: "Plan & Logs",     Icon: Activity },
];

export default function SettingsAdminPage({ onMenuClick }) {
  const [tab,   setTab]   = useState("users");
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "" }), 3000);
  };

  const inputCls = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Admin Settings</h1>
            <p className="text-red-400 text-xs hidden sm:block">Manage users, security and system configuration</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="text-red-400 text-xs">Rahul Singh</span>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">RS</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* 3-col grid — exact SettingsPage pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Col 1: User Management */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "users" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-red-600" />
              </div>
              <h2 className="text-red-900 font-bold text-base">User Management</h2>
            </div>
            <UserManagement showToast={showToast} />
          </div>

          {/* Col 2: Security & System */}
          <div className={`space-y-4 transition-opacity ${tab !== "security" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-red-900 font-bold text-base">Security & System</h2>
              </div>
              <SecuritySystem showToast={showToast} />
            </div>
          </div>

          {/* Col 3: Plan Limits + Audit */}
          <div className={`space-y-4 transition-opacity ${tab !== "system" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-red-900 font-bold text-base">Plan & Audit Log</h2>
              </div>
              <PlanLimitsAudit showToast={showToast} />
            </div>
          </div>

        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "" })} />
    </div>
  );
}
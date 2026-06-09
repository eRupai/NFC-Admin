import { useState, useRef } from "react";
import {
  Settings, Shield, Bell, Users, Globe, Key, Save,
  Eye, EyeOff, RefreshCw, Download, Upload, CheckCircle2,
  AlertTriangle, X, ChevronDown, Lock, Unlock, Power,
  Mail, Phone, Clock, Database, Activity, Edit3,
  ToggleLeft, ToggleRight, Plus, Trash2, Copy,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TIMEZONES = ["(UTC+05:30) Chennai, Mumbai","(UTC+00:00) London","(UTC-05:00) Eastern","(UTC-08:00) Pacific","(UTC+08:00) Singapore"];
const LANGUAGES = ["English (US)","English (UK)","Hindi","German","French","Japanese","Spanish"];

const SETTING_GROUPS = [
  {
    title:"Auto-reply & Responses", Icon: RefreshCw,
    items:[
      { key:"autoReply",       label:"Enable auto-reply on weekends",          checked:true  },
      { key:"confirmEmail",    label:"Send confirmation email on form submit",  checked:true  },
      { key:"autoClose",       label:"Auto-close inactive tickets after 7 days",checked:false },
      { key:"smartSuggestions",label:"AI-powered reply suggestions",           checked:true  },
    ],
  },
  {
    title:"Notifications & Alerts", Icon: Bell,
    items:[
      { key:"emailNewTicket",  label:"Email alert for new support tickets",    checked:true  },
      { key:"slackPing",       label:"Slack ping for urgent/high priority",    checked:false },
      { key:"dailyDigest",     label:"Daily summary digest to admin team",     checked:true  },
      { key:"securityAlerts",  label:"Security alerts (login anomalies)",      checked:true  },
    ],
  },
  {
    title:"Forms & Data Collection", Icon: Database,
    items:[
      { key:"requireCompany",  label:"Require company field in contact form",  checked:false },
      { key:"newsletter",      label:"Show newsletter subscribe checkbox",      checked:true  },
      { key:"fileAttachments", label:"Allow file attachments in tickets",      checked:false },
      { key:"captcha",         label:"Enable CAPTCHA on public forms",         checked:true  },
    ],
  },
];

const SLA_ITEMS = [
  { label:"First response — Urgent",  val:"30 min"  },
  { label:"First response — High",    val:"2 hours" },
  { label:"First response — Normal",  val:"4 hours" },
  { label:"Resolution target",        val:"24 hours"},
  { label:"Escalation after",         val:"8 hours" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-red-600" : "bg-red-100 border border-red-200"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s = { success:"bg-red-600 border-red-400 text-white", error:"bg-red-800 border-red-600 text-white", info:"bg-rose-600 border-rose-400 text-white" };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type]||s.info}`}>
      {type==="error"?<AlertTriangle className="w-4 h-4"/>:<CheckCircle2 className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── GENERAL PANEL ────────────────────────────────────────────────────────────

function GeneralPanel({ showToast }) {
  const [site,     setSite]     = useState("NFC Writer");
  const [tagline,  setTagline]  = useState("Tap. Write. Connect.");
  const [email,    setEmail]    = useState("admin@nfcwriter.com");
  const [phone,    setPhone]    = useState("+91 22 6789 0000");
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const inp = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";
  const sel = `${inp} pr-8 appearance-none cursor-pointer`;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Site Name</label>
          <input value={site} onChange={e=>setSite(e.target.value)} className={inp}/>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Tagline</label>
          <input value={tagline} onChange={e=>setTagline(e.target.value)} className={inp}/>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Admin Email</label>
          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className={`${inp} pl-8`}/></div>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Support Phone</label>
          <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400"/><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className={`${inp} pl-8`}/></div>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Timezone</label>
          <div className="relative"><select value={timezone} onChange={e=>setTimezone(e.target.value)} className={sel}>{TIMEZONES.map(t=><option key={t}>{t}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/></div>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Language</label>
          <div className="relative"><select value={language} onChange={e=>setLanguage(e.target.value)} className={sel}>{LANGUAGES.map(l=><option key={l}>{l}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/></div>
        </div>
      </div>
      <button onClick={()=>showToast("General settings saved!")}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
        <Save className="w-4 h-4"/>Save General Settings
      </button>
    </div>
  );
}

// ─── SECURITY PANEL ───────────────────────────────────────────────────────────

function SecurityPanel({ showToast }) {
  const [twoFA,        setTwoFA]        = useState(true);
  const [registration, setRegistration] = useState(true);
  const [apiEnabled,   setApiEnabled]   = useState(true);
  const [maintenance,  setMaintenance]  = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxAttempts,    setMaxAttempts]    = useState("5");
  const [showKey,        setShowKey]        = useState(false);
  const masterKey = "sk_live_nfc_a1b2c3d4e5f6g7h8i9j0";
  const inp = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 appearance-none cursor-pointer";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-red-500"/>Access Controls</h3>
        <div className="space-y-3">
          {[
            { label:"Require 2FA for all admins",    val:twoFA,        set:v=>{setTwoFA(v);        showToast(v?"2FA enforced for admins.":"2FA requirement removed.","info");} },
            { label:"Allow new user registrations",  val:registration, set:v=>{setRegistration(v); showToast(v?"Registrations enabled.":"Registrations disabled.","info");} },
            { label:"API access enabled globally",   val:apiEnabled,   set:v=>{setApiEnabled(v);   showToast(v?"API enabled.":"API disabled.","error");} },
            { label:"Maintenance mode (blocks users)",val:maintenance, set:v=>{setMaintenance(v);  showToast(v?"⚠️ Maintenance mode ON.":"Maintenance mode OFF.",v?"error":"success");} },
          ].map(item=>(
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-red-50 last:border-0">
              <span className="text-red-700 text-sm">{item.label}</span>
              <Toggle checked={item.val} onChange={item.set}/>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-red-500"/>Session & Login</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Session timeout (min)</label>
            <div className="relative"><select value={sessionTimeout} onChange={e=>setSessionTimeout(e.target.value)} className={inp}>{["15","30","60","120","240"].map(v=><option key={v}>{v}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/></div>
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Max login attempts</label>
            <div className="relative"><select value={maxAttempts} onChange={e=>setMaxAttempts(e.target.value)} className={inp}>{["3","5","10"].map(v=><option key={v}>{v}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/></div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2"><Key className="w-4 h-4 text-red-500"/>Master API Key</h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 mb-2">
          <code className="text-red-700 text-[11px] flex-1 truncate font-mono">{showKey ? masterKey : masterKey.replace(/./g,(c,i)=>i>8?"•":c)}</code>
          <button onClick={()=>setShowKey(s=>!s)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
            {showKey?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
          </button>
          <button onClick={()=>showToast("Key copied!","info")} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"><Copy className="w-4 h-4"/></button>
        </div>
        <button onClick={()=>showToast("Master key rotated! Update all integrations.","error")}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
          <RefreshCw className="w-3.5 h-3.5"/>Rotate Master Key
        </button>
      </div>
      <button onClick={()=>showToast("Security settings saved!")}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
        <Save className="w-4 h-4"/>Save Security Settings
      </button>
    </div>
  );
}

// ─── NOTIFICATIONS PANEL ──────────────────────────────────────────────────────

function NotificationsPanel({ showToast }) {
  const [groups, setGroups] = useState(SETTING_GROUPS);
  const [sla, setSla] = useState(SLA_ITEMS);
  const [editSla, setEditSla] = useState(null);
  const [editVal, setEditVal] = useState("");

  const toggle = (gi, ii) => {
    setGroups(prev=>prev.map((g,gIdx)=>gIdx!==gi?g:{...g,items:g.items.map((item,iIdx)=>iIdx!==ii?item:{...item,checked:!item.checked})}));
    showToast("Setting updated.","info");
  };

  const saveSla = () => {
    setSla(prev=>prev.map((s,i)=>i===editSla?{...s,val:editVal}:s));
    setEditSla(null);
    showToast("SLA threshold updated!");
  };

  return (
    <div className="space-y-5">
      {groups.map((g,gi)=>(
        <div key={g.title}>
          <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
            <g.Icon className="w-4 h-4 text-red-500"/>{g.title}
          </h3>
          <div className="space-y-0">
            {g.items.map((item,ii)=>(
              <label key={item.key} className="flex items-center gap-3 py-2.5 border-b border-red-50 last:border-0 cursor-pointer group">
                <input type="checkbox" checked={item.checked} onChange={()=>toggle(gi,ii)} className="w-3.5 h-3.5 accent-red-500 flex-shrink-0"/>
                <span className="text-red-600 text-sm group-hover:text-red-900 transition-colors flex-1">{item.label}</span>
                <Toggle checked={item.checked} onChange={()=>toggle(gi,ii)}/>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500"/>SLA Thresholds
        </h3>
        <div className="space-y-0">
          {sla.map((s,i)=>(
            <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-red-50 last:border-0">
              <span className="text-red-600 text-sm">{s.label}</span>
              {editSla===i
                ? <div className="flex items-center gap-2">
                    <input value={editVal} onChange={e=>setEditVal(e.target.value)} className="w-24 bg-red-50 border border-red-300 text-red-900 text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-red-500"/>
                    <button onClick={saveSla} className="text-green-600 hover:text-green-800"><CheckCircle2 className="w-4 h-4"/></button>
                    <button onClick={()=>setEditSla(null)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4"/></button>
                  </div>
                : <button onClick={()=>{setEditSla(i);setEditVal(s.val);}} className="flex items-center gap-1.5 text-red-600 text-xs font-semibold hover:text-red-800 transition-colors">
                    {s.val}<Edit3 className="w-3 h-3"/>
                  </button>
              }
            </div>
          ))}
        </div>
      </div>
      <button onClick={()=>showToast("All notification settings saved!")}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
        <Save className="w-4 h-4"/>Save All Settings
      </button>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"general",       label:"General",       Icon:Globe    },
  { id:"security",      label:"Security",      Icon:Shield   },
  { id:"notifications", label:"Notifications", Icon:Bell     },
];

export default function AdminSettingsPage({ onMenuClick, navigate }) {
  const [tab,   setTab]   = useState("general");
  const [toast, setToast] = useState({ msg:"", type:"success" });
  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast({msg:""}),3000); };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} navigate={navigate}/>
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <Settings className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Admin Settings</h1>
            <p className="text-red-400 text-xs hidden sm:block">Configure system preferences, security and notifications</p>
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
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="general"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><Globe className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">General Settings</h2>
            </div>
            <GeneralPanel showToast={showToast}/>
          </div>
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="security"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><Shield className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">Security</h2>
            </div>
            <SecurityPanel showToast={showToast}/>
          </div>
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="notifications"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0"><Bell className="w-4 h-4 text-red-600"/></div>
              <h2 className="text-red-900 font-bold text-base">Notifications & SLA</h2>
            </div>
            <NotificationsPanel showToast={showToast}/>
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}
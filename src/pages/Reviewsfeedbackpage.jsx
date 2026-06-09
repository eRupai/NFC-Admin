import { useState } from "react";
import {
  Star, ThumbsUp, ThumbsDown, MessageSquare, Flag,
  CheckCircle2, X, Search, Filter, Trash2, Edit3,
  ChevronDown, BarChart2, TrendingUp, TrendingDown,
  Shield, Users, Eye, EyeOff, RefreshCw, Download,
  AlertTriangle, Clock, ArrowUpRight, PlusCircle,
  Send, Pin, Archive, MoreHorizontal, Tag,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const REVIEWS = [
  { id: 1,  name: "Priya Mehta",   email: "priya.m@gmail.com",   avatar: "PM", bg: "bg-red-500",  rating: 5, title: "Absolutely brilliant app!", body: "I've been using NFC Writer for 3 months now and it's transformed how I manage my business cards. Writing vCards is seamless and the bulk operation feature saved me hours.", date: "31 May 2025", product: "NFC Writer Pro", platform: "Google Play", status: "published", pinned: true,  helpful: 42, reported: false, reply: "" },
  { id: 2,  name: "Aditya Kumar",  email: "aditya.k@tc.in",      avatar: "AK", bg: "bg-red-700",  rating: 4, title: "Great product, minor UI issues", body: "The core functionality is excellent and I love the API access. Would appreciate a dark mode and a more intuitive bulk import flow. Support team was very responsive.", date: "29 May 2025", product: "NFC Writer API", platform: "App Store",   status: "published", pinned: false, helpful: 28, reported: false, reply: "Thank you for the feedback! Dark mode is on our roadmap for Q3." },
  { id: 3,  name: "Sunita Rao",    email: "sunita@ep.com",        avatar: "SR", bg: "bg-rose-500", rating: 2, title: "Crashes on Samsung Galaxy S23", body: "App crashes every time I try to write to NTAG216 cards. I've reinstalled three times and the issue persists. Very frustrating as I need this for my business.", date: "27 May 2025", product: "NFC Writer Pro", platform: "Google Play", status: "published", pinned: false, helpful: 15, reported: false, reply: "" },
  { id: 4,  name: "Karan Shah",    email: "karan@sx.io",          avatar: "KS", bg: "bg-red-800",  rating: 5, title: "Best NFC tool on the market", body: "Tried 5 different NFC apps before finding this one. The URL shortening, scan analytics and the clean dashboard make it miles ahead of the competition. Worth every rupee.", date: "25 May 2025", product: "NFC Writer Pro", platform: "App Store",   status: "published", pinned: true,  helpful: 67, reported: false, reply: "" },
  { id: 5,  name: "Meera Pillai",  email: "meera@hp.co",          avatar: "MP", bg: "bg-red-600",  rating: 3, title: "Good but pricey for small teams", body: "Functionality is solid for what it does. However, the pricing tiers feel steep for a small clinic like ours. Would love a micro-business plan between Free and Premium.", date: "22 May 2025", product: "NFC Writer Pro", platform: "Google Play", status: "published", pinned: false, helpful: 19, reported: false, reply: "" },
  { id: 6,  name: "Rohan Verma",   email: "rohan@edu.in",         avatar: "RV", bg: "bg-red-900",  rating: 1, title: "Does not work on iPhone at all", body: "Completely misleading listing. The app does absolutely nothing on iOS. There should be a much clearer warning that this only works on Android Chrome. Wasted money.", date: "20 May 2025", product: "NFC Writer Lite", platform: "App Store",   status: "flagged",   pinned: false, helpful: 8,  reported: true,  reply: "" },
  { id: 7,  name: "Divya Nair",    email: "divya@corp.com",       avatar: "DN", bg: "bg-rose-600", rating: 5, title: "Game changer for events",       body: "We used NFC Writer at our corporate event to create 500 smart name tags in under an hour. The bulk CSV import worked flawlessly. Our attendees were genuinely impressed.", date: "18 May 2025", product: "NFC Writer Pro", platform: "Google Play", status: "published", pinned: false, helpful: 89, reported: false, reply: "Wow, 500 tags in an hour — that's amazing! Thank you for sharing your experience." },
  { id: 8,  name: "Arjun Bose",    email: "arjun.b@freelance.io", avatar: "AB", bg: "bg-red-700",  rating: 4, title: "Solid API with good docs",       body: "Integrated the NFC Writer API into our inventory system in about a day. The documentation is clear and the webhook events are well-structured. Minor suggestion: add more SDK language support.", date: "15 May 2025", product: "NFC Writer API", platform: "Web",         status: "published", pinned: false, helpful: 34, reported: false, reply: "" },
];

const FEEDBACK = [
  { id: 1,  name: "Preethi S.",    email: "preethi@co.in",  avatar: "PS", bg: "bg-red-600",  type: "Feature Request", subject: "Add dark mode to the dashboard",           body: "The dashboard is great but staring at a bright white screen all day is tough. Would love a dark mode toggle in settings.",                           date: "30 May 2025", status: "under review", votes: 48, tag: "UI/UX"      },
  { id: 2,  name: "Vikram Iyer",   email: "vikram@tech.io", avatar: "VI", bg: "bg-rose-700", type: "Bug Report",      subject: "Webhook not firing on card scan events",     body: "My webhook endpoint works fine for write events but never receives scan events. Tested with Pipedream and RequestBin — no payload comes through.",   date: "28 May 2025", status: "in progress",  votes: 31, tag: "API"        },
  { id: 3,  name: "Ananya Patel",  email: "ananya@hp.co",   avatar: "AP", bg: "bg-red-800",  type: "Feature Request", subject: "CSV export for scan analytics",               body: "I need to export scan data to Excel for monthly client reports. Right now I have to manually copy everything from the dashboard.",                     date: "26 May 2025", status: "planned",      votes: 27, tag: "Analytics"  },
  { id: 4,  name: "Rahul Menon",   email: "rahul@startup.io",avatar: "RM",bg: "bg-red-500",  type: "Improvement",     subject: "Faster bulk write speed",                    body: "Bulk writing 200 cards takes about 40 minutes. Competitors claim under 20 mins for the same. Would love to see performance improvements in this area.", date: "24 May 2025", status: "under review", votes: 22, tag: "Performance" },
  { id: 5,  name: "Sneha Gupta",   email: "sneha@edu.in",   avatar: "SG", bg: "bg-rose-500", type: "Bug Report",      subject: "App freezes after 10 consecutive writes",     body: "The Android app consistently freezes when I write more than 10 cards in a session. I have to force-close and restart. Reproducible on Pixel 7 Pro.", date: "21 May 2025", status: "resolved",     votes: 19, tag: "Mobile"     },
  { id: 6,  name: "Tarun Kapoor",  email: "tarun@retail.com",avatar: "TK",bg: "bg-red-700",  type: "Feature Request", subject: "NFC card templates library",                  body: "Would love a library of ready-made NFC templates (restaurant menus, event passes, business cards) that I can customise and deploy quickly.",           date: "19 May 2025", status: "planned",      votes: 56, tag: "Templates"  },
];

const RATING_DIST = [
  { stars: 5, count: 3, pct: 62 },
  { stars: 4, count: 2, pct: 25 },
  { stars: 3, count: 1, pct: 7  },
  { stars: 2, count: 1, pct: 4  },
  { stars: 1, count: 1, pct: 2  },
];

const METRICS = [
  { label: "Avg Rating",       val: "4.2",  sub: "+0.3 this month", up: true,  Icon: Star        },
  { label: "Total Reviews",    val: "8",    sub: "+3 this week",    up: true,  Icon: MessageSquare},
  { label: "Total Feedback",   val: "6",    sub: "+1 today",        up: true,  Icon: ThumbsUp    },
  { label: "Flagged",          val: "1",    sub: "Needs review",    up: false, Icon: Flag        },
  { label: "Replied",          val: "3",    sub: "of 8 reviews",    up: false, Icon: Send        },
  { label: "Avg Helpfulness",  val: "37",   sub: "votes per review",up: true,  Icon: TrendingUp  },
];

const FB_STATUS_STYLES = {
  "under review": "bg-amber-100 text-amber-700 border-amber-200",
  "in progress":  "bg-blue-100 text-blue-700 border-blue-200",
  "planned":      "bg-purple-100 text-purple-700 border-purple-200",
  "resolved":     "bg-green-100 text-green-700 border-green-200",
};

const FB_TYPE_STYLES = {
  "Feature Request": "bg-red-100 text-red-600",
  "Bug Report":      "bg-rose-100 text-rose-600",
  "Improvement":     "bg-amber-100 text-amber-700",
};

const REVIEW_STATUS_STYLES = {
  published: "bg-green-100 text-green-700 border-green-200",
  flagged:   "bg-red-100 text-red-600 border-red-200",
  hidden:    "bg-gray-100 text-gray-500 border-gray-200",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function StarRow({ rating, size = "w-3.5 h-3.5" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${size} ${i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl">
      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />{msg}
      <button onClick={onClose}><X className="w-3 h-3 opacity-70 hover:opacity-100" /></button>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────

function OverviewTab({ setActiveTab }) {
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {METRICS.map(m => (
          <div key={m.label} className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <m.Icon className="w-3.5 h-3.5 text-red-600" />
              </div>
              <span className="text-red-400 text-[11px]">{m.label}</span>
            </div>
            <div className="text-red-900 text-xl font-bold">{m.val}</div>
            <div className={`text-[11px] mt-1 ${m.up ? "text-green-600" : "text-red-500"}`}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rating breakdown */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-4">
            <Star className="w-4 h-4 text-red-500" />Rating Distribution
          </div>
          <div className="flex items-center gap-6 mb-5">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-900">{avg}</div>
              <StarRow rating={Math.round(parseFloat(avg))} size="w-4 h-4" />
              <div className="text-red-400 text-[11px] mt-1">{REVIEWS.length} reviews</div>
            </div>
            <div className="flex-1 space-y-2">
              {RATING_DIST.map(r => (
                <div key={r.stars} className="flex items-center gap-2">
                  <span className="text-red-400 text-[11px] w-3 text-right flex-shrink-0">{r.stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                  <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-red-400 text-[11px] w-4 text-right flex-shrink-0">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setActiveTab("reviews")}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors">
            Manage all reviews <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent feedback */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <ThumbsUp className="w-4 h-4 text-red-500" />Top Feedback
            </div>
            <button onClick={() => setActiveTab("feedback")} className="text-red-400 text-[11px] hover:text-red-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {FEEDBACK.sort((a,b) => b.votes - a.votes).slice(0,4).map(f => (
              <div key={f.id} className="flex items-start gap-3 p-2.5 bg-red-50/50 rounded-xl border border-red-100">
                <div className={`w-7 h-7 rounded-full ${f.bg} text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0`}>{f.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-red-900 text-xs font-semibold truncate">{f.subject}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${FB_TYPE_STYLES[f.type]}`}>{f.type}</span>
                    <span className="text-red-400 text-[10px]">{f.votes} votes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent reviews */}
      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <MessageSquare className="w-4 h-4 text-red-500" />Recent Reviews
          </div>
          <button onClick={() => setActiveTab("reviews")} className="text-red-400 text-[11px] hover:text-red-700 flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {REVIEWS.slice(0,3).map(r => (
            <div key={r.id} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
              <div className={`w-8 h-8 rounded-full ${r.bg} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>{r.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-red-900 text-xs font-semibold">{r.name}</span>
                  <StarRow rating={r.rating} size="w-3 h-3" />
                  <span className="text-red-400 text-[10px] ml-auto">{r.date}</span>
                </div>
                <div className="text-red-700 text-xs font-medium">{r.title}</div>
                <div className="text-red-400 text-[11px] mt-0.5 truncate">{r.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REVIEWS TAB ──────────────────────────────────────────────────────────────

function ReviewsTab({ showToast }) {
  const [reviews, setReviews]   = useState(REVIEWS);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyText, setReplyText]       = useState("");

  const filtered = reviews.filter(r => {
    const matchR = filterRating === "all" || r.rating === parseInt(filterRating);
    const matchS = filterStatus === "all" || r.status === filterStatus;
    const matchQ = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase());
    return matchR && matchS && matchQ;
  });

  const update = (id, patch) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...patch }));
  };

  const handleReply = () => {
    if (!replyText.trim()) { showToast("Please type a reply first"); return; }
    update(selected.id, { reply: replyText });
    setReplyText("");
    showToast("Reply published");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* List */}
      <div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
        </div>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {["all","5","4","3","2","1"].map(s => (
            <button key={s} onClick={() => setFilterRating(s)}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all flex items-center gap-1 ${filterRating === s ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
              {s !== "all" && <Star className="w-2.5 h-2.5 fill-current" />}{s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {["all","published","flagged","hidden"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all capitalize ${filterStatus === s ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-red-400 text-xs">
              <MessageSquare className="w-7 h-7 mx-auto mb-2 opacity-40" />No reviews found
            </div>
          ) : filtered.map(r => (
            <div key={r.id} onClick={() => { setSelected(r); setReplyText(r.reply || ""); }}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.id === r.id ? "border-red-400 bg-red-50" : "border-red-100 bg-white hover:bg-red-50/50"}`}>
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-full ${r.bg} text-white text-[10px] font-bold flex items-center justify-center`}>{r.avatar}</div>
                {r.pinned && <Pin className="w-2.5 h-2.5 text-red-600 absolute -top-0.5 -right-0.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-red-900 text-xs font-semibold">{r.name}</span>
                  <StarRow rating={r.rating} size="w-3 h-3" />
                </div>
                <div className="text-red-700 text-[11px] font-medium truncate">{r.title}</div>
                <div className="text-red-400 text-[10px] truncate mt-0.5">{r.body}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{r.platform}</span>
                  {r.reply && <span className="text-[9px] text-green-600 flex items-center gap-0.5"><Send className="w-2.5 h-2.5" />Replied</span>}
                  {r.reported && <span className="text-[9px] text-red-600 flex items-center gap-0.5"><Flag className="w-2.5 h-2.5" />Reported</span>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-[10px] text-red-300">{r.date}</span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${REVIEW_STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-red-400 text-xs">
            <Star className="w-8 h-8 mb-2 opacity-30" />Select a review to manage
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${selected.bg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{selected.avatar}</div>
                <div>
                  <div className="text-red-900 text-sm font-semibold">{selected.name}</div>
                  <div className="text-red-400 text-xs">{selected.email}</div>
                  <StarRow rating={selected.rating} size="w-3.5 h-3.5" />
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${REVIEW_STATUS_STYLES[selected.status]}`}>{selected.status}</span>
            </div>

            {/* Review content */}
            <div className="mb-4">
              <div className="text-red-900 text-sm font-bold mb-2">"{selected.title}"</div>
              <div className="bg-red-50 rounded-xl p-3 text-red-700 text-xs leading-relaxed">{selected.body}</div>
            </div>

            {/* Meta */}
            <div className="space-y-0 mb-4">
              {[
                { k: "Platform",    v: selected.platform },
                { k: "Product",     v: selected.product  },
                { k: "Date",        v: selected.date     },
                { k: "Helpful votes", v: `${selected.helpful} votes` },
              ].map(r => (
                <div key={r.k} className="flex justify-between items-center py-1.5 border-b border-red-50 last:border-0">
                  <span className="text-red-400 text-[11px]">{r.k}</span>
                  <span className="text-red-900 text-[11px] font-medium">{r.v}</span>
                </div>
              ))}
            </div>

            {/* Existing reply */}
            {selected.reply && (
              <div className="mb-3 bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="text-green-700 text-[11px] font-semibold mb-1 flex items-center gap-1"><Send className="w-3 h-3" />Your reply</div>
                <div className="text-green-800 text-xs leading-relaxed">{selected.reply}</div>
              </div>
            )}

            {/* Reply box */}
            <div className="mb-3">
              <div className="text-red-700 text-[11px] font-semibold mb-1.5">{selected.reply ? "Edit reply" : "Reply publicly"}</div>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={3}
                placeholder="Write a public reply to this review…"
                className="w-full bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 placeholder-red-300 px-3 py-2 outline-none focus:border-red-400 resize-none" />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-red-300">Visible publicly on {selected.platform}</span>
                <button onClick={handleReply}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
                  <Send className="w-3 h-3" />Publish
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => { update(selected.id, { pinned: !selected.pinned }); showToast(selected.pinned ? "Unpinned" : "Review pinned"); }}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${selected.pinned ? "border-red-400 bg-red-50 text-red-700" : "border-red-100 bg-white text-red-700 hover:bg-red-50"}`}>
                <Pin className="w-3 h-3" />{selected.pinned ? "Unpin" : "Pin"}
              </button>
              <button onClick={() => { update(selected.id, { status: selected.status === "hidden" ? "published" : "hidden" }); showToast(selected.status === "hidden" ? "Review visible" : "Review hidden"); }}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-red-100 bg-white hover:bg-red-50 text-red-700 transition-all">
                {selected.status === "hidden" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {selected.status === "hidden" ? "Show" : "Hide"}
              </button>
              <button onClick={() => { update(selected.id, { status: "flagged", reported: true }); showToast("Review flagged for moderation"); }}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-red-100 bg-white hover:bg-red-50 text-red-600 transition-all">
                <Flag className="w-3 h-3" />Flag
              </button>
              <button onClick={() => { setReviews(p => p.filter(r => r.id !== selected.id)); setSelected(null); showToast("Review deleted"); }}
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

// ─── FEEDBACK TAB ─────────────────────────────────────────────────────────────

function FeedbackTab({ showToast }) {
  const [feedback, setFeedback] = useState(FEEDBACK);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [filterType, setFilterType]     = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyText, setReplyText]       = useState("");

  const types    = ["all", "Feature Request", "Bug Report", "Improvement"];
  const statuses = ["all", "under review", "in progress", "planned", "resolved"];

  const filtered = feedback.filter(f => {
    const matchT = filterType === "all" || f.type === filterType;
    const matchS = filterStatus === "all" || f.status === filterStatus;
    const matchQ = !search || f.subject.toLowerCase().includes(search.toLowerCase()) || f.name.toLowerCase().includes(search.toLowerCase());
    return matchT && matchS && matchQ;
  });

  const update = (id, patch) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...patch }));
  };

  const handleReply = () => {
    if (!replyText.trim()) { showToast("Please type a reply first"); return; }
    update(selected.id, { adminReply: replyText });
    setReplyText("");
    showToast("Reply sent to " + selected.name.split(" ")[0]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* List */}
      <div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search feedback…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none" />
        </div>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${filterType === t ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
              {t === "all" ? "All types" : t}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all capitalize ${filterStatus === s ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
              {s === "all" ? "All status" : s}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-red-400 text-xs">
              <ThumbsUp className="w-7 h-7 mx-auto mb-2 opacity-40" />No feedback found
            </div>
          ) : filtered.map(f => (
            <div key={f.id} onClick={() => { setSelected(f); setReplyText(f.adminReply || ""); }}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.id === f.id ? "border-red-400 bg-red-50" : "border-red-100 bg-white hover:bg-red-50/50"}`}>
              <div className={`w-8 h-8 rounded-full ${f.bg} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>{f.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold truncate">{f.subject}</div>
                <div className="text-red-400 text-[11px] truncate mt-0.5">{f.body}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${FB_TYPE_STYLES[f.type]}`}>{f.type}</span>
                  <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{f.tag}</span>
                  <span className="text-red-400 text-[10px] flex items-center gap-0.5"><ThumbsUp className="w-2.5 h-2.5" />{f.votes}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-[10px] text-red-300">{f.date}</span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border capitalize ${FB_STATUS_STYLES[f.status]}`}>{f.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-red-400 text-xs">
            <ThumbsUp className="w-8 h-8 mb-2 opacity-30" />Select feedback to manage
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${selected.bg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{selected.avatar}</div>
                <div>
                  <div className="text-red-900 text-sm font-semibold">{selected.name}</div>
                  <div className="text-red-400 text-xs">{selected.email}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${FB_TYPE_STYLES[selected.type]}`}>{selected.type}</span>
                    <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{selected.tag}</span>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border flex-shrink-0 capitalize ${FB_STATUS_STYLES[selected.status]}`}>{selected.status}</span>
            </div>

            <div className="mb-4">
              <div className="text-red-900 text-sm font-bold mb-2">{selected.subject}</div>
              <div className="bg-red-50 rounded-xl p-3 text-red-700 text-xs leading-relaxed">{selected.body}</div>
            </div>

            <div className="space-y-0 mb-4">
              {[
                { k: "Submitted",  v: selected.date   },
                { k: "Votes",      v: `${selected.votes} upvotes` },
                { k: "Category",   v: selected.tag    },
              ].map(r => (
                <div key={r.k} className="flex justify-between items-center py-1.5 border-b border-red-50 last:border-0">
                  <span className="text-red-400 text-[11px]">{r.k}</span>
                  <span className="text-red-900 text-[11px] font-medium">{r.v}</span>
                </div>
              ))}
            </div>

            {/* Change status */}
            <div className="mb-3">
              <div className="text-red-700 text-[11px] font-semibold mb-1.5">Update status</div>
              <div className="flex gap-1.5 flex-wrap">
                {["under review","in progress","planned","resolved"].map(s => (
                  <button key={s} onClick={() => { update(selected.id, { status: s }); showToast("Status updated to " + s); }}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all capitalize ${selected.status === s ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin reply */}
            {selected.adminReply && (
              <div className="mb-3 bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="text-green-700 text-[11px] font-semibold mb-1 flex items-center gap-1"><Send className="w-3 h-3" />Your reply</div>
                <div className="text-green-800 text-xs leading-relaxed">{selected.adminReply}</div>
              </div>
            )}

            <div className="mb-3">
              <div className="text-red-700 text-[11px] font-semibold mb-1.5">Reply to user</div>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={3}
                placeholder="Write a response to this feedback…"
                className="w-full bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 placeholder-red-300 px-3 py-2 outline-none focus:border-red-400 resize-none" />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-red-300">Sends from team@nfcwriter.com</span>
                <button onClick={handleReply}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
                  <Send className="w-3 h-3" />Send
                </button>
              </div>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => { setFeedback(p => p.filter(f => f.id !== selected.id)); setSelected(null); showToast("Feedback archived"); }}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border border-red-100 bg-white hover:bg-red-50 text-red-700 transition-all">
                <Archive className="w-3 h-3" />Archive
              </button>
              <button onClick={() => { setFeedback(p => p.filter(f => f.id !== selected.id)); setSelected(null); showToast("Feedback deleted"); }}
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

// ─── MODERATION TAB ───────────────────────────────────────────────────────────

function ModerationTab({ showToast }) {
  const [flagged, setFlagged] = useState(REVIEWS.filter(r => r.reported || r.status === "flagged"));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <div className="text-amber-800 font-bold text-sm">{flagged.length} review{flagged.length !== 1 ? "s" : ""} need moderation</div>
          <div className="text-amber-600 text-xs">These have been reported by users or flagged by the system.</div>
        </div>
      </div>

      {flagged.length === 0 ? (
        <div className="bg-white border border-red-100 rounded-2xl p-10 text-center shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
          <div className="text-red-900 font-bold text-sm">All clear!</div>
          <div className="text-red-400 text-xs mt-1">No reviews currently flagged for moderation.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {flagged.map(r => (
            <div key={r.id} className="bg-white border border-red-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full ${r.bg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{r.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-red-900 text-xs font-semibold">{r.name}</span>
                    <StarRow rating={r.rating} size="w-3 h-3" />
                    <span className="text-red-400 text-[10px] ml-auto">{r.date}</span>
                  </div>
                  <div className="text-red-700 text-xs font-medium">{r.title}</div>
                  <div className="text-red-500 text-[11px] mt-1 leading-relaxed">{r.body}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-red-100">
                <div className="flex items-center gap-1.5 text-red-500 text-xs">
                  <Flag className="w-3 h-3" />
                  <span className="font-medium">{r.reported ? "Reported by user" : "System flagged"}</span>
                  <span className="text-red-400">· {r.platform}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setFlagged(p => p.filter(x => x.id !== r.id)); showToast("Review approved and published"); }}
                    className="flex items-center gap-1 text-[11px] px-3 py-1.5 border border-green-200 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-all font-semibold">
                    <CheckCircle2 className="w-3 h-3" />Approve
                  </button>
                  <button onClick={() => { setFlagged(p => p.filter(x => x.id !== r.id)); showToast("Review removed"); }}
                    className="flex items-center gap-1 text-[11px] px-3 py-1.5 border border-red-200 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-all font-semibold">
                    <Trash2 className="w-3 h-3" />Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",    label: "Overview",    Icon: BarChart2     },
  { id: "reviews",     label: "Reviews",     Icon: Star          },
  { id: "feedback",    label: "Feedback",    Icon: ThumbsUp      },
  { id: "moderation",  label: "Moderation",  Icon: Shield        },
];

export default function ReviewsFeedbackPage({ onMenuClick }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast]         = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":   return <OverviewTab   setActiveTab={setActiveTab} />;
      case "reviews":    return <ReviewsTab    showToast={showToast} />;
      case "feedback":   return <FeedbackTab   showToast={showToast} />;
      case "moderation": return <ModerationTab showToast={showToast} />;
      default:           return null;
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
              <Star className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-red-900 font-bold text-sm">Reviews & Feedback</span>
            <span className="text-[10px] bg-red-600 text-white font-semibold px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast("Exporting data…")}
              className="hidden sm:flex items-center gap-1.5 text-[11px] px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all">
              <Download className="w-3 h-3" />Export
            </button>
            <span className="text-red-400 text-xs hidden sm:block">Rahul Singh</span>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">RS</div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="bg-white border-b border-red-100 flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                activeTab === t.id ? "border-red-600 text-red-600" : "border-transparent text-red-400 hover:text-red-700"
              }`}>
              <t.Icon className="w-3.5 h-3.5" />{t.label}
              {t.id === "moderation" && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">1</span>
              )}
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
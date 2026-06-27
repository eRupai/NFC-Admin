import React, { useState, useMemo } from "react";
import {
  DoorOpen, Plus, Pencil, Trash2, MapPin, X, Search,
  ChevronDown, Lock, LockOpen, TrendingUp, MonitorSmartphone,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

const DOOR_TYPES = ["Entrance", "Restricted Zone", "Server Room", "Records Room", "Office", "Vault"];

const seedDoors = [
  { number: "Door 001", name: "Main Entrance", location: "Ground Floor, Lobby", type: "Entrance", status: "Active", entriesToday: 240 },
  { number: "Door 002", name: "Server Room", location: "Basement, IT Wing", type: "Server Room", status: "Active", entriesToday: 38 },
  { number: "Door 003", name: "Judge Chamber", location: "2nd Floor, East Wing", type: "Restricted Zone", status: "Active", entriesToday: 24 },
  { number: "Door 004", name: "Records Room", location: "1st Floor, Archives", type: "Records Room", status: "Active", entriesToday: 132 },
  { number: "Door 005", name: "West Wing Office", location: "1st Floor, West Wing", type: "Office", status: "Active", entriesToday: 96 },
  { number: "Door 006", name: "Archive Vault", location: "Basement, Storage", type: "Vault", status: "Disabled", entriesToday: 0 },
];

const emptyForm = { number: "", name: "", location: "", type: DOOR_TYPES[0], status: "Active" };

function nextDoorNumber(doors) {
  const max = doors.reduce((m, d) => Math.max(m, parseInt(d.number.replace(/\D/g, ""), 10) || 0), 0);
  return `Door ${String(max + 1).padStart(3, "0")}`;
}

function typeIcon(type) {
  if (type === "Vault" || type === "Restricted Zone") return Lock;
  if (type === "Server Room") return MonitorSmartphone;
  return DoorOpen;
}

/* ---------------------------------------------------------------------- */
/*  SMALL UI PIECES                                                        */
/* ---------------------------------------------------------------------- */
function StatCard({ label, value, tone }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-semibold mt-2 ${tone || "text-gray-900"}`}>{value}</div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md shadow-lg z-50">
      {message}
    </div>
  );
}

function DoorModal({ mode, form, setForm, onClose, onSave }) {
  if (!mode) return null;
  const field = (label, key) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
      />
    </div>
  );
  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">{mode === "add" ? "Add Door" : "Edit Door"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field("Door Number", "number")}
            {field("Door Name", "name")}
          </div>
          {field("Door Location", "location")}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Door Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
              >
                {DOOR_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Door Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
              >
                <option>Active</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">Cancel</button>
          <button
            onClick={onSave}
            disabled={!form.number || !form.name}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {mode === "add" ? "Add Door" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DoorCard({ door, onEdit, onDelete, onToggle }) {
  const Icon = typeIcon(door.type);
  const active = door.status === "Active";
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${active ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400"}`}>
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <div className="text-xs font-mono text-gray-400">{door.number}</div>
            <div className="text-sm font-semibold text-gray-900 truncate">{door.name}</div>
          </div>
        </div>
        <button
          onClick={() => onToggle(door.number)}
          title="Enable / Disable Door"
          className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border ${active ? "bg-red-50 text-red-600 border-red-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
        >
          {active ? "Active" : "Disabled"}
        </button>
      </div>

      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <MapPin size={12} /> {door.location}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600">{door.type}</span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <TrendingUp size={12} /> {door.entriesToday} entries today
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <button onClick={() => onEdit(door)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
          <Pencil size={12} /> Edit
        </button>
        <button onClick={() => onToggle(door.number)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
          {active ? <Lock size={12} /> : <LockOpen size={12} />} {active ? "Disable" : "Enable"}
        </button>
        <button onClick={() => onDelete(door.number)} className="flex items-center justify-center w-9 py-2 rounded-md text-red-500 hover:bg-red-50">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE                                                              */
/* ---------------------------------------------------------------------- */
export default function DoorManagement({ onMenuClick }) {
  const [doors, setDoors] = useState(seedDoors);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalMode, setModalMode] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingNumber, setEditingNumber] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const filtered = useMemo(() => {
    return doors.filter((d) => {
      const matchesSearch = `${d.name} ${d.number} ${d.location}`.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || d.type === typeFilter;
      const matchesStatus = statusFilter === "All" || d.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [doors, search, typeFilter, statusFilter]);

  const totals = useMemo(() => ({
    total: doors.length,
    active: doors.filter((d) => d.status === "Active").length,
    disabled: doors.filter((d) => d.status === "Disabled").length,
    entries: doors.reduce((sum, d) => sum + d.entriesToday, 0),
  }), [doors]);

  function openAdd() {
    setForm({ ...emptyForm, number: nextDoorNumber(doors) });
    setEditingNumber(null);
    setModalMode("add");
  }

  function openEdit(d) {
    setForm({ number: d.number, name: d.name, location: d.location, type: d.type, status: d.status });
    setEditingNumber(d.number);
    setModalMode("edit");
  }

  function saveDoor() {
    if (modalMode === "add") {
      setDoors([...doors, { ...form, entriesToday: 0 }]);
      showToast(`${form.name} added`);
    } else {
      setDoors(doors.map((d) => (d.number === editingNumber ? { ...d, ...form } : d)));
      showToast(`${form.name} updated`);
    }
    setModalMode(null);
  }

  function toggleStatus(number) {
    setDoors(doors.map((d) => (d.number === number ? { ...d, status: d.status === "Active" ? "Disabled" : "Active" } : d)));
  }

  function deleteDoor(number) {
    const d = doors.find((x) => x.number === number);
    if (window.confirm(`Delete ${d.name} (${d.number})? This cannot be undone.`)) {
      setDoors(doors.filter((x) => x.number !== number));
      showToast(`${d.name} deleted`);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 text-gray-900" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* TOPBAR (shared shell) */}
      <Topbar onMenuClick={onMenuClick} />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto min-h-0 p-6 space-y-5">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Door Management</h1>
          <p className="text-xs text-gray-500">{totals.total} doors configured</p>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Doors" value={totals.total} />
          <StatCard label="Active Doors" value={totals.active} tone="text-red-600" />
          <StatCard label="Disabled Doors" value={totals.disabled} />
          <StatCard label="Entries Today" value={totals.entries} />
        </section>

        {/* TOOLBAR */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md w-64 bg-gray-50 border border-gray-200">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search door, location..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700"
              >
                <option>All</option>
                {DOOR_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700"
              >
                <option>All</option>
                <option>Active</option>
                <option>Disabled</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={openAdd}
            className="ml-auto flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 font-medium"
          >
            <Plus size={15} /> Add Door
          </button>
        </section>

        {/* DOOR GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <DoorCard key={d.number} door={d} onEdit={openEdit} onDelete={deleteDoor} onToggle={toggleStatus} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-16 text-sm bg-white border border-gray-200 rounded-lg">
              No doors match your filters.
            </div>
          )}
        </section>
      </main>

      <DoorModal mode={modalMode} form={form} setForm={setForm} onClose={() => setModalMode(null)} onSave={saveDoor} />
      <Toast message={toast} />
    </div>
  );
}
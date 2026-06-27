import React, { useState, useMemo } from "react";
import {
  Search, Plus, Pencil, Trash2, Power, KeyRound, ShieldCheck, X, Check,
  CreditCard, ScanFace, Fingerprint, Eye, Mail, ChevronDown,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

const DEPARTMENTS = ["Legal", "Security", "Records", "IT", "Administration"];
const ROLES = ["Super Admin", "Admin", "Security Officer", "Legal Officer", "Standard User"];
const PERMISSIONS = ["User Management", "Door Management", "Audit Access", "Reports Access", "Alert Management"];

const seedUsers = [
  { id: "USR-1001", name: "Aditi Sharma", email: "aditi.sharma@barassoc.org", phone: "+91 98765 43210", department: "Legal", role: "Legal Officer", designation: "Senior Advocate", status: "Active", biometric: { card: true, face: true, fingerprint: true, retina: false }, permissions: ["Reports Access"] },
  { id: "USR-1002", name: "Rohan Verma", email: "rohan.verma@barassoc.org", phone: "+91 98765 11223", department: "Security", role: "Security Officer", designation: "Floor Supervisor", status: "Active", biometric: { card: true, face: true, fingerprint: true, retina: true }, permissions: ["Door Management", "Alert Management"] },
  { id: "USR-1003", name: "Kavya Iyer", email: "kavya.iyer@barassoc.org", phone: "+91 98765 44556", department: "Records", role: "Standard User", designation: "Records Clerk", status: "Active", biometric: { card: true, face: false, fingerprint: true, retina: false }, permissions: [] },
  { id: "USR-1004", name: "Sanjay Nair", email: "sanjay.nair@barassoc.org", phone: "+91 98765 77889", department: "IT", role: "Admin", designation: "Systems Admin", status: "Inactive", biometric: { card: true, face: true, fingerprint: false, retina: false }, permissions: ["User Management", "Audit Access"] },
  { id: "USR-1005", name: "Meera Krishnan", email: "meera.k@barassoc.org", phone: "+91 98765 99001", department: "Administration", role: "Super Admin", designation: "Registrar", status: "Active", biometric: { card: true, face: true, fingerprint: true, retina: true }, permissions: PERMISSIONS },
  { id: "USR-1006", name: "Vikram Desai", email: "vikram.d@barassoc.org", phone: "+91 98765 22334", department: "Legal", role: "Standard User", designation: "Junior Advocate", status: "Inactive", biometric: { card: false, face: false, fingerprint: false, retina: false }, permissions: [] },
];

const emptyForm = { name: "", email: "", phone: "", department: DEPARTMENTS[0], role: ROLES[4], designation: "", status: "Active" };

/* ---------------------------------------------------------------------- */
/*  HELPERS                                                                */
/* ---------------------------------------------------------------------- */
function initials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function nextId(users) {
  const max = users.reduce((m, u) => Math.max(m, parseInt(u.id.split("-")[1], 10) || 0), 1000);
  return `USR-${max + 1}`;
}

/* ---------------------------------------------------------------------- */
/*  SMALL UI PIECES                                                        */
/* ---------------------------------------------------------------------- */
function BioIcon({ ok, Icon, title }) {
  return (
    <span
      title={title}
      className={`w-7 h-7 rounded-md flex items-center justify-center ${ok ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400"}`}
    >
      <Icon size={14} />
    </span>
  );
}

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
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md shadow-lg flex items-center gap-2 z-50">
      <Check size={14} className="text-red-400" />
      {message}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  USER FORM MODAL                                                        */
/* ---------------------------------------------------------------------- */
function UserModal({ mode, form, setForm, onClose, onSave }) {
  if (!mode) return null;
  const field = (label, key, type = "text") => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
      />
    </div>
  );
  const select = (label, key, options) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <select
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">{mode === "add" ? "Add User" : "Edit User"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field("Full Name", "name")}
            {field("Designation", "designation")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Email", "email", "email")}
            {field("Phone Number", "phone")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select("Department", "department", DEPARTMENTS)}
            {select("Role", "role", ROLES)}
          </div>
          {select("Status", "status", ["Active", "Inactive"])}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">Cancel</button>
          <button
            onClick={onSave}
            disabled={!form.name || !form.email}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {mode === "add" ? "Add User" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  PERMISSIONS PANEL                                                      */
/* ---------------------------------------------------------------------- */
function PermissionsModal({ user, onClose, onToggle, onSave }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Assign Permissions</h3>
            <p className="text-xs text-gray-500 mt-0.5">{user.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-2">
          {PERMISSIONS.map((p) => {
            const checked = user.permissions.includes(p);
            return (
              <label key={p} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                <span
                  onClick={(e) => { e.preventDefault(); onToggle(p); }}
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${checked ? "bg-red-600 border-red-600" : "border-gray-300"}`}
                >
                  {checked && <Check size={11} className="text-white" />}
                </span>
                <span className="text-sm text-gray-700">{p}</span>
              </label>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100">Close</button>
          <button onClick={onSave} className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  MAIN PAGE                                                              */
/* ---------------------------------------------------------------------- */
export default function UserManagement({ onMenuClick }) {
  const [users, setUsers] = useState(seedUsers);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [permUser, setPermUser] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = `${u.name} ${u.email} ${u.id}`.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === "All" || u.department === deptFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [users, search, deptFilter, statusFilter]);

  const totals = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    inactive: users.filter((u) => u.status === "Inactive").length,
    departments: new Set(users.map((u) => u.department)).size,
  }), [users]);

  function openAdd() {
    setForm(emptyForm);
    setModalMode("add");
    setEditingId(null);
  }

  function openEdit(u) {
    setForm({ name: u.name, email: u.email, phone: u.phone, department: u.department, role: u.role, designation: u.designation, status: u.status });
    setEditingId(u.id);
    setModalMode("edit");
  }

  function saveUser() {
    if (modalMode === "add") {
      const id = nextId(users);
      setUsers([...users, { id, ...form, biometric: { card: false, face: false, fingerprint: false, retina: false }, permissions: [] }]);
      showToast(`${form.name} added`);
    } else {
      setUsers(users.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
      showToast(`${form.name} updated`);
    }
    setModalMode(null);
  }

  function toggleStatus(id) {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)));
  }

  function deleteUser(id) {
    const u = users.find((x) => x.id === id);
    if (window.confirm(`Delete ${u.name}? This cannot be undone.`)) {
      setUsers(users.filter((x) => x.id !== id));
      showToast(`${u.name} deleted`);
    }
  }

  function resetCredentials(u) {
    showToast(`Credentials reset for ${u.name}`);
  }

  function togglePermission(p) {
    setPermUser({ ...permUser, permissions: permUser.permissions.includes(p) ? permUser.permissions.filter((x) => x !== p) : [...permUser.permissions, p] });
  }

  function savePermissions() {
    setUsers(users.map((u) => (u.id === permUser.id ? { ...u, permissions: permUser.permissions } : u)));
    showToast(`Permissions updated for ${permUser.name}`);
    setPermUser(null);
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
          <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
          <p className="text-xs text-gray-500">{totals.total} users across {totals.departments} departments</p>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={totals.total} />
          <StatCard label="Active Users" value={totals.active} tone="text-red-600" />
          <StatCard label="Inactive Users" value={totals.inactive} />
          <StatCard label="Departments" value={totals.departments} />
        </section>

        {/* TOOLBAR */}
        <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md w-64 bg-gray-50 border border-gray-200">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, ID..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 text-gray-700"
              >
                <option>All</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
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
                <option>Inactive</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={openAdd}
            className="ml-auto flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 font-medium"
          >
            <Plus size={15} /> Add User
          </button>
        </section>

        {/* TABLE */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left font-medium px-4 py-3">User</th>
                <th className="text-left font-medium px-4 py-3">Department</th>
                <th className="text-left font-medium px-4 py-3">Role / Designation</th>
                <th className="text-left font-medium px-4 py-3">Biometric</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{u.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                          <Mail size={10} /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{u.department}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">{u.role}</div>
                    <div className="text-xs text-gray-500">{u.designation}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <BioIcon ok={u.biometric.card} Icon={CreditCard} title="Smart Card" />
                      <BioIcon ok={u.biometric.face} Icon={ScanFace} title="Face Profile" />
                      <BioIcon ok={u.biometric.fingerprint} Icon={Fingerprint} title="Fingerprint Profile" />
                      <BioIcon ok={u.biometric.retina} Icon={Eye} title="Retina/Iris Profile" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.status === "Active" ? "bg-red-50 text-red-600 border border-red-200" : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(u)} title="Edit User" className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => resetCredentials(u)} title="Reset Credentials" className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <KeyRound size={14} />
                      </button>
                      <button onClick={() => setPermUser({ ...u })} title="Assign Permissions" className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <ShieldCheck size={14} />
                      </button>
                      <button onClick={() => toggleStatus(u.id)} title="Activate / Deactivate" className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <Power size={14} />
                      </button>
                      <button onClick={() => deleteUser(u.id)} title="Delete User" className="w-8 h-8 rounded-md flex items-center justify-center text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-10 text-sm">No users match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      <UserModal mode={modalMode} form={form} setForm={setForm} onClose={() => setModalMode(null)} onSave={saveUser} />
      <PermissionsModal user={permUser} onClose={() => setPermUser(null)} onToggle={togglePermission} onSave={savePermissions} />
      <Toast message={toast} />
    </div>
  );
}
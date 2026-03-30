import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, X, Shield, Edit2, Trash2, Users, UserCheck, UserX, Search } from "lucide-react";
import { toast } from "sonner";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinedDate: string;
}

const roleOptions = ["Admin", "Manager", "Cashier", "Accountant", "Viewer"];

const initialStaff: StaffMember[] = [
  { id: 1, name: "Ram Sharma", email: "ram@elekha.com", role: "Admin", status: "active", joinedDate: "2025-01-15" },
  { id: 2, name: "Sita Thapa", email: "sita@elekha.com", role: "Manager", status: "active", joinedDate: "2025-03-10" },
  { id: 3, name: "Hari Prasad", email: "hari@elekha.com", role: "Cashier", status: "active", joinedDate: "2025-06-20" },
  { id: 4, name: "Gita Rai", email: "gita@elekha.com", role: "Accountant", status: "inactive", joinedDate: "2025-02-05" },
  { id: 5, name: "Bikash KC", email: "bikash@elekha.com", role: "Viewer", status: "active", joinedDate: "2025-08-12" },
];

const rolePermissions: Record<string, string[]> = {
  Admin: ["Full access", "Manage users", "Billing", "Settings", "Reports"],
  Manager: ["Products", "Inventory", "POS", "Reports", "Contacts"],
  Cashier: ["POS", "Transactions", "View products"],
  Accountant: ["Ledger", "Transactions", "Reports", "Billing"],
  Viewer: ["View only access"],
};

const UserManagementPage = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("Cashier");

  const openAdd = () => {
    setEditingStaff(null);
    setFormName("");
    setFormEmail("");
    setFormRole("Cashier");
    setShowForm(true);
  };

  const openEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setFormName(s.name);
    setFormEmail(s.email);
    setFormRole(s.role);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (editingStaff) {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, name: formName, email: formEmail, role: formRole } : s));
      toast.success("Staff updated");
    } else {
      setStaff(prev => [...prev, { id: Date.now(), name: formName, email: formEmail, role: formRole, status: "active", joinedDate: new Date().toISOString().split("T")[0] }]);
      toast.success("Staff added");
    }
    setShowForm(false);
  };

  const toggleStatus = (id: number) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s));
  };

  const handleDelete = (id: number) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    toast("Staff removed");
  };

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || s.role === filterRole;
    return matchSearch && matchRole;
  });

  const activeCount = staff.filter(s => s.status === "active").length;
  const inactiveCount = staff.filter(s => s.status === "inactive").length;

  return (
    <AppShell headerTitle="User Management">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 pt-4">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <Users size={18} className="mx-auto text-primary mb-1" />
          <p className="text-lg font-bold text-card-foreground">{staff.length}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <UserCheck size={18} className="mx-auto text-success mb-1" />
          <p className="text-lg font-bold text-success">{activeCount}</p>
          <p className="text-[10px] text-muted-foreground">Active</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <UserX size={18} className="mx-auto text-destructive mb-1" />
          <p className="text-lg font-bold text-destructive">{inactiveCount}</p>
          <p className="text-[10px] text-muted-foreground">Inactive</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." className="w-full bg-card border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      {/* Role Filter */}
      <div className="flex gap-1.5 px-4 pt-2 overflow-x-auto no-scrollbar">
        {["All", ...roleOptions].map(role => (
          <button key={role} onClick={() => setFilterRole(role)} className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors ${filterRole === role ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {role}
          </button>
        ))}
      </div>

      {/* Staff List */}
      <div className="mx-4 mt-3 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {filtered.map(s => (
          <div key={s.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${s.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
              {s.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-card-foreground truncate">{s.name}</p>
                <span className={`w-2 h-2 rounded-full shrink-0 ${s.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{s.email}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">{s.role}</span>
                <span className="text-[9px] text-muted-foreground">Joined {s.joinedDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleStatus(s.id)} className={`p-1.5 rounded-lg ${s.status === "active" ? "text-success hover:bg-success/10" : "text-muted-foreground hover:bg-muted"}`}>
                {s.status === "active" ? <UserCheck size={14} /> : <UserX size={14} />}
              </button>
              <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-primary hover:bg-primary/10">
                <Edit2 size={14} />
              </button>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">No staff found</div>
        )}
      </div>

      {/* Add Button */}
      <div className="px-4 pt-4 pb-4">
        <button onClick={openAdd} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} /> Add Staff Member
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">{editingStaff ? "Edit Staff" : "Add Staff"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="Email *" type="email" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={formRole} onChange={e => setFormRole(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              {/* Role Permissions Preview */}
              <div className="bg-accent rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield size={12} className="text-primary" />
                  <p className="text-[10px] font-semibold text-card-foreground">{formRole} Permissions</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(rolePermissions[formRole] || []).map(p => (
                    <span key={p} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                {editingStaff ? "Update Staff" : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default UserManagementPage;

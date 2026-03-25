import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Search, Plus, X } from "lucide-react";

const tabs = ["All", "Customers", "Suppliers", "Others"];

const initialContacts = [
  { id: 1, name: "Ram Kumar", type: "customer", phone: "9841234567", email: "ram@email.com", address: "Kathmandu", pan: "", balance: 15000, direction: "receivable" as const, notes: "" },
  { id: 2, name: "Shyam Store", type: "supplier", phone: "9851234567", email: "shyam@store.com", address: "Pokhara", pan: "", balance: 8500, direction: "payable" as const, notes: "" },
  { id: 3, name: "Hari Bahadur", type: "customer", phone: "9861234567", email: "", address: "", pan: "", balance: 3200, direction: "receivable" as const, notes: "" },
  { id: 4, name: "Sita Devi", type: "customer", phone: "9871234567", email: "sita@email.com", address: "", pan: "", balance: 12000, direction: "receivable" as const, notes: "" },
  { id: 5, name: "Pokhara Traders", type: "supplier", phone: "9801234567", email: "info@pokhara.com", address: "Pokhara", pan: "", balance: 22000, direction: "payable" as const, notes: "" },
  { id: 6, name: "Laxmi Agency", type: "supplier", phone: "9811234567", email: "", address: "", pan: "", balance: 0, direction: "receivable" as const, notes: "" },
  { id: 7, name: "Bikash Transport", type: "others", phone: "9821234567", email: "", address: "", pan: "", balance: 5000, direction: "payable" as const, notes: "" },
];

const ContactsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState(initialContacts);
  const [editingItem, setEditingItem] = useState<typeof initialContacts[0] | null>(null);

  // Form fields
  const [fName, setFName] = useState("");
  const [fType, setFType] = useState("Customer");
  const [fPhone, setFPhone] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fAddress, setFAddress] = useState("");
  const [fPan, setFPan] = useState("");
  const [fBalance, setFBalance] = useState("");
  const [fNotes, setFNotes] = useState("");

  const filtered = contacts.filter(c => {
    const matchTab = activeTab === "All" || c.type === activeTab.toLowerCase().slice(0, -1);
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalReceivable = contacts.filter(c => c.direction === "receivable").reduce((s, c) => s + c.balance, 0);
  const totalPayable = contacts.filter(c => c.direction === "payable").reduce((s, c) => s + c.balance, 0);

  const openNew = () => {
    setEditingItem(null);
    setFName(""); setFType("Customer"); setFPhone(""); setFEmail(""); setFAddress(""); setFPan(""); setFBalance(""); setFNotes("");
    setShowForm(true);
  };

  const openEdit = (c: typeof initialContacts[0]) => {
    setEditingItem(c);
    setFName(c.name); setFType(c.type.charAt(0).toUpperCase() + c.type.slice(1)); setFPhone(c.phone); setFEmail(c.email);
    setFAddress(c.address); setFPan(c.pan); setFBalance(c.balance.toString()); setFNotes(c.notes);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setContacts(prev => prev.map(c => c.id === editingItem.id ? {
        ...c, name: fName || c.name, type: fType.toLowerCase(), phone: fPhone, email: fEmail,
        address: fAddress, pan: fPan, balance: fBalance ? parseInt(fBalance) : c.balance, notes: fNotes,
      } : c));
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (editingItem) setContacts(prev => prev.filter(c => c.id !== editingItem.id));
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <AppShell headerTitle="Contacts" showBack onBack={() => window.history.back()}>
      <div className="grid grid-cols-3 gap-2 px-4 pt-4">
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-card-foreground">{contacts.length}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-success">NPR {(totalReceivable / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-muted-foreground">Receivable</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-destructive">NPR {(totalPayable / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-muted-foreground">Payable</p>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full bg-card border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-3 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {filtered.map(c => (
          <button key={c.id} onClick={() => openEdit(c)} className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">{c.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{c.name}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="capitalize">{c.type}</span>
                {c.phone && <><span>•</span><span>{c.phone}</span></>}
              </div>
            </div>
            {c.balance > 0 && (
              <div className="text-right">
                <p className={`text-sm font-semibold ${c.direction === "receivable" ? "text-success" : "text-destructive"}`}>
                  NPR {c.balance.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {c.direction === "receivable" ? "To Receive" : "To Pay"}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-4">
        <button onClick={openNew} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} /> Add Contact
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">{editingItem ? "Edit Contact" : "New Contact"}</h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input value={fName} onChange={e => setFName(e.target.value)} placeholder="Full Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={fType} onChange={e => setFType(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Customer</option>
                <option>Supplier</option>
                <option>Others</option>
              </select>
              <input value={fPhone} onChange={e => setFPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={fEmail} onChange={e => setFEmail(e.target.value)} placeholder="Email Address" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={fAddress} onChange={e => setFAddress(e.target.value)} placeholder="Address" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={fPan} onChange={e => setFPan(e.target.value)} placeholder="PAN / Tax ID" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={fBalance} onChange={e => setFBalance(e.target.value)} placeholder="Opening Balance (NPR)" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Notes" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                {editingItem ? "Update Contact" : "Save Contact"}
              </button>
              {editingItem && (
                <button onClick={handleDelete} className="w-full border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm">
                  Delete Contact
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default ContactsPage;
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Search, Plus, Phone, Mail, Users, X } from "lucide-react";

const tabs = ["All", "Customers", "Suppliers", "Others"];

const contacts = [
  { id: 1, name: "Ram Kumar", type: "customer", phone: "9841234567", email: "ram@email.com", balance: 15000, direction: "receivable" as const },
  { id: 2, name: "Shyam Store", type: "supplier", phone: "9851234567", email: "shyam@store.com", balance: 8500, direction: "payable" as const },
  { id: 3, name: "Hari Bahadur", type: "customer", phone: "9861234567", email: "", balance: 3200, direction: "receivable" as const },
  { id: 4, name: "Sita Devi", type: "customer", phone: "9871234567", email: "sita@email.com", balance: 12000, direction: "receivable" as const },
  { id: 5, name: "Pokhara Traders", type: "supplier", phone: "9801234567", email: "info@pokhara.com", balance: 22000, direction: "payable" as const },
  { id: 6, name: "Laxmi Agency", type: "supplier", phone: "9811234567", email: "", balance: 0, direction: "receivable" as const },
  { id: 7, name: "Bikash Transport", type: "others", phone: "9821234567", email: "", balance: 5000, direction: "payable" as const },
];

const ContactsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = contacts.filter(c => {
    const matchTab = activeTab === "All" || c.type === activeTab.toLowerCase().slice(0, -1);
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalReceivable = contacts.filter(c => c.direction === "receivable").reduce((s, c) => s + c.balance, 0);
  const totalPayable = contacts.filter(c => c.direction === "payable").reduce((s, c) => s + c.balance, 0);

  return (
    <AppShell headerTitle="Contacts" showBack onBack={() => window.history.back()}>
      {/* Summary */}
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

      {/* Search */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-card border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contact List */}
      <div className="mx-4 mt-3 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {filtered.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3.5">
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
          </div>
        ))}
      </div>

      {/* Add Contact Button */}
      <div className="px-4 pt-4 pb-4">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Contact
        </button>
      </div>

      {/* Add Contact Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">New Contact</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Full Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Customer</option>
                <option>Supplier</option>
                <option>Others</option>
              </select>
              <input placeholder="Phone Number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder="Email Address" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder="Address" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder="PAN / Tax ID" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder="Opening Balance (NPR)" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Notes" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={() => setShowForm(false)} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default ContactsPage;

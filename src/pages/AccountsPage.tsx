import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Wallet, Landmark, Smartphone, Plus, X } from "lucide-react";

const initialAccounts = [
  { id: 1, name: "Cash in Hand", type: "Cash", icon: "Wallet" as const, balance: 25400, isPrimary: true },
  { id: 2, name: "Business Bank", type: "Bank", icon: "Landmark" as const, balance: 145000, isPrimary: false },
  { id: 3, name: "eSewa", type: "Wallet", icon: "Smartphone" as const, balance: 3200, isPrimary: false },
  { id: 4, name: "Khalti", type: "Wallet", icon: "Smartphone" as const, balance: 1500, isPrimary: false },
  { id: 5, name: "Petty Cash", type: "Cash", icon: "Wallet" as const, balance: 2000, isPrimary: false },
];

const iconMap = { Wallet, Landmark, Smartphone };

const AccountsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingItem, setEditingItem] = useState<typeof initialAccounts[0] | null>(null);

  const [fName, setFName] = useState("");
  const [fType, setFType] = useState("Cash");
  const [fBalance, setFBalance] = useState("");
  const [fDesc, setFDesc] = useState("");

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const openNew = () => {
    setEditingItem(null);
    setFName(""); setFType("Cash"); setFBalance(""); setFDesc("");
    setShowForm(true);
  };

  const openEdit = (acc: typeof initialAccounts[0]) => {
    setEditingItem(acc);
    setFName(acc.name); setFType(acc.type); setFBalance(acc.balance.toString()); setFDesc("");
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setAccounts(prev => prev.map(a => a.id === editingItem.id ? {
        ...a,
        name: fName || a.name,
        type: fType,
        balance: fBalance ? parseInt(fBalance) : a.balance,
      } : a));
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (editingItem) setAccounts(prev => prev.filter(a => a.id !== editingItem.id));
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <AppShell headerTitle="Accounts" showBack onBack={() => window.history.back()}>
      <div className="mx-4 mt-4 bg-card rounded-xl border border-border p-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
        <p className="text-2xl font-bold text-card-foreground">NPR {totalBalance.toLocaleString()}</p>
      </div>

      <SectionHeader title="All Accounts" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {accounts.map(acc => {
          const Icon = iconMap[acc.icon];
          return (
            <button key={acc.id} onClick={() => openEdit(acc)} className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-card-foreground">{acc.name}</p>
                  {acc.isPrimary && <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Primary</span>}
                </div>
                <p className="text-xs text-muted-foreground">{acc.type}</p>
              </div>
              <p className="text-sm font-bold text-card-foreground">NPR {acc.balance.toLocaleString()}</p>
            </button>
          );
        })}
      </div>

      <div className="px-4 pt-4 pb-4">
        <button onClick={openNew} className="w-full border-2 border-dashed border-primary/30 text-primary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} /> Add Account
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">{editingItem ? "Edit Account" : "New Account"}</h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input value={fName} onChange={e => setFName(e.target.value)} placeholder="Account Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={fType} onChange={e => setFType(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Cash</option><option>Bank</option><option>Wallet</option>
              </select>
              <input value={fBalance} onChange={e => setFBalance(e.target.value)} placeholder="Balance (NPR)" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="Description" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                {editingItem ? "Update Account" : "Save Account"}
              </button>
              {editingItem && (
                <button onClick={handleDelete} className="w-full border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm">
                  Delete Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default AccountsPage;
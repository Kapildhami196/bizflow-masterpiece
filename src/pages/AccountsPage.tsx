import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Wallet, Landmark, Smartphone, Plus, X } from "lucide-react";

const accounts = [
  { id: 1, name: "Cash in Hand", type: "Cash", icon: Wallet, balance: 25400, isPrimary: true },
  { id: 2, name: "Business Bank", type: "Bank", icon: Landmark, balance: 145000, isPrimary: false },
  { id: 3, name: "eSewa", type: "Wallet", icon: Smartphone, balance: 3200, isPrimary: false },
  { id: 4, name: "Khalti", type: "Wallet", icon: Smartphone, balance: 1500, isPrimary: false },
  { id: 5, name: "Petty Cash", type: "Cash", icon: Wallet, balance: 2000, isPrimary: false },
];

const AccountsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <AppShell headerTitle="Accounts" showBack onBack={() => window.history.back()}>
      <div className="mx-4 mt-4 bg-card rounded-xl border border-border p-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
        <p className="text-2xl font-bold text-card-foreground">NPR {totalBalance.toLocaleString()}</p>
      </div>

      <SectionHeader title="All Accounts" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {accounts.map(acc => {
          const Icon = acc.icon;
          return (
            <div key={acc.id} className="flex items-center gap-3 px-4 py-3.5">
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
            </div>
          );
        })}
      </div>

      <div className="px-4 pt-4 pb-4">
        <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-primary/30 text-primary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} /> Add Account
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">New Account</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Account Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Cash</option>
                <option>Bank</option>
                <option>Wallet</option>
              </select>
              <input placeholder="Opening Balance (NPR)" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Description" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={() => setShowForm(false)} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default AccountsPage;

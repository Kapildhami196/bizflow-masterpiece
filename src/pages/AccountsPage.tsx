import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Wallet, Landmark, Smartphone, CreditCard, Plus } from "lucide-react";

const accounts = [
  { id: 1, name: "Cash in Hand", type: "Cash", icon: Wallet, balance: 25400, isPrimary: true },
  { id: 2, name: "Business Bank", type: "Bank", icon: Landmark, balance: 145000, isPrimary: false },
  { id: 3, name: "eSewa", type: "Wallet", icon: Smartphone, balance: 3200, isPrimary: false },
  { id: 4, name: "Khalti", type: "Wallet", icon: Smartphone, balance: 1500, isPrimary: false },
  { id: 5, name: "Petty Cash", type: "Cash", icon: Wallet, balance: 2000, isPrimary: false },
];

const AccountsPage = () => {
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <AppShell headerTitle="Accounts" showBack onBack={() => window.history.back()}>
      {/* Total Balance */}
      <div className="mx-4 mt-4 bg-card rounded-xl border border-border p-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
        <p className="text-2xl font-bold text-card-foreground">NPR {totalBalance.toLocaleString()}</p>
      </div>

      {/* Account List */}
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
                  {acc.isPrimary && (
                    <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Primary</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{acc.type}</p>
              </div>
              <p className="text-sm font-bold text-card-foreground">₹{acc.balance.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Add Account */}
      <div className="px-4 pt-4 pb-4">
        <button className="w-full border-2 border-dashed border-primary/30 text-primary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} />
          Add Account
        </button>
      </div>
    </AppShell>
  );
};

export default AccountsPage;

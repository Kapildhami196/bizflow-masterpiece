import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Users, TrendingUp, TrendingDown, AlertCircle, Clock, CheckCircle } from "lucide-react";

const partyData = [
  { name: "Ram Kumar", type: "customer", balance: 15000, direction: "receivable" as const },
  { name: "Shyam Store", type: "supplier", balance: 8500, direction: "payable" as const },
  { name: "Hari Bahadur", type: "customer", balance: 3200, direction: "receivable" as const },
  { name: "Sita Devi", type: "customer", balance: 12000, direction: "receivable" as const },
  { name: "Pokhara Traders", type: "supplier", balance: 22000, direction: "payable" as const },
];

const LedgerPage = () => {
  const totalReceivable = partyData.filter(p => p.direction === "receivable").reduce((sum, p) => sum + p.balance, 0);
  const totalPayable = partyData.filter(p => p.direction === "payable").reduce((sum, p) => sum + p.balance, 0);

  return (
    <AppShell headerTitle="Ledger">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-success" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">To Receive</p>
          <p className="text-lg font-bold text-success">NPR {totalReceivable.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center">
              <TrendingDown size={16} className="text-destructive" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">To Pay</p>
          <p className="text-lg font-bold text-destructive">NPR {totalPayable.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <AlertCircle size={16} className="text-destructive mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">3</p>
          <p className="text-[10px] text-muted-foreground">Overdue</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <Clock size={16} className="text-warning mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">5</p>
          <p className="text-[10px] text-muted-foreground">Due Today</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <CheckCircle size={16} className="text-success mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">12</p>
          <p className="text-[10px] text-muted-foreground">Settled</p>
        </div>
      </div>

      {/* Party List */}
      <SectionHeader title="Parties" actionLabel="View All" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {partyData.map((party, idx) => (
          <div key={idx} className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <Users size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{party.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{party.type}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${party.direction === "receivable" ? "text-success" : "text-destructive"}`}>
                NPR {party.balance.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {party.direction === "receivable" ? "To Receive" : "To Pay"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Entry Button */}
      <div className="px-4 pt-4 pb-4">
        <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          Add Ledger Entry
        </button>
      </div>
    </AppShell>
  );
};

export default LedgerPage;

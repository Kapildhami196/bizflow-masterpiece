import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArrowDownLeft, ArrowUpRight, Filter, Search, Plus } from "lucide-react";

const tabs = ["All", "Income", "Expense", "Transfer"];

const transactions = [
  { id: 1, name: "Sale - Ram Kumar", amount: "15,000", type: "income" as const, date: "22 Mar, 2026", category: "Sale", account: "Cash" },
  { id: 2, name: "Electricity Bill", amount: "2,500", type: "expense" as const, date: "22 Mar, 2026", category: "Utilities", account: "Bank" },
  { id: 3, name: "Purchase - Pokhara Traders", amount: "12,000", type: "expense" as const, date: "21 Mar, 2026", category: "Purchase", account: "Bank" },
  { id: 4, name: "Collection - Hari Bahadur", amount: "3,200", type: "income" as const, date: "21 Mar, 2026", category: "Collection", account: "Cash" },
  { id: 5, name: "Fund Transfer", amount: "10,000", type: "transfer" as const, date: "20 Mar, 2026", category: "Transfer", account: "Cash → Bank" },
  { id: 6, name: "Rent Income", amount: "8,000", type: "income" as const, date: "20 Mar, 2026", category: "Rent", account: "Bank" },
  { id: 7, name: "Staff Salary", amount: "18,000", type: "expense" as const, date: "19 Mar, 2026", category: "Salary", account: "Bank" },
];

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All"
    ? transactions
    : transactions.filter(t => t.type === activeTab.toLowerCase());

  const totalIn = transactions.filter(t => t.type === "income").reduce((s, t) => s + parseInt(t.amount.replace(/,/g, "")), 0);
  const totalOut = transactions.filter(t => t.type === "expense").reduce((s, t) => s + parseInt(t.amount.replace(/,/g, "")), 0);

  return (
    <AppShell headerTitle="Transactions">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-success/15 flex items-center justify-center">
            <ArrowDownLeft size={16} className="text-success" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Money In</p>
            <p className="text-sm font-bold text-success">NPR {totalIn.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center">
            <ArrowUpRight size={16} className="text-destructive" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Money Out</p>
            <p className="text-sm font-bold text-destructive">NPR {totalOut.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-2 px-4 pt-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search transactions..."
            className="w-full bg-card border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground">
          <Filter size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="mx-4 mt-3 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {filtered.map(t => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              t.type === "income" ? "bg-success/15" : t.type === "expense" ? "bg-destructive/15" : "bg-accent"
            }`}>
              {t.type === "income" ? (
                <ArrowDownLeft size={16} className="text-success" />
              ) : t.type === "expense" ? (
                <ArrowUpRight size={16} className="text-destructive" />
              ) : (
                <ArrowUpRight size={16} className="text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground">{t.name}</p>
              <p className="text-[11px] text-muted-foreground">{t.date} • {t.category} • {t.account}</p>
            </div>
            <p className={`text-sm font-semibold ${
              t.type === "income" ? "text-success" : t.type === "expense" ? "text-destructive" : "text-primary"
            }`}>
              {t.type === "income" ? "+" : t.type === "expense" ? "-" : ""}NPR {t.amount}
            </p>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="px-4 pt-4 pb-4">
        <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} />
          Add Transaction
        </button>
      </div>
    </AppShell>
  );
};

export default TransactionsPage;

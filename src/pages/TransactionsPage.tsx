import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowDownLeft, ArrowUpRight, Filter, Search, Plus, X } from "lucide-react";

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
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"income" | "expense" | "transfer">("income");

  const filtered = activeTab === "All" ? transactions : transactions.filter(t => t.type === activeTab.toLowerCase());
  const totalIn = transactions.filter(t => t.type === "income").reduce((s, t) => s + parseInt(t.amount.replace(/,/g, "")), 0);
  const totalOut = transactions.filter(t => t.type === "expense").reduce((s, t) => s + parseInt(t.amount.replace(/,/g, "")), 0);

  const openForm = (type: "income" | "expense" | "transfer") => {
    setFormType(type);
    setShowForm(true);
  };

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
          <input placeholder="Search transactions..." className="w-full bg-card border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground">
          <Filter size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="mx-4 mt-3 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {filtered.map(t => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-success/15" : t.type === "expense" ? "bg-destructive/15" : "bg-accent"}`}>
              {t.type === "income" ? <ArrowDownLeft size={16} className="text-success" /> : t.type === "expense" ? <ArrowUpRight size={16} className="text-destructive" /> : <ArrowUpRight size={16} className="text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground">{t.name}</p>
              <p className="text-[11px] text-muted-foreground">{t.date} • {t.category} • {t.account}</p>
            </div>
            <p className={`text-sm font-semibold ${t.type === "income" ? "text-success" : t.type === "expense" ? "text-destructive" : "text-primary"}`}>
              {t.type === "income" ? "+" : t.type === "expense" ? "-" : ""}NPR {t.amount}
            </p>
          </div>
        ))}
      </div>

      {/* Add Buttons */}
      <div className="px-4 pt-4 pb-4 grid grid-cols-3 gap-2">
        <button onClick={() => openForm("income")} className="bg-success text-success-foreground py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1">
          <ArrowDownLeft size={14} /> Income
        </button>
        <button onClick={() => openForm("expense")} className="bg-destructive text-destructive-foreground py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1">
          <ArrowUpRight size={14} /> Expense
        </button>
        <button onClick={() => openForm("transfer")} className="bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1">
          <Plus size={14} /> Transfer
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground capitalize">New {formType}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Amount (NPR) *" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select Category</option>
                {formType === "income" && <><option>Sale</option><option>Collection</option><option>Rent</option><option>Other Income</option></>}
                {formType === "expense" && <><option>Purchase</option><option>Utilities</option><option>Salary</option><option>Rent</option><option>Transport</option><option>Other Expense</option></>}
                {formType === "transfer" && <option>Fund Transfer</option>}
              </select>
              <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">{formType === "transfer" ? "From Account" : "Account"}</option>
                <option>Cash in Hand</option>
                <option>Business Bank</option>
                <option>eSewa</option>
                <option>Khalti</option>
              </select>
              {formType === "transfer" && (
                <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">To Account</option>
                  <option>Cash in Hand</option>
                  <option>Business Bank</option>
                  <option>eSewa</option>
                  <option>Khalti</option>
                </select>
              )}
              <input placeholder="Party / Contact Name" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="date" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Note / Description" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={() => setShowForm(false)} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                Save Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default TransactionsPage;

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Plus, X, Edit2, Trash2, TrendingUp, TrendingDown, Wallet,
  PieChart, Target, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PieChart as RPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface Budget {
  id: string;
  name: string;
  category: string;
  allocated: number;
  spent: number;
  period: "Monthly" | "Weekly" | "Yearly";
  startDate: string;
  color: string;
}

const COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

const initialBudgets: Budget[] = [
  { id: "1", name: "Office Supplies", category: "Expense", allocated: 15000, spent: 8500, period: "Monthly", startDate: "2026-04-01", color: COLORS[0] },
  { id: "2", name: "Marketing", category: "Expense", allocated: 50000, spent: 42000, period: "Monthly", startDate: "2026-04-01", color: COLORS[1] },
  { id: "3", name: "Rent & Utilities", category: "Expense", allocated: 30000, spent: 30000, period: "Monthly", startDate: "2026-04-01", color: COLORS[3] },
  { id: "4", name: "Travel", category: "Expense", allocated: 20000, spent: 5200, period: "Monthly", startDate: "2026-04-01", color: COLORS[2] },
  { id: "5", name: "Inventory Purchase", category: "Business", allocated: 100000, spent: 67000, period: "Monthly", startDate: "2026-04-01", color: COLORS[4] },
  { id: "6", name: "Staff Salary", category: "Expense", allocated: 200000, spent: 200000, period: "Monthly", startDate: "2026-04-01", color: COLORS[5] },
];

const BudgetPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [showCreate, setShowCreate] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Expense");
  const [formAllocated, setFormAllocated] = useState("");
  const [formSpent, setFormSpent] = useState("");
  const [formPeriod, setFormPeriod] = useState<"Monthly" | "Weekly" | "Yearly">("Monthly");

  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  const pieData = budgets.map(b => ({ name: b.name, value: b.spent }));
  const barData = budgets.map(b => ({ name: b.name.slice(0, 8), allocated: b.allocated, spent: b.spent }));

  const getProgress = (b: Budget) => Math.min((b.spent / b.allocated) * 100, 100);
  const getStatus = (b: Budget) => {
    const pct = getProgress(b);
    if (pct >= 100) return { label: "Over Budget", color: "text-destructive", icon: <AlertTriangle size={12} /> };
    if (pct >= 80) return { label: "Warning", color: "text-warning", icon: <AlertTriangle size={12} /> };
    return { label: "On Track", color: "text-success", icon: <CheckCircle2 size={12} /> };
  };

  const openCreate = () => {
    setFormName(""); setFormCategory("Expense"); setFormAllocated(""); setFormSpent(""); setFormPeriod("Monthly");
    setEditBudget(null); setShowCreate(true);
  };

  const openEdit = (b: Budget) => {
    setFormName(b.name); setFormCategory(b.category); setFormAllocated(String(b.allocated));
    setFormSpent(String(b.spent)); setFormPeriod(b.period);
    setEditBudget(b); setShowCreate(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formAllocated) {
      toast.error("Name and budget amount required"); return;
    }
    if (editBudget) {
      setBudgets(budgets.map(b => b.id === editBudget.id ? {
        ...b, name: formName, category: formCategory,
        allocated: parseFloat(formAllocated), spent: parseFloat(formSpent) || 0, period: formPeriod,
      } : b));
      toast.success("Budget updated");
    } else {
      setBudgets([...budgets, {
        id: Date.now().toString(), name: formName, category: formCategory,
        allocated: parseFloat(formAllocated), spent: parseFloat(formSpent) || 0,
        period: formPeriod, startDate: new Date().toISOString().split("T")[0],
        color: COLORS[budgets.length % COLORS.length],
      }]);
      toast.success("Budget created");
    }
    setShowCreate(false);
  };

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
    toast.success("Budget deleted");
  };

  const ModalShell = ({ show, title, onClose, children }: { show: boolean; title: string; onClose: () => void; children: React.ReactNode }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
        <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl animate-in slide-in-from-bottom max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-5 pb-3 shrink-0">
            <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
            <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
          </div>
          <div className="overflow-y-auto px-5 pb-5 flex-1">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <AppShell headerTitle="Budget Management">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <Wallet size={16} className="mx-auto text-primary mb-1" />
          <p className="text-sm font-bold text-card-foreground">NPR {(totalAllocated / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-muted-foreground">Total Budget</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <TrendingDown size={16} className="mx-auto text-destructive mb-1" />
          <p className="text-sm font-bold text-card-foreground">NPR {(totalSpent / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-muted-foreground">Spent</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <TrendingUp size={16} className="mx-auto text-success mb-1" />
          <p className="text-sm font-bold text-card-foreground">NPR {(totalRemaining / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-muted-foreground">Remaining</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mx-4 mt-3 bg-card border border-border rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Overall Budget Usage</span>
          <span className="text-sm font-bold text-card-foreground">{Math.round((totalSpent / totalAllocated) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              (totalSpent / totalAllocated) >= 1 ? "bg-destructive" : (totalSpent / totalAllocated) >= 0.8 ? "bg-warning" : "bg-primary"
            }`}
            style={{ width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-2 px-4 mt-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Spending Distribution</p>
          <ResponsiveContainer width="100%" height={120}>
            <RPieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={50} dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={budgets[i]?.color || COLORS[i % COLORS.length]} />)}
              </Pie>
            </RPieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Budget vs Spent</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={barData.slice(0, 4)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} />
              <Bar dataKey="allocated" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="spent" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget List */}
      <SectionHeader title="Budgets" />
      <div className="mx-4 space-y-2 pb-24">
        {budgets.map(b => {
          const status = getStatus(b);
          const pct = getProgress(b);
          return (
            <div key={b.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground">{b.category} • {b.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`flex items-center gap-0.5 text-[10px] font-medium ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                  <button onClick={() => openEdit(b)} className="p-1"><Edit2 size={12} className="text-muted-foreground" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-1"><Trash2 size={12} className="text-destructive" /></button>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>NPR {b.spent.toLocaleString()} spent</span>
                <span>NPR {b.allocated.toLocaleString()} budget</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button onClick={openCreate} className="fixed bottom-20 right-4 z-40 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
        <Plus size={24} />
      </button>

      {/* Create/Edit Modal */}
      <ModalShell show={showCreate} title={editBudget ? "Edit Budget" : "Create Budget"} onClose={() => setShowCreate(false)}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Name</label>
            <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Budget name"
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
            <select value={formCategory} onChange={e => setFormCategory(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Expense</option>
              <option>Business</option>
              <option>Personal</option>
              <option>Investment</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Budget Amount</label>
              <input value={formAllocated} onChange={e => setFormAllocated(e.target.value)} type="number" placeholder="0"
                className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">Spent</label>
              <input value={formSpent} onChange={e => setFormSpent(e.target.value)} type="number" placeholder="0"
                className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Period</label>
            <select value={formPeriod} onChange={e => setFormPeriod(e.target.value as any)}
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm">
            {editBudget ? "Update Budget" : "Create Budget"}
          </button>
        </div>
      </ModalShell>
    </AppShell>
  );
};

export default BudgetPage;

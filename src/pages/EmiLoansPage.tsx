import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AlertTriangle, Calendar, CreditCard, Smartphone, Car, Plus, X } from "lucide-react";

const initialPlans = [
  { id: 1, name: "iPhone 15 Pro", type: "Product EMI", icon: "Smartphone" as const, totalAmount: 180000, paidAmount: 90000, nextDue: "25 Mar 2026", nextAmount: 15000, status: "active" as const, tenure: "12 months", remaining: 6 },
  { id: 2, name: "Personal Bank Loan", type: "Bank Loan", icon: "CreditCard" as const, totalAmount: 500000, paidAmount: 200000, nextDue: "01 Apr 2026", nextAmount: 25000, status: "active" as const, tenure: "24 months", remaining: 12 },
  { id: 3, name: "Honda Activa", type: "Vehicle Finance", icon: "Car" as const, totalAmount: 120000, paidAmount: 120000, nextDue: "-", nextAmount: 0, status: "closed" as const, tenure: "18 months", remaining: 0 },
];

const iconMap = { Smartphone, CreditCard, Car };

const EmiLoansPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState(initialPlans);
  const [editingPlan, setEditingPlan] = useState<typeof initialPlans[0] | null>(null);

  const [fName, setFName] = useState("");
  const [fType, setFType] = useState("Product EMI");
  const [fTotal, setFTotal] = useState("");
  const [fEmi, setFEmi] = useState("");
  const [fTenure, setFTenure] = useState("");
  const [fRate, setFRate] = useState("");
  const [fDate, setFDate] = useState("");
  const [fLender, setFLender] = useState("");
  const [fNotes, setFNotes] = useState("");

  const activePlans = plans.filter(p => p.status === "active");
  const totalOutstanding = activePlans.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);
  const upcomingDues = activePlans.reduce((sum, p) => sum + p.nextAmount, 0);

  const openNew = () => {
    setEditingPlan(null);
    setFName(""); setFType("Product EMI"); setFTotal(""); setFEmi(""); setFTenure(""); setFRate(""); setFDate(""); setFLender(""); setFNotes("");
    setShowForm(true);
  };

  const openEdit = (plan: typeof initialPlans[0]) => {
    setEditingPlan(plan);
    setFName(plan.name); setFType(plan.type); setFTotal(plan.totalAmount.toString());
    setFEmi(plan.nextAmount.toString()); setFTenure(plan.tenure.replace(" months", ""));
    setFRate(""); setFDate(""); setFLender(""); setFNotes("");
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? {
        ...p,
        name: fName || p.name,
        type: fType,
        totalAmount: fTotal ? parseInt(fTotal) : p.totalAmount,
        nextAmount: fEmi ? parseInt(fEmi) : p.nextAmount,
        tenure: fTenure ? `${fTenure} months` : p.tenure,
      } : p));
    }
    setShowForm(false);
    setEditingPlan(null);
  };

  const handleDelete = () => {
    if (editingPlan) setPlans(prev => prev.filter(p => p.id !== editingPlan.id));
    setShowForm(false);
    setEditingPlan(null);
  };

  return (
    <AppShell headerTitle="EMI & Loans">
      <div className="px-4 pt-4 space-y-3">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-card-foreground">Upcoming Dues</p>
            <p className="text-xs text-muted-foreground">NPR {upcomingDues.toLocaleString()} due this week</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Outstanding</p>
          <p className="text-lg font-bold text-card-foreground">NPR {totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Active Plans</p>
          <p className="text-lg font-bold text-primary">{activePlans.length}</p>
        </div>
      </div>

      <SectionHeader title="Active Plans" />
      <div className="px-4 space-y-3">
        {plans.map(plan => {
          const Icon = iconMap[plan.icon];
          const progress = (plan.paidAmount / plan.totalAmount) * 100;
          return (
            <button key={plan.id} onClick={() => openEdit(plan)} className="w-full text-left bg-card rounded-xl border border-border p-4 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-card-foreground">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">{plan.type} • {plan.tenure}</p>
                </div>
                {plan.status === "closed" ? (
                  <span className="text-[10px] font-semibold bg-success/15 text-success px-2 py-0.5 rounded">CLOSED</span>
                ) : (
                  <span className="text-[10px] font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded">ACTIVE</span>
                )}
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Paid: NPR {plan.paidAmount.toLocaleString()}</span>
                  <span>Total: NPR {plan.totalAmount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              {plan.status === "active" && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} /><span>Next: {plan.nextDue}</span>
                  </div>
                  <p className="text-sm font-semibold text-card-foreground">NPR {plan.nextAmount.toLocaleString()}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-4 pt-4 pb-4">
        <button onClick={openNew} className="w-full border-2 border-dashed border-primary/30 text-primary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">{editingPlan ? "Edit Plan" : "New EMI / Loan"}</h2>
              <button onClick={() => { setShowForm(false); setEditingPlan(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input value={fName} onChange={e => setFName(e.target.value)} placeholder="Plan Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={fType} onChange={e => setFType(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Product EMI</option><option>Bank Loan</option><option>Vehicle Finance</option><option>Personal Loan</option><option>Other</option>
              </select>
              <input value={fTotal} onChange={e => setFTotal(e.target.value)} placeholder="Total Amount (NPR) *" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={fEmi} onChange={e => setFEmi(e.target.value)} placeholder="EMI Amount (NPR) *" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-3">
                <input value={fTenure} onChange={e => setFTenure(e.target.value)} placeholder="Tenure (months)" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input value={fRate} onChange={e => setFRate(e.target.value)} placeholder="Interest Rate %" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <input value={fDate} onChange={e => setFDate(e.target.value)} type="date" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={fLender} onChange={e => setFLender(e.target.value)} placeholder="Lender / Provider" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Notes" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                {editingPlan ? "Update Plan" : "Create Plan"}
              </button>
              {editingPlan && (
                <button onClick={handleDelete} className="w-full border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm">
                  Delete Plan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default EmiLoansPage;
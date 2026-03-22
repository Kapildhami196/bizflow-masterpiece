import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AlertTriangle, Calendar, CheckCircle2, CreditCard, Smartphone, Car } from "lucide-react";

const plans = [
  { id: 1, name: "iPhone 15 Pro", type: "Product EMI", icon: Smartphone, totalAmount: 180000, paidAmount: 90000, nextDue: "25 Mar 2026", nextAmount: 15000, status: "active" as const, tenure: "12 months", remaining: 6 },
  { id: 2, name: "Personal Bank Loan", type: "Bank Loan", icon: CreditCard, totalAmount: 500000, paidAmount: 200000, nextDue: "01 Apr 2026", nextAmount: 25000, status: "active" as const, tenure: "24 months", remaining: 12 },
  { id: 3, name: "Honda Activa", type: "Vehicle Finance", icon: Car, totalAmount: 120000, paidAmount: 120000, nextDue: "-", nextAmount: 0, status: "closed" as const, tenure: "18 months", remaining: 0 },
];

const EmiLoansPage = () => {
  const activePlans = plans.filter(p => p.status === "active");
  const totalOutstanding = activePlans.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);
  const upcomingDues = activePlans.reduce((sum, p) => sum + p.nextAmount, 0);

  return (
    <AppShell headerTitle="EMI & Loans">
      {/* Due Cards */}
      <div className="px-4 pt-4 space-y-3">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-card-foreground">Upcoming Dues</p>
            <p className="text-xs text-muted-foreground">NPR {upcomingDues.toLocaleString()} due this week</p>
          </div>
        </div>
      </div>

      {/* Summary */}
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

      {/* Active Plans */}
      <SectionHeader title="Active Plans" />
      <div className="px-4 space-y-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const progress = (plan.paidAmount / plan.totalAmount) * 100;
          return (
            <div key={plan.id} className="bg-card rounded-xl border border-border p-4">
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

              {/* Progress bar */}
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
                    <Calendar size={12} />
                    <span>Next: {plan.nextDue}</span>
                  </div>
                  <p className="text-sm font-semibold text-card-foreground">NPR {plan.nextAmount.toLocaleString()}</p>
                </div>
              )}

              {plan.status === "active" && (
                <button className="mt-3 w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium">
                  Pay Installment
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Plan Button */}
      <div className="px-4 pt-4 pb-4">
        <button className="w-full border-2 border-dashed border-primary/30 text-primary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          Create New Plan
        </button>
      </div>
    </AppShell>
  );
};

export default EmiLoansPage;

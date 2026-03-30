import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Check, Crown, Zap, Star, X, CreditCard, Calendar, ArrowRight } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "Forever",
    icon: <Zap size={20} />,
    color: "text-muted-foreground",
    features: ["1 Business", "Basic POS", "50 Products", "100 Transactions/mo", "Email Support"],
  },
  {
    id: "silver",
    name: "Silver",
    price: 499,
    period: "/month",
    icon: <Star size={20} />,
    color: "text-card-foreground",
    features: ["3 Businesses", "Full POS", "500 Products", "Unlimited Transactions", "Invoice Templates", "Reports", "Priority Support"],
  },
  {
    id: "gold",
    name: "Gold",
    price: 999,
    period: "/month",
    icon: <Crown size={20} />,
    color: "text-warning",
    features: ["10 Businesses", "Full POS + Multi-counter", "Unlimited Products", "Unlimited Transactions", "All Invoice Templates", "Advanced Reports", "Inventory Alerts", "Multi-user (5 staff)", "Phone Support"],
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 1999,
    period: "/month",
    icon: <Crown size={20} />,
    color: "text-primary",
    features: ["Unlimited Businesses", "Full POS + Multi-counter", "Unlimited Everything", "Custom Invoice Branding", "Advanced Analytics", "API Access", "Unlimited Staff", "Dedicated Support", "White-label Option"],
  },
];

const SubscriptionPage = () => {
  const [currentPlan] = useState("platinum");
  const [showConfirm, setShowConfirm] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <AppShell headerTitle="Subscription">
      {/* Current Plan Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Crown size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Current Plan</p>
            <p className="text-lg font-bold text-card-foreground capitalize">{currentPlan}</p>
            <p className="text-[10px] text-muted-foreground">Renews on April 15, 2026</p>
          </div>
          <span className="text-[10px] font-semibold bg-success/15 text-success px-2 py-0.5 rounded-full">Active</span>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-2 px-4 pt-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${billingCycle === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${billingCycle === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Yearly <span className="text-[9px] ml-1 opacity-75">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="px-4 pt-3 pb-4 space-y-3">
        {plans.map(plan => {
          const isActive = plan.id === currentPlan;
          const displayPrice = billingCycle === "yearly" && plan.price > 0
            ? Math.round(plan.price * 12 * 0.8)
            : plan.price;
          const displayPeriod = plan.price === 0 ? "Forever" : billingCycle === "yearly" ? "/year" : "/month";

          return (
            <div key={plan.id} className={`bg-card border rounded-xl p-4 relative ${isActive ? "border-primary" : plan.popular ? "border-warning/50" : "border-border"}`}>
              {plan.popular && (
                <span className="absolute -top-2.5 right-4 text-[9px] font-bold bg-warning text-warning-foreground px-2 py-0.5 rounded-full">
                  MOST POPULAR
                </span>
              )}
              {isActive && (
                <span className="absolute -top-2.5 left-4 text-[9px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  CURRENT PLAN
                </span>
              )}

              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-accent flex items-center justify-center ${plan.color}`}>
                  {plan.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-bold text-card-foreground">{plan.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-primary">NPR {displayPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground ml-0.5">{displayPeriod}</span>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-center gap-1.5">
                        <Check size={10} className="text-success shrink-0" />
                        <span className="text-[11px] text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => setShowConfirm(plan)}
                      className="mt-3 w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-primary text-primary-foreground"
                    >
                      {plan.price > plans.find(p => p.id === currentPlan)!.price ? "Upgrade" : "Switch"} to {plan.name}
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Billing History */}
      <div className="px-4 pb-4">
        <p className="text-xs font-semibold text-card-foreground mb-2">Billing History</p>
        <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
          {[
            { date: "Mar 15, 2026", amount: 1999, status: "Paid" },
            { date: "Feb 15, 2026", amount: 1999, status: "Paid" },
            { date: "Jan 15, 2026", amount: 1999, status: "Paid" },
          ].map((bill, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard size={14} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-card-foreground">Platinum Plan</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Calendar size={10} /> {bill.date}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-card-foreground">NPR {bill.amount.toLocaleString()}</p>
                <span className="text-[9px] font-semibold text-success">{bill.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">Confirm Plan Change</h2>
              <button onClick={() => setShowConfirm(null)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="bg-accent rounded-xl p-4 mb-4">
              <p className="text-sm text-card-foreground">Switch to <span className="font-bold">{showConfirm.name}</span> plan?</p>
              <p className="text-xs text-muted-foreground mt-1">
                {showConfirm.price > 0
                  ? `You'll be charged NPR ${(billingCycle === "yearly" ? Math.round(showConfirm.price * 12 * 0.8) : showConfirm.price).toLocaleString()} ${billingCycle}.`
                  : "This plan is free forever."}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(null)} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground">Cancel</button>
              <button onClick={() => { setShowConfirm(null); }} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default SubscriptionPage;

import { Bell, Plus, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { QuickActionCard } from "@/components/shared/QuickActionCard";
import { SectionHeader } from "@/components/shared/SectionHeader";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      {/* Header */}
      <header className="bg-header text-header-foreground px-4 pt-4 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-sm font-bold">eL</span>
            </div>
            <div>
              <p className="text-xs opacity-80">Good Evening</p>
              <p className="text-lg font-bold">My Business</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-primary-foreground/10">
              <Bell size={20} />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold"
            >
              KD
            </button>
          </div>
        </div>
      </header>

      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-20 -mt-2">
        {/* Business Summary Cards */}
        <div className="grid grid-cols-2 gap-3 px-4 pt-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
                <TrendingUp size={16} className="text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">To Receive</p>
            <p className="text-lg font-bold text-success">NPR 1,25,000</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center">
                <TrendingDown size={16} className="text-destructive" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">To Pay</p>
            <p className="text-lg font-bold text-destructive">NPR 45,000</p>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-2 px-4 pt-3">
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <ArrowDownLeft size={16} className="text-success mx-auto mb-1" />
            <p className="text-sm font-bold text-card-foreground">₹12,500</p>
            <p className="text-[10px] text-muted-foreground">Today In</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <ArrowUpRight size={16} className="text-destructive mx-auto mb-1" />
            <p className="text-sm font-bold text-card-foreground">₹3,200</p>
            <p className="text-[10px] text-muted-foreground">Today Out</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <AlertCircle size={16} className="text-warning mx-auto mb-1" />
            <p className="text-sm font-bold text-card-foreground">7</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <div className="px-4 grid grid-cols-4 gap-3">
          <QuickActionCard
            icon={<Plus size={22} />}
            label="Add Sale"
          />
          <QuickActionCard
            icon={<ArrowDownLeft size={22} />}
            label="Collection"
          />
          <QuickActionCard
            icon={<ArrowUpRight size={22} />}
            label="Payment"
          />
          <QuickActionCard
            icon={<Wallet size={22} />}
            label="Accounts"
            onClick={() => navigate("/accounts")}
          />
        </div>

        {/* Due Today Cards */}
        <SectionHeader title="Due Today" actionLabel="View All" />
        <div className="px-4 space-y-2">
          {[
            { name: "Ram Kumar", amount: "15,000", type: "receivable", days: "Due today" },
            { name: "Shyam Store", amount: "8,500", type: "payable", days: "Due today" },
            { name: "Sita Devi", amount: "5,000", type: "receivable", days: "Overdue 3 days" },
          ].map((item, idx) => (
            <div key={idx} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{item.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.days}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${item.type === "receivable" ? "text-success" : "text-destructive"}`}>
                  NPR {item.amount}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {item.type === "receivable" ? "To Receive" : "To Pay"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <SectionHeader title="Recent Transactions" actionLabel="View All" onAction={() => navigate("/transactions")} />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
          {[
            { name: "Sale - Ram Kumar", amount: "7,500", type: "in", date: "Today, 2:30 PM", category: "Sale" },
            { name: "Purchase - Pokhara Traders", amount: "12,000", type: "out", date: "Today, 11:15 AM", category: "Purchase" },
            { name: "Collection - Hari Bahadur", amount: "3,200", type: "in", date: "Yesterday", category: "Collection" },
            { name: "Expense - Electricity", amount: "2,500", type: "out", date: "Yesterday", category: "Expense" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-4 py-3.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                item.type === "in" ? "bg-success/15" : "bg-destructive/15"
              }`}>
                {item.type === "in" ? (
                  <ArrowDownLeft size={14} className="text-success" />
                ) : (
                  <ArrowUpRight size={14} className="text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">{item.date} • {item.category}</p>
              </div>
              <p className={`text-sm font-semibold ${item.type === "in" ? "text-success" : "text-destructive"}`}>
                {item.type === "in" ? "+" : "-"} ₹{item.amount}
              </p>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;

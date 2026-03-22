import { Bell, Eye, User, ChevronDown, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { QuickActionCard } from "@/components/shared/QuickActionCard";
import { TransactionItem } from "@/components/shared/TransactionItem";
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
              <p className="text-lg font-bold">PARAS</p>
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
              PD
            </button>
          </div>
        </div>
      </header>

      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-20 -mt-2">
        {/* Account Card */}
        <div className="mx-4 bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
            General Savings
          </div>
          <p className="text-xs text-muted-foreground mb-2">0822501517015017</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">NPR</span>
            <span className="text-2xl font-bold text-card-foreground">6,765.19</span>
            <button className="text-muted-foreground">
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pt-4">
          <div className="grid grid-cols-4 gap-3">
            <QuickActionCard
              icon={<User size={22} />}
              label="My Profile"
              onClick={() => navigate("/profile")}
            />
            <QuickActionCard
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>}
              label="My Accounts"
              onClick={() => navigate("/accounts")}
            />
            <QuickActionCard
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              label="Statement"
            />
            <QuickActionCard
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
              label="Reports"
            />
          </div>
        </div>

        {/* Edit Menu */}
        <div className="flex items-center justify-center gap-4 py-3">
          <button className="text-muted-foreground">
            <ChevronDown size={20} />
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium">
            <Pencil size={14} />
            Edit Menu
          </button>
        </div>

        {/* Digital Transactions */}
        <SectionHeader title="Digital Transactions" actionLabel="View All" />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
          <TransactionItem
            icon={<span className="text-xs font-bold text-primary">e</span>}
            name="ESEWA"
            date="18 Mar, 2026 09:43 PM"
            description="Paid for ESEWA"
            amount="7,010.0"
            isDebit
          />
          <TransactionItem
            icon={<span className="text-xs font-bold text-primary">e</span>}
            name="ESEWA"
            date="17 Mar, 2026 10:40 AM"
            description="Paid for ESEWA"
            amount="73.0"
            isDebit
          />
          <TransactionItem
            icon={<span className="text-xs font-bold text-primary">e</span>}
            name="ESEWA"
            date="17 Mar, 2026 10:39 AM"
            description="Paid for ESEWA"
            amount="719.0"
            isDebit
          />
          <TransactionItem
            icon={<span className="text-[10px] font-bold bg-warning text-warning-foreground w-full h-full rounded-full flex items-center justify-center">I</span>}
            name="Internal Fund Transfer"
            date="17 Mar, 2026 07:46 AM"
            description="Paid for 0210702028357017"
            amount="6,000.0"
            isDebit
          />
          <TransactionItem
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><rect x="2" y="4" width="20" height="16" rx="2"/></svg>}
            name="NT Prepaid Topup"
            date="16 Mar, 2026"
            description="Prepaid recharge"
            amount="50.0"
            isDebit
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;

import { useNavigate } from "react-router-dom";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { QuickActionCard } from "@/components/shared/QuickActionCard";
import { FileText, Share2, BookCheck, Eye } from "lucide-react";

const AccountsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      {/* Header */}
      <header className="bg-header text-header-foreground px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 className="text-lg font-semibold">Accounts</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center bg-primary-foreground/10">
            <span className="text-xl font-bold">PD</span>
          </div>
          <div>
            <p className="text-xl font-bold">PARAS DHAMI</p>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
              9868569297
            </div>
          </div>
        </div>
      </header>

      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-8 -mt-2">
        {/* Account Card */}
        <div className="mx-4 bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
              <span className="text-sm text-card-foreground">General Savings</span>
            </div>
            <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded">Primary</span>
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

        {/* Account Quick Actions */}
        <div className="px-4 pt-4">
          <div className="grid grid-cols-3 gap-3">
            <QuickActionCard icon={<FileText size={22} />} label="Statement" />
            <QuickActionCard icon={<Share2 size={22} />} label="Share Info" />
            <QuickActionCard icon={<BookCheck size={22} />} label="Cheque Book Request" />
          </div>
        </div>

        {/* Account Details */}
        <div className="mx-4 mt-4 bg-card rounded-xl border border-border overflow-hidden">
          {[
            { label: "Actual Balance", value: "NPR 7,265.19" },
            { label: "Available Balance", value: "NPR 6,765.19" },
            { label: "Accrued Interest", value: "NPR 21.68" },
            { label: "Interest Rate", value: "2.75 %" },
            { label: "Account Holder's Name", value: "PARAS DHAMI" },
            { label: "Account Status", value: "Active", badge: true },
            { label: "Branch", value: "Branch Office Dhangadhi" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              {item.badge ? (
                <span className="text-xs font-semibold bg-blue-500 text-white px-2 py-0.5 rounded">{item.value}</span>
              ) : (
                <span className="text-sm font-semibold text-card-foreground">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AccountsPage;

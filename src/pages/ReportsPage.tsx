import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MenuListItem } from "@/components/shared/MenuListItem";
import {
  TrendingUp, TrendingDown, BarChart3, PieChart, Users,
  FileText, Download, Calendar, CreditCard, Package,
} from "lucide-react";

const ReportsPage = () => {
  return (
    <AppShell headerTitle="Reports">
      {/* Period Summary */}
      <div className="px-4 pt-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-card-foreground">This Month</p>
            <button className="flex items-center gap-1 text-xs text-primary font-medium">
              <Calendar size={12} />
              Mar 2026
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={14} className="text-success" />
                <span className="text-[10px] text-muted-foreground">Total Income</span>
              </div>
              <p className="text-lg font-bold text-success">₹2,45,000</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown size={14} className="text-destructive" />
                <span className="text-[10px] text-muted-foreground">Total Expense</span>
              </div>
              <p className="text-lg font-bold text-destructive">₹1,82,000</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Net Profit</span>
              <span className="text-lg font-bold text-success">₹63,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Reports */}
      <SectionHeader title="Business Reports" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem icon={<BarChart3 size={18} />} title="Sales Report" subtitle="Daily, weekly, monthly sales summary" />
        <MenuListItem icon={<Users size={18} />} title="Party Balances" subtitle="Customer & supplier outstanding" />
        <MenuListItem icon={<TrendingUp size={18} />} title="Collection Report" subtitle="Payment received history" />
        <MenuListItem icon={<TrendingDown size={18} />} title="Payment Report" subtitle="Payment made history" />
      </div>

      {/* Financial Reports */}
      <SectionHeader title="Financial Reports" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem icon={<PieChart size={18} />} title="Category Summary" subtitle="Income & expense by category" />
        <MenuListItem icon={<FileText size={18} />} title="Account Statement" subtitle="Account-wise transaction history" />
        <MenuListItem icon={<CreditCard size={18} />} title="EMI & Loan Report" subtitle="Active plans, dues, penalties" />
      </div>

      {/* Inventory Reports */}
      <SectionHeader title="Inventory Reports" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
        <MenuListItem icon={<Package size={18} />} title="Stock Report" subtitle="Current stock & valuation" />
        <MenuListItem icon={<Download size={18} />} title="Export Data" subtitle="Export reports as CSV / PDF" />
      </div>
    </AppShell>
  );
};

export default ReportsPage;

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MenuListItem } from "@/components/shared/MenuListItem";
import {
  TrendingUp, TrendingDown, BarChart3, PieChart, Users,
  FileText, Download, Calendar, CreditCard, Package,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, AreaChart, Area, Legend,
  LineChart, Line,
} from "recharts";

const monthlyData = [
  { month: "Oct", income: 185000, expense: 142000 },
  { month: "Nov", income: 210000, expense: 168000 },
  { month: "Dec", income: 195000, expense: 155000 },
  { month: "Jan", income: 225000, expense: 170000 },
  { month: "Feb", income: 238000, expense: 175000 },
  { month: "Mar", income: 245000, expense: 182000 },
];

const categoryData = [
  { name: "Sales", value: 45, color: "hsl(152, 60%, 36%)" },
  { name: "Services", value: 25, color: "hsl(152, 60%, 24%)" },
  { name: "Rent", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "Salary", value: 10, color: "hsl(0, 72%, 51%)" },
  { name: "Others", value: 5, color: "hsl(150, 5%, 45%)" },
];

const dailyCashFlow = [
  { day: "Mon", inflow: 42000, outflow: 28000 },
  { day: "Tue", inflow: 38000, outflow: 32000 },
  { day: "Wed", inflow: 55000, outflow: 22000 },
  { day: "Thu", inflow: 35000, outflow: 41000 },
  { day: "Fri", inflow: 48000, outflow: 35000 },
  { day: "Sat", inflow: 62000, outflow: 30000 },
  { day: "Sun", inflow: 15000, outflow: 8000 },
];

const profitTrend = [
  { month: "Oct", profit: 43000 },
  { month: "Nov", profit: 42000 },
  { month: "Dec", profit: 40000 },
  { month: "Jan", profit: 55000 },
  { month: "Feb", profit: 63000 },
  { month: "Mar", profit: 63000 },
];

const chartTabs = ["Overview", "Income vs Expense", "Categories", "Cash Flow"] as const;

const ReportsPage = () => {
  const [activeChart, setActiveChart] = useState<typeof chartTabs[number]>("Overview");

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

      {/* Chart Tabs */}
      <div className="flex gap-2 px-4 pt-4 overflow-x-auto no-scrollbar">
        {chartTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveChart(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeChart === tab
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="px-4 pt-3">
        <div className="bg-card rounded-xl border border-border p-4">
          {activeChart === "Overview" && (
            <>
              <p className="text-sm font-semibold text-card-foreground mb-1">Profit Trend</p>
              <p className="text-[10px] text-muted-foreground mb-4">Last 6 months net profit</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={profitTrend}>
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152, 60%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(152, 60%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Profit"]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(150, 10%, 90%)", fontSize: 12 }} />
                  <Area type="monotone" dataKey="profit" stroke="hsl(152, 60%, 36%)" fill="url(#profitGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(152, 60%, 36%)", strokeWidth: 2, stroke: "white" }} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}

          {activeChart === "Income vs Expense" && (
            <>
              <p className="text-sm font-semibold text-card-foreground mb-1">Income vs Expense</p>
              <p className="text-[10px] text-muted-foreground mb-4">Monthly comparison</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(150, 10%, 90%)", fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="income" name="Income" fill="hsl(152, 60%, 36%)" radius={[6, 6, 0, 0]} barSize={16} />
                  <Bar dataKey="expense" name="Expense" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {activeChart === "Categories" && (
            <>
              <p className="text-sm font-semibold text-card-foreground mb-1">Expense Breakdown</p>
              <p className="text-[10px] text-muted-foreground mb-4">By category this month</p>
              <ResponsiveContainer width="100%" height={200}>
                <RPieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(150, 10%, 90%)", fontSize: 12 }} />
                </RPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[10px] text-muted-foreground">{c.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeChart === "Cash Flow" && (
            <>
              <p className="text-sm font-semibold text-card-foreground mb-1">Daily Cash Flow</p>
              <p className="text-[10px] text-muted-foreground mb-4">This week inflow vs outflow</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dailyCashFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 90%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(150, 10%, 90%)", fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="inflow" name="Inflow" stroke="hsl(152, 60%, 36%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(152, 60%, 36%)", strokeWidth: 2, stroke: "white" }} />
                  <Line type="monotone" dataKey="outflow" name="Outflow" stroke="hsl(0, 72%, 51%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(0, 72%, 51%)", strokeWidth: 2, stroke: "white" }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
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
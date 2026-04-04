import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MenuListItem } from "@/components/shared/MenuListItem";
import {
  TrendingUp, TrendingDown, BarChart3, PieChart, Users,
  FileText, Download, Calendar, CreditCard, Package,
  X, ArrowLeft, Filter,
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

// Detailed report data
const salesReportData = {
  daily: [
    { day: "1 Mar", amount: 12500 }, { day: "5 Mar", amount: 18200 }, { day: "10 Mar", amount: 15800 },
    { day: "15 Mar", amount: 22100 }, { day: "20 Mar", amount: 19500 }, { day: "25 Mar", amount: 28000 },
    { day: "30 Mar", amount: 31200 },
  ],
  summary: { totalSales: 245000, avgDaily: 8167, bestDay: "30 Mar", totalOrders: 342 },
};

const partyBalances = [
  { name: "Sharma Electronics", type: "Customer", receivable: 45000, payable: 0 },
  { name: "Nepal Traders", type: "Supplier", receivable: 0, payable: 32000 },
  { name: "Kathmandu Store", type: "Customer", receivable: 28000, payable: 0 },
  { name: "Pokhara Supplies", type: "Supplier", receivable: 0, payable: 18500 },
  { name: "Lalitpur Mart", type: "Customer", receivable: 15000, payable: 5000 },
  { name: "Bhaktapur Goods", type: "Supplier", receivable: 8000, payable: 22000 },
];

const collectionData = [
  { month: "Oct", collected: 165000 }, { month: "Nov", collected: 192000 },
  { month: "Dec", collected: 178000 }, { month: "Jan", collected: 210000 },
  { month: "Feb", collected: 225000 }, { month: "Mar", collected: 232000 },
];

const paymentData = [
  { month: "Oct", paid: 138000 }, { month: "Nov", paid: 155000 },
  { month: "Dec", paid: 148000 }, { month: "Jan", paid: 162000 },
  { month: "Feb", paid: 170000 }, { month: "Mar", paid: 175000 },
];

const incomeCategories = [
  { name: "Product Sales", value: 155000, pct: 63 },
  { name: "Service Revenue", value: 52000, pct: 21 },
  { name: "Commissions", value: 22000, pct: 9 },
  { name: "Other Income", value: 16000, pct: 7 },
];

const expenseCategories = [
  { name: "Purchases", value: 72000, pct: 40 },
  { name: "Salary & Wages", value: 45000, pct: 25 },
  { name: "Rent & Utilities", value: 28000, pct: 15 },
  { name: "Transport", value: 18000, pct: 10 },
  { name: "Miscellaneous", value: 19000, pct: 10 },
];

const accountStatement = [
  { date: "01 Mar", desc: "Opening Balance", debit: 0, credit: 0, balance: 125000 },
  { date: "03 Mar", desc: "Sales - Sharma Electronics", debit: 0, credit: 45000, balance: 170000 },
  { date: "05 Mar", desc: "Purchase - Nepal Traders", debit: 32000, credit: 0, balance: 138000 },
  { date: "10 Mar", desc: "Salary Payment", debit: 45000, credit: 0, balance: 93000 },
  { date: "15 Mar", desc: "Service Revenue", debit: 0, credit: 52000, balance: 145000 },
  { date: "20 Mar", desc: "Rent Payment", debit: 15000, credit: 0, balance: 130000 },
  { date: "25 Mar", desc: "Sales - Kathmandu Store", debit: 0, credit: 28000, balance: 158000 },
  { date: "30 Mar", desc: "Closing Balance", debit: 0, credit: 0, balance: 158000 },
];

const emiReport = [
  { name: "Laptop EMI", total: 120000, paid: 80000, remaining: 40000, nextDue: "15 Apr 2026", status: "On Track" },
  { name: "Shop Loan", total: 500000, paid: 300000, remaining: 200000, nextDue: "01 Apr 2026", status: "Due Soon" },
  { name: "Vehicle Loan", total: 350000, paid: 350000, remaining: 0, nextDue: "-", status: "Completed" },
];

const stockReport = [
  { name: "Rice (Basmati)", qty: 250, unit: "kg", value: 37500, status: "In Stock" },
  { name: "Sugar", qty: 15, unit: "kg", value: 1200, status: "Low Stock" },
  { name: "Cooking Oil", qty: 80, unit: "ltr", value: 16000, status: "In Stock" },
  { name: "Flour", qty: 0, unit: "kg", value: 0, status: "Out of Stock" },
  { name: "Tea Leaves", qty: 45, unit: "kg", value: 22500, status: "In Stock" },
  { name: "Salt", qty: 8, unit: "kg", value: 240, status: "Low Stock" },
];

type ReportKey = "sales" | "party" | "collection" | "payment" | "category" | "account" | "emi" | "stock" | null;

const chartTabs = ["Overview", "Income vs Expense", "Categories", "Cash Flow"] as const;

const ReportsPage = () => {
  const [activeChart, setActiveChart] = useState<typeof chartTabs[number]>("Overview");
  const [activeReport, setActiveReport] = useState<ReportKey>(null);
  const [reportPeriod, setReportPeriod] = useState("This Month");

  // If a detailed report is open
  if (activeReport) {
    return (
      <AppShell headerTitle={
        activeReport === "sales" ? "Sales Report" :
        activeReport === "party" ? "Party Balances" :
        activeReport === "collection" ? "Collection Report" :
        activeReport === "payment" ? "Payment Report" :
        activeReport === "category" ? "Category Summary" :
        activeReport === "account" ? "Account Statement" :
        activeReport === "emi" ? "EMI & Loan Report" :
        "Stock Report"
      }>
        <div className="px-4 pt-3">
          <button onClick={() => setActiveReport(null)} className="flex items-center gap-1.5 text-sm text-primary font-medium mb-3">
            <ArrowLeft size={16} /> Back to Reports
          </button>

          {/* Period Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {["Today", "This Week", "This Month", "This Quarter", "This Year"].map(p => (
              <button
                key={p}
                onClick={() => setReportPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors ${
                  reportPeriod === p ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Sales Report */}
        {activeReport === "sales" && (
          <div className="px-4 space-y-4 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-[10px] text-muted-foreground">Total Sales</p>
                <p className="text-lg font-bold text-success">₹{salesReportData.summary.totalSales.toLocaleString()}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-[10px] text-muted-foreground">Total Orders</p>
                <p className="text-lg font-bold text-card-foreground">{salesReportData.summary.totalOrders}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-[10px] text-muted-foreground">Avg Daily</p>
                <p className="text-lg font-bold text-card-foreground">₹{salesReportData.summary.avgDaily.toLocaleString()}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-[10px] text-muted-foreground">Best Day</p>
                <p className="text-lg font-bold text-primary">{salesReportData.summary.bestDay}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-card-foreground mb-3">Sales Trend</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={salesReportData.daily}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152, 60%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(152, 60%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 90%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Sales"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="amount" stroke="hsl(152, 60%, 36%)" fill="url(#salesGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(152, 60%, 36%)", strokeWidth: 2, stroke: "white" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Party Balances */}
        {activeReport === "party" && (
          <div className="px-4 space-y-4 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-[10px] text-muted-foreground">Total Receivable</p>
                <p className="text-lg font-bold text-success">₹{partyBalances.reduce((s, p) => s + p.receivable, 0).toLocaleString()}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-[10px] text-muted-foreground">Total Payable</p>
                <p className="text-lg font-bold text-destructive">₹{partyBalances.reduce((s, p) => s + p.payable, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              {partyBalances.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.type}</p>
                  </div>
                  <div className="text-right">
                    {p.receivable > 0 && <p className="text-sm font-semibold text-success">+₹{p.receivable.toLocaleString()}</p>}
                    {p.payable > 0 && <p className="text-sm font-semibold text-destructive">-₹{p.payable.toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-card-foreground mb-3">Receivable vs Payable</p>
              <ResponsiveContainer width="100%" height={180}>
                <RPieChart>
                  <Pie data={[
                    { name: "Receivable", value: partyBalances.reduce((s, p) => s + p.receivable, 0) },
                    { name: "Payable", value: partyBalances.reduce((s, p) => s + p.payable, 0) },
                  ]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    <Cell fill="hsl(152, 60%, 36%)" />
                    <Cell fill="hsl(0, 72%, 51%)" />
                  </Pie>
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </RPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Collection Report */}
        {activeReport === "collection" && (
          <div className="px-4 space-y-4 pb-6">
            <div className="bg-card rounded-xl border border-border p-3">
              <p className="text-[10px] text-muted-foreground">Total Collected (6 months)</p>
              <p className="text-lg font-bold text-success">₹{collectionData.reduce((s, c) => s + c.collected, 0).toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-card-foreground mb-3">Collection Trend</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="collected" name="Collected" fill="hsl(152, 60%, 36%)" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Payment Report */}
        {activeReport === "payment" && (
          <div className="px-4 space-y-4 pb-6">
            <div className="bg-card rounded-xl border border-border p-3">
              <p className="text-[10px] text-muted-foreground">Total Paid (6 months)</p>
              <p className="text-lg font-bold text-destructive">₹{paymentData.reduce((s, c) => s + c.paid, 0).toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-card-foreground mb-3">Payment Trend</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={paymentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(150, 5%, 45%)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="paid" name="Paid" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category Summary */}
        {activeReport === "category" && (
          <div className="px-4 space-y-4 pb-6">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-card-foreground mb-3">Income by Category</p>
              <ResponsiveContainer width="100%" height={180}>
                <RPieChart>
                  <Pie data={incomeCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {incomeCategories.map((_, i) => (
                      <Cell key={i} fill={["hsl(152, 60%, 36%)", "hsl(152, 60%, 48%)", "hsl(152, 40%, 60%)", "hsl(152, 30%, 72%)"][i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </RPieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {incomeCategories.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ["hsl(152, 60%, 36%)", "hsl(152, 60%, 48%)", "hsl(152, 40%, 60%)", "hsl(152, 30%, 72%)"][i] }} />
                      <span className="text-xs text-card-foreground">{c.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-card-foreground">₹{c.value.toLocaleString()} ({c.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-card-foreground mb-3">Expense by Category</p>
              <div className="space-y-3">
                {expenseCategories.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-card-foreground">{c.name}</span>
                      <span className="text-xs font-semibold text-card-foreground">₹{c.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-destructive transition-all" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Account Statement */}
        {activeReport === "account" && (
          <div className="px-4 space-y-4 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-[10px] text-muted-foreground">Total Debit</p>
                <p className="text-lg font-bold text-destructive">₹{accountStatement.reduce((s, a) => s + a.debit, 0).toLocaleString()}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-[10px] text-muted-foreground">Total Credit</p>
                <p className="text-lg font-bold text-success">₹{accountStatement.reduce((s, a) => s + a.credit, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 px-3 py-2 bg-muted text-[10px] font-semibold text-muted-foreground">
                <span className="col-span-2">Date</span>
                <span className="col-span-4">Description</span>
                <span className="col-span-2 text-right">Debit</span>
                <span className="col-span-2 text-right">Credit</span>
                <span className="col-span-2 text-right">Balance</span>
              </div>
              {accountStatement.map((row, i) => (
                <div key={i} className="grid grid-cols-12 px-3 py-2.5 border-t border-border text-[10px]">
                  <span className="col-span-2 text-muted-foreground">{row.date}</span>
                  <span className="col-span-4 text-card-foreground truncate">{row.desc}</span>
                  <span className="col-span-2 text-right text-destructive font-medium">{row.debit > 0 ? `₹${row.debit.toLocaleString()}` : "-"}</span>
                  <span className="col-span-2 text-right text-success font-medium">{row.credit > 0 ? `₹${row.credit.toLocaleString()}` : "-"}</span>
                  <span className="col-span-2 text-right font-semibold text-card-foreground">₹{row.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMI & Loan Report */}
        {activeReport === "emi" && (
          <div className="px-4 space-y-4 pb-6">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Active</p>
                <p className="text-lg font-bold text-primary">{emiReport.filter(e => e.status !== "Completed").length}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Paid</p>
                <p className="text-lg font-bold text-success">₹{(emiReport.reduce((s, e) => s + e.paid, 0) / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Remaining</p>
                <p className="text-lg font-bold text-destructive">₹{(emiReport.reduce((s, e) => s + e.remaining, 0) / 1000).toFixed(0)}k</p>
              </div>
            </div>
            {emiReport.map((e, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-card-foreground">{e.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    e.status === "Completed" ? "bg-success/15 text-success" :
                    e.status === "Due Soon" ? "bg-warning/15 text-warning" :
                    "bg-primary/10 text-primary"
                  }`}>{e.status}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(e.paid / e.total) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Paid: ₹{e.paid.toLocaleString()}</span>
                  <span>Total: ₹{e.total.toLocaleString()}</span>
                </div>
                {e.nextDue !== "-" && (
                  <p className="text-[10px] text-muted-foreground mt-1">Next due: {e.nextDue}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stock Report */}
        {activeReport === "stock" && (
          <div className="px-4 space-y-4 pb-6">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Items</p>
                <p className="text-lg font-bold text-card-foreground">{stockReport.length}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Low Stock</p>
                <p className="text-lg font-bold text-warning">{stockReport.filter(s => s.status === "Low Stock").length}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Value</p>
                <p className="text-lg font-bold text-primary">₹{(stockReport.reduce((s, r) => s + r.value, 0) / 1000).toFixed(0)}k</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              {stockReport.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.qty} {s.unit} • ₹{s.value.toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    s.status === "In Stock" ? "bg-success/15 text-success" :
                    s.status === "Low Stock" ? "bg-warning/15 text-warning" :
                    "bg-destructive/15 text-destructive"
                  }`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="px-4 pb-6">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </AppShell>
    );
  }

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
        <MenuListItem icon={<BarChart3 size={18} />} title="Sales Report" subtitle="Daily, weekly, monthly sales summary" onClick={() => setActiveReport("sales")} />
        <MenuListItem icon={<Users size={18} />} title="Party Balances" subtitle="Customer & supplier outstanding" onClick={() => setActiveReport("party")} />
        <MenuListItem icon={<TrendingUp size={18} />} title="Collection Report" subtitle="Payment received history" onClick={() => setActiveReport("collection")} />
        <MenuListItem icon={<TrendingDown size={18} />} title="Payment Report" subtitle="Payment made history" onClick={() => setActiveReport("payment")} />
      </div>

      {/* Financial Reports */}
      <SectionHeader title="Financial Reports" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem icon={<PieChart size={18} />} title="Category Summary" subtitle="Income & expense by category" onClick={() => setActiveReport("category")} />
        <MenuListItem icon={<FileText size={18} />} title="Account Statement" subtitle="Account-wise transaction history" onClick={() => setActiveReport("account")} />
        <MenuListItem icon={<CreditCard size={18} />} title="EMI & Loan Report" subtitle="Active plans, dues, penalties" onClick={() => setActiveReport("emi")} />
      </div>

      {/* Inventory Reports */}
      <SectionHeader title="Inventory Reports" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
        <MenuListItem icon={<Package size={18} />} title="Stock Report" subtitle="Current stock & valuation" onClick={() => setActiveReport("stock")} />
        <MenuListItem icon={<Download size={18} />} title="Export Data" subtitle="Export reports as CSV / PDF" />
      </div>
    </AppShell>
  );
};

export default ReportsPage;

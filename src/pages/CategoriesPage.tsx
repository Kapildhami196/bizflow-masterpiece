import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, Tag, X } from "lucide-react";

const tabs = ["All", "Income", "Expense", "Business"];

const categories = [
  { id: 1, name: "Salary", group: "income", color: "bg-success/15", textColor: "text-success", system: true },
  { id: 2, name: "Rent", group: "income", color: "bg-success/15", textColor: "text-success", system: true },
  { id: 3, name: "Sale", group: "business", color: "bg-primary/15", textColor: "text-primary", system: true },
  { id: 4, name: "Collection", group: "business", color: "bg-primary/15", textColor: "text-primary", system: true },
  { id: 5, name: "Food & Dining", group: "expense", color: "bg-destructive/15", textColor: "text-destructive", system: true },
  { id: 6, name: "Transport", group: "expense", color: "bg-destructive/15", textColor: "text-destructive", system: true },
  { id: 7, name: "Utilities", group: "expense", color: "bg-destructive/15", textColor: "text-destructive", system: true },
  { id: 8, name: "Purchase", group: "business", color: "bg-primary/15", textColor: "text-primary", system: true },
  { id: 9, name: "Payment Out", group: "business", color: "bg-primary/15", textColor: "text-primary", system: true },
  { id: 10, name: "EMI Payment", group: "expense", color: "bg-warning/15", textColor: "text-warning", system: true },
  { id: 11, name: "Gift", group: "income", color: "bg-success/15", textColor: "text-success", system: false },
  { id: 12, name: "Shop Supplies", group: "expense", color: "bg-destructive/15", textColor: "text-destructive", system: false },
];

const CategoriesPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const filtered = activeTab === "All" ? categories : categories.filter(c => c.group === activeTab.toLowerCase());

  return (
    <AppShell headerTitle="Categories">
      <div className="flex gap-2 px-4 pt-4 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-3 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {filtered.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center shrink-0`}>
              <Tag size={18} className={c.textColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{c.name}</p>
              <p className="text-[11px] text-muted-foreground capitalize">{c.group}</p>
            </div>
            {c.system ? (
              <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">System</span>
            ) : (
              <span className="text-[10px] font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded">Custom</span>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 pt-4 pb-4">
        <button onClick={() => setShowForm(true)} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">New Category</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Category Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Income</option>
                <option>Expense</option>
                <option>Business</option>
              </select>
              <textarea placeholder="Description" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={() => setShowForm(false)} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default CategoriesPage;

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, Tag } from "lucide-react";

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
  const filtered = activeTab === "All" ? categories : categories.filter(c => c.group === activeTab.toLowerCase());

  return (
    <AppShell headerTitle="Categories">
      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category List */}
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

      {/* Add Button */}
      <div className="px-4 pt-4 pb-4">
        <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} />
          Add Category
        </button>
      </div>
    </AppShell>
  );
};

export default CategoriesPage;

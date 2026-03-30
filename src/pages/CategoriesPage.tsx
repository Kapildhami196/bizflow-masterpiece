import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Plus, Tag, X } from "lucide-react";

const tabs = ["All", "Income", "Expense", "Business", "Product"];

const initialCategories = [
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
  { id: 13, name: "Grocery", group: "product", color: "bg-accent/50", textColor: "text-accent-foreground", system: true },
  { id: 14, name: "Beverages", group: "product", color: "bg-accent/50", textColor: "text-accent-foreground", system: true },
  { id: 15, name: "Food", group: "product", color: "bg-accent/50", textColor: "text-accent-foreground", system: true },
  { id: 16, name: "Electronics", group: "product", color: "bg-accent/50", textColor: "text-accent-foreground", system: true },
  { id: 17, name: "Services", group: "product", color: "bg-accent/50", textColor: "text-accent-foreground", system: true },
];

const groupColors: Record<string, { bg: string; text: string }> = {
  income: { bg: "bg-success/15", text: "text-success" },
  expense: { bg: "bg-destructive/15", text: "text-destructive" },
  business: { bg: "bg-primary/15", text: "text-primary" },
  product: { bg: "bg-accent/50", text: "text-accent-foreground" },
};

const CategoriesPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("income");
  const [newDesc, setNewDesc] = useState("");

  const filtered = activeTab === "All" ? categoryList : categoryList.filter(c => c.group === activeTab.toLowerCase());

  const handleSave = () => {
    if (!newName.trim()) return;
    const colors = groupColors[newGroup] || groupColors.income;
    const newCat = {
      id: Date.now(),
      name: newName.trim(),
      group: newGroup,
      color: colors.bg,
      textColor: colors.text,
      system: false,
    };
    setCategoryList(prev => [...prev, newCat]);
    setNewName("");
    setNewGroup("income");
    setNewDesc("");
    setShowForm(false);
  };

  const handleDelete = (id: number, system: boolean) => {
    if (system) return;
    setCategoryList(prev => prev.filter(c => c.id !== id));
  };

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
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded">Custom</span>
                <button onClick={() => handleDelete(c.id, c.system)} className="text-destructive"><X size={14} /></button>
              </div>
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
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={newGroup} onChange={e => setNewGroup(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="business">Business</option>
                <option value="product">Product</option>
              </select>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
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

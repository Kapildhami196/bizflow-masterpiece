import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight, RotateCcw, X } from "lucide-react";

const initialStock = [
  { id: 1, name: "Basmati Rice (25kg)", stock: 45, unit: "bag", value: 94500, status: "ok" as const },
  { id: 2, name: "Cooking Oil (5L)", stock: 30, unit: "bottle", value: 21600, status: "ok" as const },
  { id: 3, name: "Sugar (1kg)", stock: 120, unit: "kg", value: 9360, status: "ok" as const },
  { id: 4, name: "Flour (10kg)", stock: 3, unit: "bag", value: 1350, status: "low" as const },
  { id: 5, name: "Salt (1kg)", stock: 2, unit: "kg", value: 60, status: "low" as const },
  { id: 6, name: "Dal (1kg)", stock: 65, unit: "kg", value: 7800, status: "ok" as const },
];

const recentMovements = [
  { name: "Basmati Rice (25kg)", qty: "+20 bag", type: "in" as const, date: "Today", reason: "Purchase" },
  { name: "Cooking Oil (5L)", qty: "-5 bottle", type: "out" as const, date: "Today", reason: "Sale" },
  { name: "Flour (10kg)", qty: "-8 bag", type: "out" as const, date: "Yesterday", reason: "Sale" },
  { name: "Sugar (1kg)", qty: "+50 kg", type: "in" as const, date: "Yesterday", reason: "Purchase" },
];

const InventoryPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"in" | "adjust" | "edit">("in");
  const [stockItems, setStockItems] = useState(initialStock);
  const [editingItem, setEditingItem] = useState<typeof initialStock[0] | null>(null);

  // Form fields
  const [fName, setFName] = useState("");
  const [fStock, setFStock] = useState("");
  const [fUnit, setFUnit] = useState("");
  const [fRate, setFRate] = useState("");
  const [fDate, setFDate] = useState("");
  const [fRemarks, setFRemarks] = useState("");

  const totalValue = stockItems.reduce((s, i) => s + i.value, 0);
  const lowStockCount = stockItems.filter(i => i.status === "low").length;

  const openEdit = (item: typeof initialStock[0]) => {
    setEditingItem(item);
    setFormType("edit");
    setFName(item.name); setFStock(item.stock.toString()); setFUnit(item.unit); setFRate((item.value / item.stock).toFixed(0));
    setFDate(""); setFRemarks("");
    setShowForm(true);
  };

  const openStockForm = (type: "in" | "adjust") => {
    setEditingItem(null);
    setFormType(type);
    setFName(""); setFStock(""); setFUnit(""); setFRate(""); setFDate(""); setFRemarks("");
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingItem && formType === "edit") {
      setStockItems(prev => prev.map(i => i.id === editingItem.id ? {
        ...i,
        name: fName || i.name,
        stock: fStock ? parseInt(fStock) : i.stock,
        unit: fUnit || i.unit,
        value: fStock && fRate ? parseInt(fStock) * parseInt(fRate) : i.value,
        status: (fStock ? parseInt(fStock) : i.stock) <= 5 ? "low" as const : "ok" as const,
      } : i));
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (editingItem) setStockItems(prev => prev.filter(i => i.id !== editingItem.id));
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <AppShell headerTitle="Inventory">
      <div className="grid grid-cols-3 gap-2 px-4 pt-4">
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <Package size={16} className="text-primary mx-auto mb-1" />
          <p className="text-sm font-bold text-card-foreground">{stockItems.length}</p>
          <p className="text-[10px] text-muted-foreground">Products</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <AlertTriangle size={16} className="text-warning mx-auto mb-1" />
          <p className="text-sm font-bold text-warning">{lowStockCount}</p>
          <p className="text-[10px] text-muted-foreground">Low Stock</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground mb-1">Stock Value</p>
          <p className="text-sm font-bold text-card-foreground">NPR {(totalValue / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="mx-4 mt-3 bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-warning shrink-0" />
          <div>
            <p className="text-sm font-semibold text-card-foreground">{lowStockCount} items low on stock</p>
            <p className="text-xs text-muted-foreground">Restock soon to avoid disruptions</p>
          </div>
        </div>
      )}

      <SectionHeader title="Stock on Hand" actionLabel="View All" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {stockItems.map((item) => (
          <button key={item.id} onClick={() => openEdit(item)} className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-colors">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.status === "low" ? "bg-warning/15" : "bg-accent"}`}>
              <Package size={18} className={item.status === "low" ? "text-warning" : "text-primary"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {item.stock} {item.unit} in stock
                {item.status === "low" && <span className="text-warning font-semibold"> • Low</span>}
              </p>
            </div>
            <p className="text-sm font-semibold text-card-foreground">NPR {item.value.toLocaleString()}</p>
          </button>
        ))}
      </div>

      <SectionHeader title="Recent Movements" actionLabel="View All" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
        {recentMovements.map((m, idx) => (
          <div key={idx} className="flex items-center gap-3 px-4 py-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.type === "in" ? "bg-success/15" : "bg-destructive/15"}`}>
              {m.type === "in" ? <ArrowDownLeft size={14} className="text-success" /> : <ArrowUpRight size={14} className="text-destructive" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground">{m.name}</p>
              <p className="text-[11px] text-muted-foreground">{m.date} • {m.reason}</p>
            </div>
            <p className={`text-sm font-semibold ${m.type === "in" ? "text-success" : "text-destructive"}`}>{m.qty}</p>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        <button onClick={() => openStockForm("in")} className="bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <ArrowDownLeft size={16} /> Stock In
        </button>
        <button onClick={() => openStockForm("adjust")} className="border-2 border-primary text-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <RotateCcw size={16} /> Adjust
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">
                {formType === "edit" ? "Edit Item" : formType === "in" ? "Stock In" : "Stock Adjustment"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              {formType === "edit" ? (
                <>
                  <input value={fName} onChange={e => setFName(e.target.value)} placeholder="Product Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={fStock} onChange={e => setFStock(e.target.value)} placeholder="Stock Qty *" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input value={fUnit} onChange={e => setFUnit(e.target.value)} placeholder="Unit (kg, bag..)" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <input value={fRate} onChange={e => setFRate(e.target.value)} placeholder="Rate per unit (NPR)" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <textarea value={fRemarks} onChange={e => setFRemarks(e.target.value)} placeholder="Remarks" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">Update Item</button>
                  <button onClick={handleDelete} className="w-full border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm">Delete Item</button>
                </>
              ) : (
                <>
                  <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Product *</option>
                    {stockItems.map((item) => <option key={item.id}>{item.name}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Quantity *" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input placeholder="Rate (NPR)" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  {formType === "adjust" && (
                    <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Damage</option><option>Lost</option><option>Return</option><option>Correction</option>
                    </select>
                  )}
                  <input type="date" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <textarea placeholder="Remarks" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  <button onClick={() => setShowForm(false)} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">Save</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default InventoryPage;
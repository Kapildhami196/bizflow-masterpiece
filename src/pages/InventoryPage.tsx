import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";

const stockItems = [
  { name: "Basmati Rice (25kg)", stock: 45, unit: "bag", value: 94500, status: "ok" as const },
  { name: "Cooking Oil (5L)", stock: 30, unit: "bottle", value: 21600, status: "ok" as const },
  { name: "Sugar (1kg)", stock: 120, unit: "kg", value: 9360, status: "ok" as const },
  { name: "Flour (10kg)", stock: 3, unit: "bag", value: 1350, status: "low" as const },
  { name: "Salt (1kg)", stock: 2, unit: "kg", value: 60, status: "low" as const },
  { name: "Dal (1kg)", stock: 65, unit: "kg", value: 7800, status: "ok" as const },
];

const recentMovements = [
  { name: "Basmati Rice (25kg)", qty: "+20 bag", type: "in" as const, date: "Today", reason: "Purchase" },
  { name: "Cooking Oil (5L)", qty: "-5 bottle", type: "out" as const, date: "Today", reason: "Sale" },
  { name: "Flour (10kg)", qty: "-8 bag", type: "out" as const, date: "Yesterday", reason: "Sale" },
  { name: "Sugar (1kg)", qty: "+50 kg", type: "in" as const, date: "Yesterday", reason: "Purchase" },
];

const InventoryPage = () => {
  const totalValue = stockItems.reduce((s, i) => s + i.value, 0);
  const lowStockCount = stockItems.filter(i => i.status === "low").length;

  return (
    <AppShell headerTitle="Inventory">
      {/* Summary */}
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
          <p className="text-sm font-bold text-card-foreground">₹{(totalValue / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="mx-4 mt-3 bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-warning shrink-0" />
          <div>
            <p className="text-sm font-semibold text-card-foreground">{lowStockCount} items low on stock</p>
            <p className="text-xs text-muted-foreground">Restock soon to avoid disruptions</p>
          </div>
        </div>
      )}

      {/* Stock List */}
      <SectionHeader title="Stock on Hand" actionLabel="View All" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {stockItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 px-4 py-3.5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              item.status === "low" ? "bg-warning/15" : "bg-accent"
            }`}>
              <Package size={18} className={item.status === "low" ? "text-warning" : "text-primary"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {item.stock} {item.unit} in stock
                {item.status === "low" && <span className="text-warning font-semibold"> • Low</span>}
              </p>
            </div>
            <p className="text-sm font-semibold text-card-foreground">₹{item.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Recent Movements */}
      <SectionHeader title="Recent Movements" actionLabel="View All" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
        {recentMovements.map((m, idx) => (
          <div key={idx} className="flex items-center gap-3 px-4 py-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.type === "in" ? "bg-success/15" : "bg-destructive/15"
            }`}>
              {m.type === "in" ? (
                <ArrowDownLeft size={14} className="text-success" />
              ) : (
                <ArrowUpRight size={14} className="text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground">{m.name}</p>
              <p className="text-[11px] text-muted-foreground">{m.date} • {m.reason}</p>
            </div>
            <p className={`text-sm font-semibold ${m.type === "in" ? "text-success" : "text-destructive"}`}>
              {m.qty}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        <button className="bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <ArrowDownLeft size={16} />
          Stock In
        </button>
        <button className="border-2 border-primary text-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <RotateCcw size={16} />
          Adjust
        </button>
      </div>
    </AppShell>
  );
};

export default InventoryPage;

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Search, Plus, Package, MoreVertical } from "lucide-react";

const tabs = ["All", "Items", "Services"];

const products = [
  { id: 1, name: "Basmati Rice (25kg)", kind: "item", salePrice: 2500, costPrice: 2100, stock: 45, unit: "bag", active: true },
  { id: 2, name: "Cooking Oil (5L)", kind: "item", salePrice: 850, costPrice: 720, stock: 30, unit: "bottle", active: true },
  { id: 3, name: "Sugar (1kg)", kind: "item", salePrice: 95, costPrice: 78, stock: 120, unit: "kg", active: true },
  { id: 4, name: "Home Delivery", kind: "service", salePrice: 100, costPrice: 0, stock: null, unit: "-", active: true },
  { id: 5, name: "Flour (10kg)", kind: "item", salePrice: 550, costPrice: 450, stock: 3, unit: "bag", active: true },
  { id: 6, name: "Installation Service", kind: "service", salePrice: 500, costPrice: 0, stock: null, unit: "-", active: true },
];

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const filtered = activeTab === "All" ? products : products.filter(p => p.kind === activeTab.toLowerCase().slice(0, -1));

  return (
    <AppShell headerTitle="Products">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-4">
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-card-foreground">{products.filter(p => p.kind === "item").length}</p>
          <p className="text-[10px] text-muted-foreground">Items</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-card-foreground">{products.filter(p => p.kind === "service").length}</p>
          <p className="text-[10px] text-muted-foreground">Services</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <p className="text-lg font-bold text-warning">{products.filter(p => p.kind === "item" && p.stock !== null && p.stock < 5).length}</p>
          <p className="text-[10px] text-muted-foreground">Low Stock</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search products..."
            className="w-full bg-card border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-3">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="mx-4 mt-3 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {filtered.map(p => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Package size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{p.name}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="capitalize">{p.kind}</span>
                {p.stock !== null && (
                  <>
                    <span>•</span>
                    <span className={p.stock < 5 ? "text-warning font-semibold" : ""}>
                      Stock: {p.stock} {p.unit}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-card-foreground">₹{p.salePrice.toLocaleString()}</p>
              {p.costPrice > 0 && (
                <p className="text-[10px] text-muted-foreground">Cost: ₹{p.costPrice}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="px-4 pt-4 pb-4">
        <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} />
          Add Product
        </button>
      </div>
    </AppShell>
  );
};

export default ProductsPage;

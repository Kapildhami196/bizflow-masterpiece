import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Search, Plus, Package, X } from "lucide-react";

const tabs = ["All", "Items", "Services"];

const initialProducts = [
  { id: 1, name: "Basmati Rice (25kg)", kind: "item" as const, salePrice: 2500, costPrice: 2100, stock: 45, unit: "bag", active: true },
  { id: 2, name: "Cooking Oil (5L)", kind: "item" as const, salePrice: 850, costPrice: 720, stock: 30, unit: "bottle", active: true },
  { id: 3, name: "Sugar (1kg)", kind: "item" as const, salePrice: 95, costPrice: 78, stock: 120, unit: "kg", active: true },
  { id: 4, name: "Home Delivery", kind: "service" as const, salePrice: 100, costPrice: 0, stock: null, unit: "-", active: true },
  { id: 5, name: "Flour (10kg)", kind: "item" as const, salePrice: 550, costPrice: 450, stock: 3, unit: "bag", active: true },
  { id: 6, name: "Installation Service", kind: "service" as const, salePrice: 500, costPrice: 0, stock: null, unit: "-", active: true },
];

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [editingItem, setEditingItem] = useState<typeof initialProducts[0] | null>(null);

  const [fName, setFName] = useState("");
  const [fKind, setFKind] = useState("Item");
  const [fSalePrice, setFSalePrice] = useState("");
  const [fCostPrice, setFCostPrice] = useState("");
  const [fStock, setFStock] = useState("");
  const [fUnit, setFUnit] = useState("pcs");
  const [fCategory, setFCategory] = useState("");
  const [fSku, setFSku] = useState("");
  const [fTax, setFTax] = useState("");
  const [fDesc, setFDesc] = useState("");

  const filtered = activeTab === "All" ? products : products.filter(p => p.kind === activeTab.toLowerCase().slice(0, -1));

  const openNew = () => {
    setEditingItem(null);
    setFName(""); setFKind("Item"); setFSalePrice(""); setFCostPrice(""); setFStock(""); setFUnit("pcs"); setFCategory(""); setFSku(""); setFTax(""); setFDesc("");
    setShowForm(true);
  };

  const openEdit = (p: typeof initialProducts[0]) => {
    setEditingItem(p);
    setFName(p.name); setFKind(p.kind === "item" ? "Item" : "Service");
    setFSalePrice(p.salePrice.toString()); setFCostPrice(p.costPrice.toString());
    setFStock(p.stock?.toString() || ""); setFUnit(p.unit);
    setFCategory(""); setFSku(""); setFTax(""); setFDesc("");
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setProducts(prev => prev.map(p => p.id === editingItem.id ? {
        ...p,
        name: fName || p.name,
        kind: fKind.toLowerCase() as "item" | "service",
        salePrice: fSalePrice ? parseInt(fSalePrice) : p.salePrice,
        costPrice: fCostPrice ? parseInt(fCostPrice) : p.costPrice,
        stock: fKind === "Service" ? null : (fStock ? parseInt(fStock) : p.stock),
        unit: fUnit || p.unit,
      } : p));
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (editingItem) setProducts(prev => prev.filter(p => p.id !== editingItem.id));
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <AppShell headerTitle="Products">
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

      <div className="px-4 pt-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search products..." className="w-full bg-card border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="flex gap-2 px-4 pt-3">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-3 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {filtered.map(p => (
          <button key={p.id} onClick={() => openEdit(p)} className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Package size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{p.name}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="capitalize">{p.kind}</span>
                {p.stock !== null && (
                  <><span>•</span><span className={p.stock < 5 ? "text-warning font-semibold" : ""}>Stock: {p.stock} {p.unit}</span></>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-card-foreground">NPR {p.salePrice.toLocaleString()}</p>
              {p.costPrice > 0 && <p className="text-[10px] text-muted-foreground">Cost: NPR {p.costPrice}</p>}
            </div>
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-4">
        <button onClick={openNew} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">{editingItem ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input value={fName} onChange={e => setFName(e.target.value)} placeholder="Product Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={fKind} onChange={e => setFKind(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Item</option>
                <option>Service</option>
              </select>
              <select value={fCategory} onChange={e => setFCategory(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select Category</option>
                <option>Grocery</option><option>Beverages</option><option>Food</option><option>Electronics</option><option>Services</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input value={fSalePrice} onChange={e => setFSalePrice(e.target.value)} placeholder="Sale Price *" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input value={fCostPrice} onChange={e => setFCostPrice(e.target.value)} placeholder="Cost Price" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              {fKind !== "Service" && (
                <div className="grid grid-cols-2 gap-3">
                  <input value={fStock} onChange={e => setFStock(e.target.value)} placeholder="Stock Qty" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <select value={fUnit} onChange={e => setFUnit(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>pcs</option><option>kg</option><option>bag</option><option>bottle</option><option>box</option><option>litre</option>
                  </select>
                </div>
              )}
              <input value={fSku} onChange={e => setFSku(e.target.value)} placeholder="SKU / Barcode" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={fTax} onChange={e => setFTax(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Tax Rate</option>
                <option>No Tax</option><option>VAT 13%</option><option>GST 5%</option><option>GST 12%</option><option>GST 18%</option>
              </select>
              <textarea value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="Description" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                {editingItem ? "Update Product" : "Save Product"}
              </button>
              {editingItem && (
                <button onClick={handleDelete} className="w-full border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm">
                  Delete Product
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default ProductsPage;
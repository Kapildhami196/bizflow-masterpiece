import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Minus, Trash2, ShoppingCart, ChevronDown, X, Percent, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

const categories = ["All", "Food", "Beverages", "Electronics", "Grocery", "Services"];

const initialProducts = [
  { id: 1, name: "Basmati Rice (25kg)", price: 2500, category: "Grocery" },
  { id: 2, name: "Cooking Oil (5L)", price: 850, category: "Grocery" },
  { id: 3, name: "Sugar (1kg)", price: 95, category: "Grocery" },
  { id: 4, name: "Dal (1kg)", price: 120, category: "Grocery" },
  { id: 5, name: "Tea (500g)", price: 250, category: "Beverages" },
  { id: 6, name: "Coffee (250g)", price: 350, category: "Beverages" },
  { id: 7, name: "Bread", price: 45, category: "Food" },
  { id: 8, name: "Butter (500g)", price: 280, category: "Food" },
  { id: 9, name: "Milk (1L)", price: 70, category: "Beverages" },
  { id: 10, name: "Home Delivery", price: 100, category: "Services" },
  { id: 11, name: "Salt (1kg)", price: 30, category: "Grocery" },
  { id: 12, name: "Flour (10kg)", price: 550, category: "Grocery" },
  { id: 13, name: "Noodles (Pack)", price: 35, category: "Food" },
  { id: 14, name: "Juice (1L)", price: 120, category: "Beverages" },
  { id: 15, name: "Biscuits", price: 50, category: "Food" },
  { id: 16, name: "Soap (Pack)", price: 85, category: "Grocery" },
];

const PosPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [surcharge, setSurcharge] = useState(0);
  const [taxRate] = useState(13);
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState<typeof initialProducts[0] | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eName, setEName] = useState("");
  const [ePrice, setEPrice] = useState("");
  const [eCategory, setECategory] = useState("");
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const addToCart = (product: typeof initialProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const removeOneFromCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === productId);
      if (!existing) return prev;
      if (existing.qty <= 1) return prev.filter(i => i.id !== productId);
      return prev.map(i => i.id === productId ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const getCartQty = (productId: number) => {
    return cart.find(i => i.id === productId)?.qty || 0;
  };

  const handleLongPressStart = useCallback((product: typeof initialProducts[0]) => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      const qty = getCartQty(product.id);
      if (qty > 0) {
        removeOneFromCart(product.id);
        toast(`Removed 1x ${product.name}`, { description: `Qty: ${qty - 1}`, duration: 1500 });
      } else {
        addToCart(product);
        toast(`Added 1x ${product.name}`, { description: `Qty: 1`, duration: 1500 });
      }
    }, 500);
  }, [cart]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleProductClick = (product: typeof initialProducts[0]) => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    addToCart(product);
    toast(`Added ${product.name}`, { duration: 1200 });
  };

  const handleDoubleClick = (product: typeof initialProducts[0]) => {
    setEditingProduct(product);
    setEName(product.name);
    setEPrice(product.price.toString());
    setECategory(product.category);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p, name: eName || p.name, price: ePrice ? parseInt(ePrice) : p.price, category: eCategory || p.category,
      } : p));
      setCart(prev => prev.map(i => i.id === editingProduct.id ? {
        ...i, name: eName || i.name, price: ePrice ? parseInt(ePrice) : i.price,
      } : i));
    }
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleEditDelete = () => {
    if (editingProduct) {
      setProducts(prev => prev.filter(p => p.id !== editingProduct.id));
      setCart(prev => prev.filter(i => i.id !== editingProduct.id));
    }
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const grossAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = (grossAmount * discountPercent) / 100;
  const taxableAmount = grossAmount - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount + surcharge;
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      <header className="bg-header text-header-foreground px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h1 className="text-lg font-semibold">POS Checkout</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </header>
      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-36">
        <div className="px-4 pt-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Products..."
              className="w-full bg-card border border-border rounded-lg py-2.5 pl-9 pr-10 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex gap-2 px-4 pt-3 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid Card - 4 per row, scrollable, 16 products */}
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-muted-foreground">Tap to add • Hold to quick remove • Double-tap to edit</p>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-y-auto max-h-[280px] p-2">
              <div className="grid grid-cols-4 gap-2">
                {filtered.map(p => {
                  const qty = getCartQty(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleProductClick(p)}
                      onDoubleClick={(e) => { e.preventDefault(); handleDoubleClick(p); }}
                      onMouseDown={() => handleLongPressStart(p)}
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onTouchStart={() => handleLongPressStart(p)}
                      onTouchEnd={handleLongPressEnd}
                      className="relative bg-background border border-border rounded-lg p-2 text-center hover:border-primary/40 transition-colors select-none active:scale-95"
                    >
                      {qty > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[9px] font-bold flex items-center justify-center z-10">
                          {qty}
                        </span>
                      )}
                      <div className="w-full aspect-square rounded-md bg-accent flex items-center justify-center mb-1">
                        <span className="text-base font-bold text-primary">{p.name[0]}</span>
                      </div>
                      <p className="text-[9px] font-medium text-card-foreground leading-tight truncate">{p.name}</p>
                      <p className="text-[9px] text-primary font-bold">₹{p.price}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {cart.length > 0 && (
          <>
            <div className="mx-4 mt-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                      <Minus size={12} className="text-muted-foreground" />
                    </button>
                    <span className="text-sm font-semibold text-card-foreground w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                      <Plus size={12} className="text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-card-foreground w-20 text-right">NPR {(item.price * item.qty).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mx-4 mt-3 bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-card-foreground">Items</p>
                <p className="text-sm font-semibold text-card-foreground">Total</p>
              </div>
              <div className="space-y-1.5 text-sm border-t border-border pt-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Gross Amount</span><span className="text-card-foreground">NPR {grossAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VAT ({taxRate}%)</span><span className="text-card-foreground">NPR {taxAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Discount (-)</span><span className="text-card-foreground">NPR {discountAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Surcharge</span><span className="text-card-foreground">NPR {surcharge.toLocaleString()}</span></div>
              </div>
              <div className="flex justify-between pt-3 mt-2 border-t border-border">
                <span className="text-base font-bold text-card-foreground">Grand Total</span>
                <span className="text-xl font-bold text-primary">NPR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="px-4 mt-3 space-y-2">
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-card-foreground bg-card">Hold Order</button>
                <button className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-card-foreground bg-card">Void Order</button>
                <button className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Pay</button>
                <button onClick={() => setCart([])} className="flex-1 py-2.5 rounded-lg border border-destructive/30 text-sm font-medium text-destructive bg-card">Delete</button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDiscountPercent(prev => prev > 0 ? 0 : 10)}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold ${discountPercent > 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground bg-card'}`}>
                  <Percent size={12} className="inline mr-1" />Discount {discountPercent}%
                </button>
                <button onClick={() => setSurcharge(prev => prev > 0 ? 0 : 50)}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold ${surcharge > 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground bg-card'}`}>
                  Surcharge NPR {surcharge}
                </button>
                <button className="px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <ShoppingCart size={48} className="text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Tap products to add to cart</p>
          </div>
        )}
      </main>

      {/* Fixed Add Product Button */}
      <button
        onClick={() => { setEditingProduct(null); setEName(""); setEPrice(""); setECategory("Food"); setShowEditModal(true); }}
        className="fixed bottom-20 right-4 max-w-md w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-primary/90 transition-colors"
      >
        <Plus size={24} />
      </button>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border px-4 py-3 safe-bottom z-30">
          <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            <ShoppingCart size={18} />
            Pay NPR {grandTotal.toLocaleString()}
          </button>
        </div>
      )}

      {/* Edit/Create Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => { setShowEditModal(false); setEditingProduct(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input value={eName} onChange={e => setEName(e.target.value)} placeholder="Product Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={ePrice} onChange={e => setEPrice(e.target.value)} placeholder="Price (NPR) *" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={eCategory} onChange={e => setECategory(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
              {editingProduct ? (
                <>
                  <button onClick={handleEditSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">Update Product</button>
                  <button onClick={handleEditDelete} className="w-full border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm">Remove Product</button>
                </>
              ) : (
                <button onClick={() => {
                  if (eName && ePrice) {
                    const newId = Math.max(...products.map(p => p.id), 0) + 1;
                    setProducts(prev => [...prev, { id: newId, name: eName, price: parseInt(ePrice), category: eCategory }]);
                    toast(`${eName} added!`);
                    setShowEditModal(false);
                  }
                }} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">Add Product</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosPage;

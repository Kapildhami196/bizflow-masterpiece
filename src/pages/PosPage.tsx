import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Minus, Trash2, ShoppingCart, X, Percent, MoreHorizontal, Package } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface SlotProduct {
  id: number;
  name: string;
  price: number;
  category: string;
}

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
  { id: 17, name: "Shampoo", price: 180, category: "Grocery" },
  { id: 18, name: "Toothpaste", price: 65, category: "Grocery" },
  { id: 19, name: "Water (1L)", price: 25, category: "Beverages" },
  { id: 20, name: "Chips (Pack)", price: 40, category: "Food" },
];

const TOTAL_SLOTS = 16;

const PosPage = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<(SlotProduct | null)[]>(Array(TOTAL_SLOTS).fill(null));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [surcharge, setSurcharge] = useState(0);
  const [taxRate] = useState(13);

  // Product picker popup state
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [availableProducts, setAvailableProducts] = useState(initialProducts);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  const openPicker = (slotIndex: number) => {
    setPickerSlotIndex(slotIndex);
    setPickerSearch("");
    setShowPicker(true);
  };

  const handleAddNewProduct = () => {
    if (!newProductName.trim() || !newProductPrice.trim()) {
      toast.error("Name and price are required");
      return;
    }
    const newProduct: SlotProduct = {
      id: Date.now(),
      name: newProductName.trim(),
      price: parseFloat(newProductPrice),
      category: "General",
    };
    setAvailableProducts(prev => [...prev, newProduct]);
    selectProductForSlot(newProduct);
    setNewProductName("");
    setNewProductPrice("");
    setShowAddProduct(false);
    toast.success(`Product "${newProduct.name}" created & added`);
  };

  const handleSlotClick = (slotIndex: number) => {
    const product = slots[slotIndex];
    if (product) {
      // Remove product from slot and cart
      setSlots(prev => prev.map((s, i) => i === slotIndex ? null : s));
      setCart(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing && existing.qty > 1) {
          return prev.map(i => i.id === product.id ? { ...i, qty: i.qty - 1 } : i);
        }
        return prev.filter(i => i.id !== product.id);
      });
      toast(`Removed ${product.name}`, { duration: 1200 });
    } else {
      openPicker(slotIndex);
    }
  };

  const selectProductForSlot = (product: SlotProduct) => {
    if (pickerSlotIndex === null) return;
    setSlots(prev => prev.map((s, i) => i === pickerSlotIndex ? product : s));
    // Add to cart
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
    toast(`Added ${product.name}`, { duration: 1200 });
    setShowPicker(false);
    setPickerSlotIndex(null);
  };

  const filteredPickerProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
    // Also clear slots with this product
    setSlots(prev => prev.map(s => s && s.id === id ? null : s));
  };

  const grossAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = (grossAmount * discountPercent) / 100;
  const taxableAmount = grossAmount - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount + surcharge;
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      {/* Header */}
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

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Product Slots Grid */}
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-card-foreground">Product Slots</p>
            <p className="text-[10px] text-muted-foreground">Tap empty to add • Tap filled to remove</p>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-y-auto max-h-[280px] p-2">
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    className={`relative rounded-lg p-2 text-center transition-all select-none active:scale-95 border ${
                      slot
                        ? "bg-primary/10 border-primary/30 hover:border-destructive/50"
                        : "bg-background border-dashed border-border hover:border-primary/40 hover:bg-accent/30"
                    }`}
                  >
                    {slot ? (
                      <>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[8px] font-bold flex items-center justify-center z-10">
                          <X size={8} />
                        </div>
                        <div className="w-full aspect-square rounded-md bg-primary/15 flex items-center justify-center mb-1">
                          <span className="text-sm font-bold text-primary">{slot.name[0]}</span>
                        </div>
                        <p className="text-[8px] font-medium text-card-foreground leading-tight truncate">{slot.name}</p>
                        <p className="text-[8px] text-primary font-bold">NPR {slot.price}</p>
                      </>
                    ) : (
                      <>
                        <div className="w-full aspect-square rounded-md bg-muted/50 flex items-center justify-center mb-1">
                          <Plus size={14} className="text-muted-foreground/50" />
                        </div>
                        <p className="text-[8px] text-muted-foreground">Empty</p>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary - Always visible */}
        <div className="mx-4 mt-4 bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart size={14} className="text-primary" />
              <p className="text-sm font-semibold text-card-foreground">Cart Summary</p>
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{totalItems} items</span>
          </div>

          {cart.length > 0 ? (
            <>
              <div className="divide-y divide-border">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-2 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-card-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">NPR {item.price} × {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                        <Minus size={10} className="text-muted-foreground" />
                      </button>
                      <span className="text-xs font-semibold text-card-foreground w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                        <Plus size={10} className="text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-card-foreground w-16 text-right">NPR {(item.price * item.qty).toLocaleString()}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-destructive ml-1">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-xs border-t border-border pt-2 mt-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Gross</span><span className="text-card-foreground">NPR {grossAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VAT ({taxRate}%)</span><span className="text-card-foreground">NPR {taxAmount.toLocaleString()}</span></div>
                {discountPercent > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount (-{discountPercent}%)</span><span className="text-destructive">-NPR {discountAmount.toLocaleString()}</span></div>}
                {surcharge > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Surcharge</span><span className="text-card-foreground">NPR {surcharge.toLocaleString()}</span></div>}
              </div>
              <div className="flex justify-between pt-2 mt-1 border-t border-border">
                <span className="text-sm font-bold text-card-foreground">Grand Total</span>
                <span className="text-lg font-bold text-primary">NPR {grandTotal.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4">
              <Package size={24} className="text-muted-foreground/30 mb-1" />
              <p className="text-xs text-muted-foreground">No items in cart. Tap an empty slot to add products.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {cart.length > 0 && (
          <div className="px-4 mt-3 space-y-2">
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg border border-border text-xs font-medium text-card-foreground bg-card">Hold</button>
              <button className="flex-1 py-2.5 rounded-lg border border-border text-xs font-medium text-card-foreground bg-card">Void</button>
              <button className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Pay</button>
              <button onClick={() => { setCart([]); setSlots(Array(TOTAL_SLOTS).fill(null)); }} className="flex-1 py-2.5 rounded-lg border border-destructive/30 text-xs font-medium text-destructive bg-card">Clear</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDiscountPercent(prev => prev > 0 ? 0 : 10)}
                className={`px-3 py-2 rounded-lg border text-[10px] font-semibold ${discountPercent > 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground bg-card'}`}>
                <Percent size={10} className="inline mr-1" />Discount {discountPercent}%
              </button>
              <button onClick={() => setSurcharge(prev => prev > 0 ? 0 : 50)}
                className={`px-3 py-2 rounded-lg border text-[10px] font-semibold ${surcharge > 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground bg-card'}`}>
                Surcharge NPR {surcharge}
              </button>
              <button className="px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Pay Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border px-4 py-3 safe-bottom z-30">
          <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            <ShoppingCart size={18} />
            Pay NPR {grandTotal.toLocaleString()}
          </button>
        </div>
      )}

      {/* Product Picker Popup */}
      {showPicker && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl animate-in slide-in-from-bottom max-h-[75vh] flex flex-col">
            {/* Picker Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-base font-bold text-card-foreground">Select Product</h2>
              <button onClick={() => { setShowPicker(false); setPickerSlotIndex(null); }}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pt-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Add New Product Button */}
            <div className="px-4 pt-2">
              <button
                onClick={() => setShowAddProduct(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-primary/40 text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
              >
                <Plus size={14} /> Create New Product
              </button>
            </div>

            {/* Add Product Form Inline */}
            {showAddProduct && (
              <div className="px-4 pt-2 space-y-2">
                <input
                  value={newProductName}
                  onChange={e => setNewProductName(e.target.value)}
                  placeholder="Product name *"
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={newProductPrice}
                  onChange={e => setNewProductPrice(e.target.value)}
                  placeholder="Price (NPR) *"
                  type="number"
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowAddProduct(false)} className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground">Cancel</button>
                  <button onClick={handleAddNewProduct} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Add & Select</button>
                </div>
              </div>
            )}

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {filteredPickerProducts.length > 0 ? filteredPickerProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => selectProductForSlot(product)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-background border border-border hover:border-primary/40 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{product.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">NPR {product.price}</p>
                </button>
              )) : (
                <div className="text-center py-8">
                  <Package size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosPage;

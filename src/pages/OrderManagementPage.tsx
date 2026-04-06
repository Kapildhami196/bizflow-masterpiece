import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Plus, Search, X, CheckCircle2, Trash2,
  User, Calendar, CreditCard, Edit2, Download, Upload,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

type OrderStatus = "Draft" | "Pending" | "Confirmed" | "Processing" | "Ready" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

interface OrderItem { id: string; name: string; qty: number; price: number; }

interface Order {
  id: string; orderNo: string; customer: string; phone: string; date: string;
  status: OrderStatus; items: OrderItem[]; subtotal: number; tax: number;
  discount: number; total: number; notes: string; paymentMethod: string; paidAmount: number;
}

const statusColors: Record<OrderStatus, string> = {
  Draft: "bg-muted text-muted-foreground", Pending: "bg-warning/15 text-warning",
  Confirmed: "bg-primary/15 text-primary", Processing: "bg-blue-500/15 text-blue-600",
  Ready: "bg-emerald-500/15 text-emerald-600", Shipped: "bg-indigo-500/15 text-indigo-600",
  Delivered: "bg-success/15 text-success", Cancelled: "bg-destructive/15 text-destructive",
  Returned: "bg-orange-500/15 text-orange-600",
};

const statusFlow: OrderStatus[] = ["Draft", "Pending", "Confirmed", "Processing", "Ready", "Shipped", "Delivered"];

const initialOrders: Order[] = [
  {
    id: "1", orderNo: "ORD-001", customer: "Ram Sharma", phone: "9841234567",
    date: "2026-04-05", status: "Pending",
    items: [{ id: "i1", name: "Notebook A5", qty: 10, price: 120 }, { id: "i2", name: "Pen Box (12pc)", qty: 5, price: 250 }],
    subtotal: 2450, tax: 318.5, discount: 100, total: 2668.5, notes: "Deliver before Saturday", paymentMethod: "Cash", paidAmount: 1000,
  },
  {
    id: "2", orderNo: "ORD-002", customer: "Sita Devi", phone: "9812345678",
    date: "2026-04-04", status: "Confirmed",
    items: [{ id: "i3", name: "Rice (25kg)", qty: 2, price: 2200 }],
    subtotal: 4400, tax: 572, discount: 0, total: 4972, notes: "", paymentMethod: "Bank Transfer", paidAmount: 4972,
  },
  {
    id: "3", orderNo: "ORD-003", customer: "Hari Bahadur", phone: "9801234567",
    date: "2026-04-03", status: "Delivered",
    items: [{ id: "i4", name: "Cement (50kg)", qty: 10, price: 850 }, { id: "i5", name: "Sand (truck)", qty: 1, price: 12000 }],
    subtotal: 20500, tax: 2665, discount: 500, total: 22665, notes: "Construction site delivery", paymentMethod: "Credit", paidAmount: 15000,
  },
];

const calcOrder = (items: OrderItem[], discount: number) => {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.13;
  return { subtotal, tax, total: subtotal + tax - discount };
};

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  // Form state
  const [fCustomer, setFCustomer] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fNotes, setFNotes] = useState("");
  const [fPayment, setFPayment] = useState("Cash");
  const [fDiscount, setFDiscount] = useState("0");
  const [fPaid, setFPaid] = useState("0");
  const [fItems, setFItems] = useState<OrderItem[]>([{ id: "n1", name: "", qty: 1, price: 0 }]);

  const filtered = orders.filter(o => {
    const ms = o.orderNo.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return ms && (filterStatus === "All" || o.status === filterStatus);
  });

  const resetForm = () => {
    setFCustomer(""); setFPhone(""); setFNotes(""); setFPayment("Cash");
    setFDiscount("0"); setFPaid("0");
    setFItems([{ id: "n1", name: "", qty: 1, price: 0 }]);
    setEditingOrder(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };

  const openEdit = (order: Order) => {
    setFCustomer(order.customer); setFPhone(order.phone); setFNotes(order.notes);
    setFPayment(order.paymentMethod); setFDiscount(String(order.discount));
    setFPaid(String(order.paidAmount));
    setFItems(order.items.map(i => ({ ...i })));
    setEditingOrder(order); setShowForm(true); setSelectedOrder(null);
  };

  const handleSave = () => {
    const validItems = fItems.filter(i => i.name.trim());
    if (!fCustomer.trim() || validItems.length === 0) {
      toast.error("Customer name and at least one item required"); return;
    }
    const disc = parseFloat(fDiscount) || 0;
    const { subtotal, tax, total } = calcOrder(validItems, disc);
    const paid = parseFloat(fPaid) || 0;

    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? {
        ...o, customer: fCustomer, phone: fPhone, notes: fNotes,
        paymentMethod: fPayment, items: validItems, subtotal, tax,
        discount: disc, total, paidAmount: paid,
      } : o));
      toast.success("Order updated");
    } else {
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNo: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        customer: fCustomer, phone: fPhone,
        date: new Date().toISOString().split("T")[0],
        status: "Draft", items: validItems, subtotal, tax,
        discount: disc, total, notes: fNotes, paymentMethod: fPayment, paidAmount: paid,
      };
      setOrders([newOrder, ...orders]);
      toast.success("Order created");
    }
    setShowForm(false); resetForm();
  };

  const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    setSelectedOrder({ ...order, status: newStatus });
    setShowStatusChange(false);
    toast.success(`Order ${order.orderNo} → ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    setSelectedOrder(null); toast.success("Order deleted");
  };

  const addItemRow = () => setFItems([...fItems, { id: `n${Date.now()}`, name: "", qty: 1, price: 0 }]);
  const removeItemRow = (idx: number) => setFItems(fItems.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof OrderItem, value: string | number) => {
    const u = [...fItems]; (u[idx] as any)[field] = value; setFItems(u);
  };

  // Export
  const exportOrders = () => {
    const headers = ["Order No", "Customer", "Phone", "Date", "Status", "Items", "Subtotal", "Tax", "Discount", "Total", "Payment Method", "Paid Amount", "Notes"];
    const rows = orders.map(o => [
      o.orderNo, o.customer, o.phone, o.date, o.status,
      o.items.map(i => `${i.name}(${i.qty}x${i.price})`).join("; "),
      o.subtotal, o.tax, o.discount, o.total, o.paymentMethod, o.paidAmount, o.notes,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Orders exported");
  };

  // Import
  const importOrders = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.split("\n").filter(l => l.trim());
        const imported: Order[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(c => c.replace(/^"|"$/g, "")) || [];
          if (cols.length < 10) continue;
          const items: OrderItem[] = cols[5].split("; ").filter(Boolean).map((s, idx) => {
            const m = s.match(/(.+)\((\d+)x([\d.]+)\)/);
            return m ? { id: `imp${idx}`, name: m[1], qty: parseInt(m[2]), price: parseFloat(m[3]) } : { id: `imp${idx}`, name: s, qty: 1, price: 0 };
          });
          imported.push({
            id: Date.now().toString() + i, orderNo: cols[0], customer: cols[1], phone: cols[2],
            date: cols[3], status: (cols[4] as OrderStatus) || "Draft", items,
            subtotal: parseFloat(cols[6]) || 0, tax: parseFloat(cols[7]) || 0,
            discount: parseFloat(cols[8]) || 0, total: parseFloat(cols[9]) || 0,
            paymentMethod: cols[10] || "Cash", paidAmount: parseFloat(cols[11]) || 0, notes: cols[12] || "",
          });
        }
        setOrders(prev => [...imported, ...prev]);
        toast.success(`${imported.length} orders imported`);
      } catch { toast.error("Failed to parse CSV"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const formSubtotal = fItems.filter(i => i.name.trim()).reduce((s, i) => s + i.qty * i.price, 0);
  const formTax = formSubtotal * 0.13;
  const formTotal = formSubtotal + formTax - (parseFloat(fDiscount) || 0);

  const ModalShell = ({ show, title, onClose, children }: { show: boolean; title: string; onClose: () => void; children: React.ReactNode }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
        <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl animate-in slide-in-from-bottom max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-5 pb-3 shrink-0">
            <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
            <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
          </div>
          <div className="overflow-y-auto px-5 pb-5 flex-1">{children}</div>
        </div>
      </div>
    );
  };

  const statusFilters: (OrderStatus | "All")[] = ["All", "Pending", "Confirmed", "Processing", "Ready", "Shipped", "Delivered", "Cancelled"];

  return (
    <AppShell headerTitle="Order Management">
      <input ref={importRef} type="file" accept=".csv" className="hidden" onChange={importOrders} />

      {/* Search & Actions */}
      <div className="px-4 pt-3 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
              className="w-full bg-card border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={exportOrders} className="bg-card border border-border rounded-xl px-3 flex items-center" title="Export">
            <Download size={16} className="text-muted-foreground" />
          </button>
          <button onClick={() => importRef.current?.click()} className="bg-card border border-border rounded-xl px-3 flex items-center" title="Import">
            <Upload size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {statusFilters.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        {[
          { label: "Active", count: orders.filter(o => !["Delivered", "Cancelled", "Returned"].includes(o.status)).length, color: "text-primary" },
          { label: "Delivered", count: orders.filter(o => o.status === "Delivered").length, color: "text-success" },
          { label: "Cancelled", count: orders.filter(o => o.status === "Cancelled").length, color: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Order List */}
      <SectionHeader title={`Orders (${filtered.length})`} />
      <div className="mx-4 space-y-2 pb-24">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No orders found</p>
          </div>
        )}
        {filtered.map(order => (
          <div key={order.id} onClick={() => setSelectedOrder(order)}
            className="bg-card border border-border rounded-xl p-4 active:scale-[0.98] transition-transform cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-card-foreground">{order.orderNo}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-card-foreground">NPR {order.total.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">{order.date}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">{order.items.length} item(s) • {order.paymentMethod}</p>
              {order.paidAmount < order.total && (
                <span className="text-[10px] text-warning font-medium">Balance: NPR {(order.total - order.paidAmount).toLocaleString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={openCreate} className="fixed bottom-20 right-4 z-40 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
        <Plus size={24} />
      </button>

      {/* Create/Edit Order Form */}
      <ModalShell show={showForm} title={editingOrder ? `Edit ${editingOrder.orderNo}` : "Create Order"} onClose={() => { setShowForm(false); resetForm(); }}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</label>
            <input value={fCustomer} onChange={e => setFCustomer(e.target.value)} placeholder="Customer name"
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
            <input value={fPhone} onChange={e => setFPhone(e.target.value)} placeholder="Phone number" type="tel"
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</label>
            <div className="space-y-2 mt-1">
              {fItems.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <input value={item.name} onChange={e => updateItem(idx, "name", e.target.value)} placeholder="Item name"
                    className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input value={item.qty} onChange={e => updateItem(idx, "qty", parseInt(e.target.value) || 0)} type="number" placeholder="Qty"
                    className="w-14 bg-background border border-border rounded-lg py-2 px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input value={item.price} onChange={e => updateItem(idx, "price", parseFloat(e.target.value) || 0)} type="number" placeholder="Price"
                    className="w-20 bg-background border border-border rounded-lg py-2 px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
                  {fItems.length > 1 && (
                    <button onClick={() => removeItemRow(idx)} className="p-1"><X size={14} className="text-destructive" /></button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addItemRow} className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
              <Plus size={12} /> Add Item
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Discount</label>
              <input value={fDiscount} onChange={e => setFDiscount(e.target.value)} type="number" placeholder="0"
                className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paid Amount</label>
              <input value={fPaid} onChange={e => setFPaid(e.target.value)} type="number" placeholder="0"
                className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Method</label>
            <select value={fPayment} onChange={e => setFPayment(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Cash</option><option>Bank Transfer</option><option>Credit</option><option>UPI/QR</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</label>
            <textarea value={fNotes} onChange={e => setFNotes(e.target.value)} placeholder="Order notes..." rows={2}
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          {/* Live Total */}
          <div className="bg-accent rounded-xl p-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-card-foreground">NPR {formSubtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (13%)</span><span className="text-card-foreground">NPR {formTax.toLocaleString()}</span></div>
            {(parseFloat(fDiscount) || 0) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-success">-NPR {(parseFloat(fDiscount) || 0).toLocaleString()}</span></div>}
            <div className="flex justify-between font-bold border-t border-border pt-1"><span>Total</span><span>NPR {formTotal.toLocaleString()}</span></div>
          </div>

          <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm">
            {editingOrder ? "Update Order" : "Create Order"}
          </button>
        </div>
      </ModalShell>

      {/* Order Detail Modal */}
      <ModalShell show={!!selectedOrder && !showStatusChange} title={selectedOrder?.orderNo || ""} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedOrder.status]}`}>{selectedOrder.status}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(selectedOrder)} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium flex items-center gap-1">
                  <Edit2 size={12} /> Edit
                </button>
                {!["Delivered", "Cancelled", "Returned"].includes(selectedOrder.status) && (
                  <button onClick={() => setShowStatusChange(true)} className="text-xs bg-accent text-card-foreground px-3 py-1.5 rounded-lg font-medium">Status</button>
                )}
                <button onClick={() => handleDelete(selectedOrder.id)} className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg font-medium">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="bg-accent rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2"><User size={14} className="text-primary" /><span className="text-sm font-medium text-card-foreground">{selectedOrder.customer}</span></div>
              {selectedOrder.phone && <p className="text-xs text-muted-foreground pl-6">{selectedOrder.phone}</p>}
              <div className="flex items-center gap-2"><Calendar size={14} className="text-primary" /><span className="text-xs text-muted-foreground">{selectedOrder.date}</span></div>
              <div className="flex items-center gap-2"><CreditCard size={14} className="text-primary" /><span className="text-xs text-muted-foreground">{selectedOrder.paymentMethod}</span></div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</p>
              <div className="bg-background rounded-xl border border-border divide-y divide-border">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">Qty: {item.qty} × NPR {item.price}</p>
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">NPR {(item.qty * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-card-foreground">NPR {selectedOrder.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (13%)</span><span className="text-card-foreground">NPR {selectedOrder.tax.toLocaleString()}</span></div>
              {selectedOrder.discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="text-success">-NPR {selectedOrder.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-border"><span>Total</span><span>NPR {selectedOrder.total.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Paid</span><span className="text-success">NPR {selectedOrder.paidAmount.toLocaleString()}</span></div>
              {selectedOrder.paidAmount < selectedOrder.total && (
                <div className="flex justify-between text-sm"><span className="text-warning font-medium">Balance Due</span><span className="text-warning font-bold">NPR {(selectedOrder.total - selectedOrder.paidAmount).toLocaleString()}</span></div>
              )}
            </div>

            {selectedOrder.notes && (
              <div className="bg-accent rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Notes</p>
                <p className="text-sm text-card-foreground">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        )}
      </ModalShell>

      {/* Status Change Modal */}
      <ModalShell show={showStatusChange} title="Change Status" onClose={() => setShowStatusChange(false)}>
        {selectedOrder && (
          <div className="space-y-2">
            {([...statusFlow, "Cancelled", "Returned"] as OrderStatus[]).map(status => (
              <button key={status} onClick={() => handleStatusChange(selectedOrder, status)}
                disabled={status === selectedOrder.status}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                  status === selectedOrder.status ? "bg-primary text-primary-foreground" : "bg-background border border-border text-card-foreground hover:bg-muted"
                }`}>
                <span>{status}</span>
                {status === selectedOrder.status && <CheckCircle2 size={16} />}
              </button>
            ))}
          </div>
        )}
      </ModalShell>
    </AppShell>
  );
};

export default OrderManagementPage;

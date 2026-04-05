import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Plus, Search, Filter, Package, Clock, CheckCircle2, Truck, X,
  ChevronRight, RotateCcw, AlertCircle, ShoppingBag, Edit2, Trash2,
  User, Calendar, Hash, CreditCard, MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

type OrderStatus = "Draft" | "Pending" | "Confirmed" | "Processing" | "Ready" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  orderNo: string;
  customer: string;
  phone: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  paymentMethod: string;
  paidAmount: number;
}

const statusColors: Record<OrderStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Pending: "bg-warning/15 text-warning",
  Confirmed: "bg-primary/15 text-primary",
  Processing: "bg-blue-500/15 text-blue-600",
  Ready: "bg-emerald-500/15 text-emerald-600",
  Shipped: "bg-indigo-500/15 text-indigo-600",
  Delivered: "bg-success/15 text-success",
  Cancelled: "bg-destructive/15 text-destructive",
  Returned: "bg-orange-500/15 text-orange-600",
};

const statusFlow: OrderStatus[] = ["Draft", "Pending", "Confirmed", "Processing", "Ready", "Shipped", "Delivered"];

const initialOrders: Order[] = [
  {
    id: "1", orderNo: "ORD-001", customer: "Ram Sharma", phone: "9841234567",
    date: "2026-04-05", status: "Pending",
    items: [
      { id: "i1", name: "Notebook A5", qty: 10, price: 120 },
      { id: "i2", name: "Pen Box (12pc)", qty: 5, price: 250 },
    ],
    subtotal: 2450, tax: 318.5, discount: 100, total: 2668.5,
    notes: "Deliver before Saturday", paymentMethod: "Cash", paidAmount: 1000,
  },
  {
    id: "2", orderNo: "ORD-002", customer: "Sita Devi", phone: "9812345678",
    date: "2026-04-04", status: "Confirmed",
    items: [
      { id: "i3", name: "Rice (25kg)", qty: 2, price: 2200 },
    ],
    subtotal: 4400, tax: 572, discount: 0, total: 4972,
    notes: "", paymentMethod: "Bank Transfer", paidAmount: 4972,
  },
  {
    id: "3", orderNo: "ORD-003", customer: "Hari Bahadur", phone: "9801234567",
    date: "2026-04-03", status: "Delivered",
    items: [
      { id: "i4", name: "Cement (50kg)", qty: 10, price: 850 },
      { id: "i5", name: "Sand (truck)", qty: 1, price: 12000 },
    ],
    subtotal: 20500, tax: 2665, discount: 500, total: 22665,
    notes: "Construction site delivery", paymentMethod: "Credit", paidAmount: 15000,
  },
];

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);

  // Create form
  const [newCustomer, setNewCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newPayment, setNewPayment] = useState("Cash");
  const [newItems, setNewItems] = useState<OrderItem[]>([{ id: "n1", name: "", qty: 1, price: 0 }]);

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreateOrder = () => {
    const validItems = newItems.filter(i => i.name.trim());
    if (!newCustomer.trim() || validItems.length === 0) {
      toast.error("Customer name and at least one item required");
      return;
    }
    const subtotal = validItems.reduce((s, i) => s + i.qty * i.price, 0);
    const tax = subtotal * 0.13;
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNo: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      customer: newCustomer,
      phone: newPhone,
      date: new Date().toISOString().split("T")[0],
      status: "Draft",
      items: validItems,
      subtotal, tax, discount: 0, total: subtotal + tax,
      notes: newNotes, paymentMethod: newPayment, paidAmount: 0,
    };
    setOrders([newOrder, ...orders]);
    setShowCreate(false);
    setNewCustomer(""); setNewPhone(""); setNewNotes("");
    setNewItems([{ id: "n1", name: "", qty: 1, price: 0 }]);
    toast.success("Order created");
  };

  const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    setSelectedOrder({ ...order, status: newStatus });
    setShowStatusChange(false);
    toast.success(`Order ${order.orderNo} → ${newStatus}`);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    setSelectedOrder(null);
    toast.success("Order deleted");
  };

  const addNewItemRow = () => {
    setNewItems([...newItems, { id: `n${Date.now()}`, name: "", qty: 1, price: 0 }]);
  };

  const updateNewItem = (idx: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...newItems];
    (updated[idx] as any)[field] = value;
    setNewItems(updated);
  };

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
      {/* Search & Filter */}
      <div className="px-4 pt-3 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
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
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="bg-card border border-border rounded-xl p-4 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-card-foreground">{order.orderNo}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
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
                <span className="text-[10px] text-warning font-medium">
                  Balance: NPR {(order.total - order.paidAmount).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-20 right-4 z-40 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      >
        <Plus size={24} />
      </button>

      {/* Create Order Modal */}
      <ModalShell show={showCreate} title="Create Order" onClose={() => setShowCreate(false)}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</label>
            <input value={newCustomer} onChange={e => setNewCustomer(e.target.value)} placeholder="Customer name"
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
            <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone number" type="tel"
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</label>
            <div className="space-y-2 mt-1">
              {newItems.map((item, idx) => (
                <div key={item.id} className="flex gap-2">
                  <input value={item.name} onChange={e => updateNewItem(idx, "name", e.target.value)} placeholder="Item name"
                    className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input value={item.qty} onChange={e => updateNewItem(idx, "qty", parseInt(e.target.value) || 0)} type="number" placeholder="Qty"
                    className="w-16 bg-background border border-border rounded-lg py-2 px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input value={item.price} onChange={e => updateNewItem(idx, "price", parseFloat(e.target.value) || 0)} type="number" placeholder="Price"
                    className="w-20 bg-background border border-border rounded-lg py-2 px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ))}
            </div>
            <button onClick={addNewItemRow} className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
              <Plus size={12} /> Add Item
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Method</label>
            <select value={newPayment} onChange={e => setNewPayment(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Credit</option>
              <option>UPI/QR</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</label>
            <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Order notes..."
              rows={2} className="w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <button onClick={handleCreateOrder} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm">
            Create Order
          </button>
        </div>
      </ModalShell>

      {/* Order Detail Modal */}
      <ModalShell show={!!selectedOrder && !showStatusChange} title={selectedOrder?.orderNo || ""} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
              <div className="flex gap-2">
                {!["Delivered", "Cancelled", "Returned"].includes(selectedOrder.status) && (
                  <button onClick={() => setShowStatusChange(true)} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium">
                    Change Status
                  </button>
                )}
                <button onClick={() => handleDeleteOrder(selectedOrder.id)} className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg font-medium">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-accent rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span className="text-sm font-medium text-card-foreground">{selectedOrder.customer}</span>
              </div>
              {selectedOrder.phone && (
                <p className="text-xs text-muted-foreground pl-6">{selectedOrder.phone}</p>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span className="text-xs text-muted-foreground">{selectedOrder.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-primary" />
                <span className="text-xs text-muted-foreground">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Items */}
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

            {/* Totals */}
            <div className="bg-accent rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-card-foreground">NPR {selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (13%)</span>
                <span className="text-card-foreground">NPR {selectedOrder.tax.toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-success">-NPR {selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                <span className="text-card-foreground">Total</span>
                <span className="text-card-foreground">NPR {selectedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid</span>
                <span className="text-success">NPR {selectedOrder.paidAmount.toLocaleString()}</span>
              </div>
              {selectedOrder.paidAmount < selectedOrder.total && (
                <div className="flex justify-between text-sm">
                  <span className="text-warning font-medium">Balance Due</span>
                  <span className="text-warning font-bold">NPR {(selectedOrder.total - selectedOrder.paidAmount).toLocaleString()}</span>
                </div>
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
              <button
                key={status}
                onClick={() => handleStatusChange(selectedOrder, status)}
                disabled={status === selectedOrder.status}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                  status === selectedOrder.status
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-card-foreground hover:bg-muted"
                }`}
              >
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

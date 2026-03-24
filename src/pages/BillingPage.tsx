import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  FileText, Download, Printer, Plus, Eye, Calendar, Hash, User,
  ChevronRight, X, Receipt, IndianRupee,
} from "lucide-react";

interface InvoiceItem {
  name: string;
  qty: number;
  rate: number;
}

const sampleInvoices = [
  { id: "INV-001", customer: "Ram Sharma", date: "2026-03-20", amount: 12500, status: "Paid" },
  { id: "INV-002", customer: "Sita Poudel", date: "2026-03-18", amount: 8700, status: "Pending" },
  { id: "INV-003", customer: "Hari Thapa", date: "2026-03-15", amount: 23400, status: "Overdue" },
  { id: "INV-004", customer: "Gita KC", date: "2026-03-12", amount: 5600, status: "Paid" },
];

const templates = [
  { id: "standard", name: "Standard Invoice", desc: "Clean professional layout" },
  { id: "detailed", name: "Detailed Invoice", desc: "With item descriptions & notes" },
  { id: "receipt", name: "POS Receipt", desc: "Compact thermal receipt format" },
];

const statusColor: Record<string, string> = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Overdue: "bg-destructive/10 text-destructive",
};

const BillingPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [activeTab, setActiveTab] = useState<"invoices" | "receipts">("invoices");

  // New invoice form
  const [customer, setCustomer] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ name: "", qty: 1, rate: 0 }]);
  const [taxRate, setTaxRate] = useState(13);
  const [notes, setNotes] = useState("");

  const addItem = () => setInvoiceItems(prev => [...prev, { name: "", qty: 1, rate: 0 }]);
  const removeItem = (idx: number) => setInvoiceItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const subtotal = invoiceItems.reduce((s, i) => s + i.qty * i.rate, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const previewInvoice = showPreview ? sampleInvoices.find(i => i.id === showPreview) : null;

  return (
    <AppShell headerTitle="Billing & Invoices">
      {/* Summary Cards */}
      <div className="px-4 pt-4 grid grid-cols-3 gap-2">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Total</p>
          <p className="text-lg font-bold text-card-foreground">12</p>
          <p className="text-[10px] text-muted-foreground">Invoices</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Pending</p>
          <p className="text-lg font-bold text-warning">3</p>
          <p className="text-[10px] text-muted-foreground">₹26,100</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Overdue</p>
          <p className="text-lg font-bold text-destructive">1</p>
          <p className="text-[10px] text-muted-foreground">₹23,400</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4">
        {(["invoices", "receipts"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {tab === "invoices" ? "Invoices" : "Receipts"}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pt-3">
        <button
          onClick={() => setShowCreate(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
        >
          <Plus size={16} /> New Invoice
        </button>
        <button
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-medium text-card-foreground"
        >
          <FileText size={16} /> Templates
        </button>
      </div>

      {/* Invoice List */}
      <SectionHeader title={activeTab === "invoices" ? "Recent Invoices" : "Recent Receipts"} />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
        {sampleInvoices.map(inv => (
          <button
            key={inv.id}
            onClick={() => setShowPreview(inv.id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Receipt size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-card-foreground">{inv.id}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[inv.status]}`}>
                  {inv.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{inv.customer} • {inv.date}</p>
            </div>
            <p className="text-sm font-bold text-card-foreground">₹{inv.amount.toLocaleString()}</p>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Create Invoice Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-background rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background px-4 py-3 border-b border-border flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-foreground">Create Invoice</h2>
              <button onClick={() => setShowCreate(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="p-4 space-y-4">
              {/* Customer */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Customer Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Enter customer name"
                    className="w-full bg-card border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              {/* Template */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Template</label>
                <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              {/* Items */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Items</label>
                {invoiceItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-start">
                    <input value={item.name} onChange={e => updateItem(idx, "name", e.target.value)} placeholder="Item"
                      className="flex-1 bg-card border border-border rounded-lg py-2 px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input type="number" value={item.qty} onChange={e => updateItem(idx, "qty", Number(e.target.value))} placeholder="Qty"
                      className="w-16 bg-card border border-border rounded-lg py-2 px-2 text-sm text-center text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input type="number" value={item.rate || ""} onChange={e => updateItem(idx, "rate", Number(e.target.value))} placeholder="Rate"
                      className="w-24 bg-card border border-border rounded-lg py-2 px-2 text-sm text-right text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    {invoiceItems.length > 1 && (
                      <button onClick={() => removeItem(idx)} className="mt-2 text-destructive"><X size={16} /></button>
                    )}
                  </div>
                ))}
                <button onClick={addItem} className="text-xs text-primary font-semibold flex items-center gap-1 mt-1">
                  <Plus size={12} /> Add Item
                </button>
              </div>

              {/* Tax */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tax Rate (%)</label>
                <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}
                  className="w-full bg-card border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Payment terms, thank you message..."
                  className="w-full bg-card border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              {/* Totals */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                  <span className="text-card-foreground font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                  <FileText size={16} /> Save Invoice
                </button>
                <button className="py-3 px-4 rounded-xl bg-card border border-border text-card-foreground font-medium text-sm flex items-center gap-2">
                  <Download size={16} /> PDF
                </button>
                <button className="py-3 px-4 rounded-xl bg-card border border-border text-card-foreground font-medium text-sm flex items-center gap-2">
                  <Printer size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-background px-4 py-3 border-b border-border flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-foreground">Invoice Preview</h2>
              <button onClick={() => setShowPreview(null)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="p-4 space-y-4">
              {/* Invoice Header */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary">eLekha</h3>
                    <p className="text-[10px] text-muted-foreground">Business Management</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-card-foreground">{previewInvoice.id}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar size={10} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{previewInvoice.date}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">Bill To</p>
                  <p className="text-sm font-semibold text-card-foreground">{previewInvoice.customer}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-muted">
                  <p className="text-[10px] font-semibold text-muted-foreground col-span-2">Item</p>
                  <p className="text-[10px] font-semibold text-muted-foreground text-center">Qty</p>
                  <p className="text-[10px] font-semibold text-muted-foreground text-right">Amount</p>
                </div>
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-4 gap-2 px-4 py-2.5">
                    <p className="text-sm text-card-foreground col-span-2">Sample Item 1</p>
                    <p className="text-sm text-card-foreground text-center">2</p>
                    <p className="text-sm font-medium text-card-foreground text-right">₹5,000</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 px-4 py-2.5">
                    <p className="text-sm text-card-foreground col-span-2">Sample Item 2</p>
                    <p className="text-sm text-card-foreground text-center">1</p>
                    <p className="text-sm font-medium text-card-foreground text-right">₹{(previewInvoice.amount - 5000).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground">₹{Math.round(previewInvoice.amount / 1.13).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT (13%)</span>
                  <span className="text-card-foreground">₹{(previewInvoice.amount - Math.round(previewInvoice.amount / 1.13)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-primary">₹{previewInvoice.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center">
                <span className={`text-sm px-4 py-2 rounded-full font-semibold ${statusColor[previewInvoice.status]}`}>
                  {previewInvoice.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                  <Download size={16} /> Export PDF
                </button>
                <button className="flex-1 py-3 rounded-xl bg-card border border-border text-card-foreground font-semibold text-sm flex items-center justify-center gap-2">
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-background rounded-t-2xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Invoice Templates</h2>
              <button onClick={() => setShowTemplates(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="p-4 space-y-3">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t.id); setShowTemplates(false); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                    selectedTemplate === t.id ? "border-primary bg-accent" : "border-border bg-card"
                  }`}
                >
                  <div className="w-12 h-14 rounded-lg bg-muted flex items-center justify-center border border-border">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  {selectedTemplate === t.id && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default BillingPage;
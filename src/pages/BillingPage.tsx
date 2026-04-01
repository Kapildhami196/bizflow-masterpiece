import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  FileText, Download, Printer, Plus, Eye, Calendar, Hash, User,
  ChevronRight, X, Receipt, IndianRupee, Upload, ImageIcon, Camera,
} from "lucide-react";
import { toast } from "sonner";

interface InvoiceItem {
  name: string;
  qty: number;
  rate: number;
}

const initialInvoices = [
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
  const [activeTab, setActiveTab] = useState<"invoices" | "receipts" | "photos">("invoices");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [editingInvoice, setEditingInvoice] = useState<typeof initialInvoices[0] | null>(null);
  const [billPhotos, setBillPhotos] = useState<{ id: number; url: string; name: string; date: string }[]>([]);
  const billPhotoRef = useRef<HTMLInputElement>(null);

  // Form state
  const [customer, setCustomer] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ name: "", qty: 1, rate: 0 }]);
  const [taxRate, setTaxRate] = useState(13);
  const [notes, setNotes] = useState("");
  const [invStatus, setInvStatus] = useState("Pending");

  const addItem = () => setInvoiceItems(prev => [...prev, { name: "", qty: 1, rate: 0 }]);
  const removeItem = (idx: number) => setInvoiceItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const subtotal = invoiceItems.reduce((s, i) => s + i.qty * i.rate, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const openCreate = () => {
    setEditingInvoice(null);
    setCustomer(""); setInvoiceItems([{ name: "", qty: 1, rate: 0 }]); setTaxRate(13); setNotes(""); setInvStatus("Pending");
    setShowCreate(true);
  };

  const openEdit = (inv: typeof initialInvoices[0]) => {
    setEditingInvoice(inv);
    setCustomer(inv.customer);
    setInvStatus(inv.status);
    setInvoiceItems([{ name: "Item 1", qty: 1, rate: Math.round(inv.amount / 1.13) }]);
    setTaxRate(13);
    setNotes("");
    setShowCreate(true);
  };

  const handleSave = () => {
    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? {
        ...inv,
        customer: customer || inv.customer,
        amount: total || inv.amount,
        status: invStatus,
      } : inv));
    }
    setShowCreate(false);
    setEditingInvoice(null);
    toast.success(editingInvoice ? "Invoice updated" : "Invoice created");
  };

  const handleDelete = () => {
    if (editingInvoice) setInvoices(prev => prev.filter(inv => inv.id !== editingInvoice.id));
    setShowCreate(false);
    setEditingInvoice(null);
    toast.success("Invoice deleted");
  };

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      toast.error("Popup blocked. Please allow popups.");
      return;
    }
    const now = new Date();
    printWindow.document.write(`
      <html><head><title>Invoice</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; max-width:700px; margin:0 auto; padding:30px; font-size:13px; color:#333; }
        .header { display:flex; justify-content:space-between; border-bottom:2px solid #1a56db; padding-bottom:16px; margin-bottom:20px; }
        .header h1 { font-size:24px; color:#1a56db; }
        .info-row { display:flex; justify-content:space-between; margin-bottom:16px; }
        .info-block p { margin:2px 0; }
        table { width:100%; border-collapse:collapse; margin:16px 0; }
        th { background:#f3f4f6; padding:8px 12px; text-align:left; font-size:12px; border-bottom:2px solid #e5e7eb; }
        td { padding:8px 12px; border-bottom:1px solid #e5e7eb; }
        .total-section { text-align:right; margin-top:16px; }
        .total-section .row { display:flex; justify-content:flex-end; gap:40px; padding:4px 0; }
        .grand-total { font-size:18px; font-weight:bold; color:#1a56db; border-top:2px solid #1a56db; padding-top:8px; margin-top:8px; }
        .footer { text-align:center; margin-top:30px; font-size:11px; color:#999; }
      </style></head><body>
        <div class="header">
          <div>
            <h1>eLekha</h1>
            <p>Business Management</p>
          </div>
          <div style="text-align:right;">
            <h2>INVOICE</h2>
            <p>${editingInvoice?.id || "INV-NEW"}</p>
            <p>${now.toLocaleDateString()}</p>
          </div>
        </div>
        <div class="info-row">
          <div class="info-block">
            <p><strong>Bill To:</strong></p>
            <p>${customer || "Customer"}</p>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>
            ${invoiceItems.map((item, i) => `
              <tr><td>${i + 1}</td><td>${item.name || "-"}</td><td>${item.qty}</td><td>NPR ${item.rate.toLocaleString()}</td><td>NPR ${(item.qty * item.rate).toLocaleString()}</td></tr>
            `).join("")}
          </tbody>
        </table>
        <div class="total-section">
          <div class="row"><span>Subtotal:</span><span>NPR ${subtotal.toLocaleString()}</span></div>
          <div class="row"><span>Tax (${taxRate}%):</span><span>NPR ${tax.toLocaleString()}</span></div>
          <div class="row grand-total"><span>Total:</span><span>NPR ${total.toLocaleString()}</span></div>
        </div>
        ${notes ? `<div style="margin-top:20px;padding:12px;background:#f9fafb;border-radius:8px;"><strong>Notes:</strong><p>${notes}</p></div>` : ""}
        <div class="footer"><p>Thank you for your business! • Powered by eLekha</p></div>
        <script>window.print();</script>
      </body></html>
    `);
    printWindow.document.close();
    toast.success("Invoice sent to printer");
  };

  const handleBillPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: reader.result as string,
          name: file.name,
          date: new Date().toLocaleDateString(),
        }]);
      };
      reader.readAsDataURL(file);
    });
    toast.success(`${files.length} bill photo(s) uploaded`);
  };

  const removeBillPhoto = (id: number) => {
    setBillPhotos(prev => prev.filter(p => p.id !== id));
    toast.success("Photo removed");
  };

  return (
    <AppShell headerTitle="Billing & Invoices">
      <div className="px-4 pt-4 grid grid-cols-3 gap-2">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Total</p>
          <p className="text-lg font-bold text-card-foreground">{invoices.length}</p>
          <p className="text-[10px] text-muted-foreground">Invoices</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Pending</p>
          <p className="text-lg font-bold text-warning">{invoices.filter(i => i.status === "Pending").length}</p>
          <p className="text-[10px] text-muted-foreground">NPR {invoices.filter(i => i.status === "Pending").reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Overdue</p>
          <p className="text-lg font-bold text-destructive">{invoices.filter(i => i.status === "Overdue").length}</p>
          <p className="text-[10px] text-muted-foreground">NPR {invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs: invoices / receipts / photos */}
      <div className="flex gap-2 px-4 pt-4">
        {(["invoices", "receipts", "photos"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}>
            {tab === "invoices" ? "Invoices" : tab === "receipts" ? "Receipts" : "Bill Photos"}
          </button>
        ))}
      </div>

      {activeTab !== "photos" ? (
        <>
          <div className="flex gap-2 px-4 pt-3">
            <button onClick={openCreate}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">
              <Plus size={16} /> New Invoice
            </button>
            <button onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-medium text-card-foreground">
              <FileText size={16} /> Templates
            </button>
          </div>

          <SectionHeader title={activeTab === "invoices" ? "Recent Invoices" : "Recent Receipts"} />
          <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
            {invoices.map(inv => (
              <button key={inv.id} onClick={() => openEdit(inv)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Receipt size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-card-foreground">{inv.id}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[inv.status]}`}>{inv.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{inv.customer} • {inv.date}</p>
                </div>
                <p className="text-sm font-bold text-card-foreground">NPR {inv.amount.toLocaleString()}</p>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </>
      ) : (
        /* Bill Photos Tab */
        <div className="px-4 pt-3 pb-4">
          <input type="file" ref={billPhotoRef} accept="image/*" multiple onChange={handleBillPhotoUpload} className="hidden" />
          <button
            onClick={() => billPhotoRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold mb-4"
          >
            <Camera size={16} /> Upload Bill Photo
          </button>

          {billPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {billPhotos.map(photo => (
                <div key={photo.id} className="bg-card rounded-xl border border-border overflow-hidden group relative">
                  <img src={photo.url} alt={photo.name} className="w-full h-32 object-cover" />
                  <div className="p-2">
                    <p className="text-[10px] font-medium text-card-foreground truncate">{photo.name}</p>
                    <p className="text-[9px] text-muted-foreground">{photo.date}</p>
                  </div>
                  <button
                    onClick={() => removeBillPhoto(photo.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <ImageIcon size={32} className="mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No bill photos yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload photos of your bills and receipts for records</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Invoice Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card px-4 py-3 border-b border-border flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-card-foreground">{editingInvoice ? "Edit Invoice" : "Create Invoice"}</h2>
              <button onClick={() => { setShowCreate(false); setEditingInvoice(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Customer Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Enter customer name"
                    className="w-full bg-background border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              {editingInvoice && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Status</label>
                  <select value={invStatus} onChange={e => setInvStatus(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Paid</option><option>Pending</option><option>Overdue</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Template</label>
                <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Items</label>
                {invoiceItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-start">
                    <input value={item.name} onChange={e => updateItem(idx, "name", e.target.value)} placeholder="Item"
                      className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input type="number" value={item.qty} onChange={e => updateItem(idx, "qty", Number(e.target.value))} placeholder="Qty"
                      className="w-16 bg-background border border-border rounded-lg py-2 px-2 text-sm text-center text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <input type="number" value={item.rate || ""} onChange={e => updateItem(idx, "rate", Number(e.target.value))} placeholder="Rate"
                      className="w-24 bg-background border border-border rounded-lg py-2 px-2 text-sm text-right text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    {invoiceItems.length > 1 && (
                      <button onClick={() => removeItem(idx)} className="mt-2 text-destructive"><X size={16} /></button>
                    )}
                  </div>
                ))}
                <button onClick={addItem} className="text-xs text-primary font-semibold flex items-center gap-1 mt-1">
                  <Plus size={12} /> Add Item
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tax Rate (%)</label>
                <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Payment terms, thank you message..."
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <div className="bg-background rounded-xl border border-border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground font-medium">NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                  <span className="text-card-foreground font-medium">NPR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-primary">NPR {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                  <FileText size={16} /> {editingInvoice ? "Update" : "Save"}
                </button>
                <button onClick={handlePrintInvoice} className="py-3 px-4 rounded-xl bg-card border border-border text-card-foreground font-medium text-sm flex items-center gap-2">
                  <Printer size={16} /> Print
                </button>
                <button className="py-3 px-4 rounded-xl bg-card border border-border text-card-foreground font-medium text-sm flex items-center gap-2">
                  <Download size={16} /> PDF
                </button>
              </div>
              {editingInvoice && (
                <button onClick={handleDelete} className="w-full border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm">
                  Delete Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-card-foreground">Invoice Templates</h2>
              <button onClick={() => setShowTemplates(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="p-4 space-y-3">
              {templates.map(t => (
                <button key={t.id} onClick={() => { setSelectedTemplate(t.id); setShowTemplates(false); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                    selectedTemplate === t.id ? "border-primary bg-accent" : "border-border bg-card"
                  }`}>
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

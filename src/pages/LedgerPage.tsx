import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Users, TrendingUp, TrendingDown, AlertCircle, Clock, CheckCircle, Plus, X } from "lucide-react";

const initialParties = [
  { id: 1, name: "Ram Kumar", type: "customer", balance: 15000, direction: "receivable" as const },
  { id: 2, name: "Shyam Store", type: "supplier", balance: 8500, direction: "payable" as const },
  { id: 3, name: "Hari Bahadur", type: "customer", balance: 3200, direction: "receivable" as const },
  { id: 4, name: "Sita Devi", type: "customer", balance: 12000, direction: "receivable" as const },
  { id: 5, name: "Pokhara Traders", type: "supplier", balance: 22000, direction: "payable" as const },
];

const LedgerPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [parties, setParties] = useState(initialParties);
  const [editingItem, setEditingItem] = useState<typeof initialParties[0] | null>(null);

  const [fParty, setFParty] = useState("");
  const [fType, setFType] = useState("Sale (Receivable)");
  const [fAmount, setFAmount] = useState("");
  const [fDate, setFDate] = useState("");
  const [fDueDate, setFDueDate] = useState("");
  const [fRemarks, setFRemarks] = useState("");

  const totalReceivable = parties.filter(p => p.direction === "receivable").reduce((sum, p) => sum + p.balance, 0);
  const totalPayable = parties.filter(p => p.direction === "payable").reduce((sum, p) => sum + p.balance, 0);

  const openNew = () => {
    setEditingItem(null);
    setFParty(""); setFType("Sale (Receivable)"); setFAmount(""); setFDate(""); setFDueDate(""); setFRemarks("");
    setShowForm(true);
  };

  const openEdit = (party: typeof initialParties[0]) => {
    setEditingItem(party);
    setFParty(party.name);
    setFType(party.direction === "receivable" ? "Sale (Receivable)" : "Purchase (Payable)");
    setFAmount(party.balance.toString());
    setFDate(""); setFDueDate(""); setFRemarks("");
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setParties(prev => prev.map(p => p.id === editingItem.id ? {
        ...p,
        name: fParty || p.name,
        balance: fAmount ? parseInt(fAmount) : p.balance,
        direction: fType.includes("Receivable") ? "receivable" as const : "payable" as const,
        type: fType.includes("Receivable") ? "customer" : "supplier",
      } : p));
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (editingItem) setParties(prev => prev.filter(p => p.id !== editingItem.id));
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <AppShell headerTitle="Ledger">
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-success" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">To Receive</p>
          <p className="text-lg font-bold text-success">NPR {totalReceivable.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center">
              <TrendingDown size={16} className="text-destructive" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">To Pay</p>
          <p className="text-lg font-bold text-destructive">NPR {totalPayable.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pt-3">
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <AlertCircle size={16} className="text-destructive mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">3</p>
          <p className="text-[10px] text-muted-foreground">Overdue</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <Clock size={16} className="text-warning mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">5</p>
          <p className="text-[10px] text-muted-foreground">Due Today</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <CheckCircle size={16} className="text-success mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">12</p>
          <p className="text-[10px] text-muted-foreground">Settled</p>
        </div>
      </div>

      <SectionHeader title="Parties" actionLabel="View All" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {parties.map((party) => (
          <button key={party.id} onClick={() => openEdit(party)} className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <Users size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-card-foreground">{party.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{party.type}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${party.direction === "receivable" ? "text-success" : "text-destructive"}`}>
                NPR {party.balance.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">{party.direction === "receivable" ? "To Receive" : "To Pay"}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-4">
        <button onClick={openNew} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <Plus size={18} /> Add Ledger Entry
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">{editingItem ? "Edit Entry" : "New Ledger Entry"}</h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); }}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input value={fParty} onChange={e => setFParty(e.target.value)} placeholder="Party Name *" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={fType} onChange={e => setFType(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Sale (Receivable)</option>
                <option>Purchase (Payable)</option>
                <option>Payment Received</option>
                <option>Payment Made</option>
              </select>
              <input value={fAmount} onChange={e => setFAmount(e.target.value)} placeholder="Amount (NPR) *" type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={fDate} onChange={e => setFDate(e.target.value)} type="date" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input value={fDueDate} onChange={e => setFDueDate(e.target.value)} placeholder="Due Date" type="date" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea value={fRemarks} onChange={e => setFRemarks(e.target.value)} placeholder="Remarks" rows={2} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
                {editingItem ? "Update Entry" : "Save Entry"}
              </button>
              {editingItem && (
                <button onClick={handleDelete} className="w-full border border-destructive text-destructive py-3 rounded-xl font-semibold text-sm">
                  Delete Entry
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default LedgerPage;
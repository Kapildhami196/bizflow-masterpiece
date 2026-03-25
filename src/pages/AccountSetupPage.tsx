import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, User, Plus, ChevronRight, Building2, Sparkles } from "lucide-react";

const existingAccounts = [
  { id: 1, name: "My Business", type: "business" as const, desc: "Kathmandu, Nepal" },
];

const AccountSetupPage = () => {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState<"personal" | "business">("personal");
  const [accName, setAccName] = useState("");
  const [accDesc, setAccDesc] = useState("");

  const handleSelect = () => {
    navigate("/");
  };

  const handleCreate = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      {/* Header */}
      <div className="bg-header text-header-foreground px-6 pt-10 pb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={28} />
        </div>
        <h1 className="text-2xl font-bold">Welcome to eLekha</h1>
        <p className="text-sm opacity-80 mt-1">Choose or create an account to get started</p>
      </div>
      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 px-5 pt-6 pb-8">
        {/* Existing Accounts */}
        {existingAccounts.length > 0 && (
          <>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Accounts</p>
            <div className="space-y-2 mb-6">
              {existingAccounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={handleSelect}
                  className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                    {acc.type === "business" ? <Briefcase size={20} className="text-primary" /> : <User size={20} className="text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-card-foreground">{acc.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{acc.type} • {acc.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Create New Section */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Create New</p>
        <div className="space-y-3">
          <button
            onClick={() => { setCreateType("personal"); setShowCreate(true); setAccName(""); setAccDesc(""); }}
            className="w-full flex items-center gap-4 bg-card border-2 border-dashed border-primary/30 rounded-xl p-5 hover:border-primary/60 transition-colors text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <User size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-card-foreground">Personal Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Track personal finances, expenses & savings</p>
            </div>
            <Plus size={20} className="text-primary shrink-0" />
          </button>

          <button
            onClick={() => { setCreateType("business"); setShowCreate(true); setAccName(""); setAccDesc(""); }}
            className="w-full flex items-center gap-4 bg-card border-2 border-dashed border-primary/30 rounded-xl p-5 hover:border-primary/60 transition-colors text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-card-foreground">Business Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Full business management with POS, inventory & billing</p>
            </div>
            <Plus size={20} className="text-primary shrink-0" />
          </button>
        </div>
      </main>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-card-foreground">
                {createType === "personal" ? "Create Personal Account" : "Create Business Account"}
              </h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-accent">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                {createType === "personal" ? <User size={18} className="text-primary" /> : <Building2 size={18} className="text-primary" />}
              </div>
              <p className="text-sm text-card-foreground font-medium capitalize">{createType} Account</p>
            </div>

            <div className="space-y-3">
              <input
                value={accName}
                onChange={e => setAccName(e.target.value)}
                placeholder={createType === "personal" ? "Your Name *" : "Business Name *"}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {createType === "business" && (
                <>
                  <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Business Type</option>
                    <option>Retail Shop</option>
                    <option>Wholesale</option>
                    <option>Restaurant / Cafe</option>
                    <option>Services</option>
                    <option>Manufacturing</option>
                    <option>Freelance</option>
                    <option>Other</option>
                  </select>
                  <input
                    placeholder="PAN / Tax Registration"
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </>
              )}
              <input
                value={accDesc}
                onChange={e => setAccDesc(e.target.value)}
                placeholder={createType === "personal" ? "City / Location" : "Business Address"}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                placeholder="Phone Number"
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>NPR - Nepali Rupee</option>
                <option>INR - Indian Rupee</option>
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
              </select>
              <button
                onClick={handleCreate}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm"
              >
                Create & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSetupPage;

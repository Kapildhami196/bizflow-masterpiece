import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MenuListItem } from "@/components/shared/MenuListItem";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Building2, Globe, Bell, Shield, Palette, Download,
  Upload, HelpCircle, FileText, LogOut, Users, Crown,
  Calculator, StickyNote, X,
} from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "ne", label: "नेपाली (Nepali)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "zh", label: "中文 (Chinese)" },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [showLangModal, setShowLangModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [showTaxCalc, setShowTaxCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [taxAmount, setTaxAmount] = useState("");
  const [taxRate, setTaxRate] = useState("13");
  const [taxType, setTaxType] = useState<"exclusive" | "inclusive">("exclusive");
  const [notes, setNotes] = useState("");

  const calcTax = () => {
    const amt = parseFloat(taxAmount) || 0;
    const rate = parseFloat(taxRate) || 0;
    if (taxType === "exclusive") {
      const tax = (amt * rate) / 100;
      return { base: amt, tax, total: amt + tax };
    } else {
      const base = amt / (1 + rate / 100);
      const tax = amt - base;
      return { base, tax, total: amt };
    }
  };

  const currentLang = languages.find(l => l.code === selectedLang)?.label || "English";

  return (
    <AppShell headerTitle="Settings">
      {/* Business */}
      <SectionHeader title="Business" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem icon={<Building2 size={18} />} title="Business Profile" subtitle="Name, address, tax ID, logo" />
        <MenuListItem icon={<Users size={18} />} title="User Management" subtitle="Roles, permissions, staff access" />
        <MenuListItem icon={<Crown size={18} />} title="Subscription" subtitle="Current plan: Platinum" />
      </div>

      {/* Preferences */}
      <SectionHeader title="Preferences" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem
          icon={<Globe size={18} />}
          title="Language & Currency"
          subtitle={`${currentLang} • NPR`}
          onClick={() => setShowLangModal(true)}
        />
        <MenuListItem icon={<Bell size={18} />} title="Notifications" subtitle="Reminders, alerts, due notifications" />
        <MenuListItem icon={<Palette size={18} />} title="Appearance" subtitle="Theme, display settings" />
      </div>

      {/* Tools */}
      <SectionHeader title="Tools" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem
          icon={<Calculator size={18} />}
          title="Tax / GST / VAT Calculator"
          subtitle="Calculate tax on amounts"
          onClick={() => setShowTaxCalc(true)}
        />
        <MenuListItem
          icon={<StickyNote size={18} />}
          title="Notes"
          subtitle="Quick business notes"
          onClick={() => setShowNotes(true)}
        />
      </div>

      {/* Data */}
      <SectionHeader title="Data" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem icon={<Upload size={18} />} title="Import Data" subtitle="Import products, parties, balances" />
        <MenuListItem icon={<Download size={18} />} title="Export Data" subtitle="Export CSV / Excel / PDF" />
      </div>

      {/* Support */}
      <SectionHeader title="Support" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
        <MenuListItem icon={<Shield size={18} />} title="Security" subtitle="Password, biometrics, 2FA" />
        <MenuListItem icon={<HelpCircle size={18} />} title="Help & FAQ" subtitle="Guides, tutorials, contact" />
        <MenuListItem icon={<FileText size={18} />} title="Terms & Privacy" subtitle="Legal information" />
        <MenuListItem
          icon={<LogOut size={18} />}
          title="Logout"
          subtitle="Sign out of your account"
          iconBgClass="bg-destructive/15 text-destructive"
          onClick={() => navigate("/auth")}
        />
      </div>

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">Select Language</h2>
              <button onClick={() => setShowLangModal(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-1">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setSelectedLang(lang.code); setShowLangModal(false); }}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                    selectedLang === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "text-card-foreground hover:bg-muted"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tax Calculator Modal */}
      {showTaxCalc && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">Tax Calculator</h2>
              <button onClick={() => setShowTaxCalc(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex bg-muted rounded-xl p-1">
                <button
                  onClick={() => setTaxType("exclusive")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${taxType === "exclusive" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Tax Exclusive
                </button>
                <button
                  onClick={() => setTaxType("inclusive")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${taxType === "inclusive" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Tax Inclusive
                </button>
              </div>
              <input
                value={taxAmount}
                onChange={e => setTaxAmount(e.target.value)}
                placeholder="Enter Amount (NPR)"
                type="number"
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="5">GST 5%</option>
                <option value="12">GST 12%</option>
                <option value="13">VAT 13%</option>
                <option value="18">GST 18%</option>
                <option value="28">GST 28%</option>
              </select>

              {taxAmount && (
                <div className="bg-accent rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Amount</span>
                    <span className="font-semibold text-card-foreground">NPR {calcTax().base.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                    <span className="font-semibold text-primary">NPR {calcTax().tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="font-bold text-card-foreground">Total</span>
                    <span className="font-bold text-card-foreground">NPR {calcTax().total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">Business Notes</h2>
              <button onClick={() => setShowNotes(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              rows={8}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <button onClick={() => setShowNotes(false)} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm mt-3">
              Save Notes
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default SettingsPage;

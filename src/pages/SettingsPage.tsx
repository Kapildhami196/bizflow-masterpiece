import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MenuListItem } from "@/components/shared/MenuListItem";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Building2, Globe, Bell, Shield, Palette, Download,
  Upload, HelpCircle, FileText, LogOut, Users, Crown,
  Calculator, StickyNote, X, Sun, Moon, Monitor, Check,
  BellRing, BellOff, Mail, MessageSquare, Clock, Lock,
  Fingerprint, Key, ChevronRight, ExternalLink, Phone, Bug,
  Star, Heart,
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
  const [showAppearance, setShowAppearance] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [taxAmount, setTaxAmount] = useState("");
  const [taxRate, setTaxRate] = useState("13");
  const [taxType, setTaxType] = useState<"exclusive" | "inclusive">("exclusive");
  const [notes, setNotes] = useState("");

  // Appearance
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [dueAlerts, setDueAlerts] = useState(true);
  const [txnAlerts, setTxnAlerts] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  // Security
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

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

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        enabled ? "bg-primary" : "bg-muted"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  const ModalShell = ({ show, title, onClose, children }: { show: boolean; title: string; onClose: () => void; children: React.ReactNode }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end">
        <div className="w-full max-w-md mx-auto bg-card rounded-t-2xl animate-in slide-in-from-bottom max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-5 pb-3 shrink-0">
            <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
            <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
          </div>
          <div className="overflow-y-auto px-5 pb-5 flex-1">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <AppShell headerTitle="Settings">
      {/* Business */}
      <SectionHeader title="Business" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem icon={<Building2 size={18} />} title="Business Profile" subtitle="Name, address, tax ID, logo" />
        <MenuListItem icon={<Users size={18} />} title="User Management" subtitle="Roles, permissions, staff access" onClick={() => navigate("/user-management")} />
        <MenuListItem icon={<Crown size={18} />} title="Subscription" subtitle="Current plan: Platinum" onClick={() => navigate("/subscription")} />
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
        <MenuListItem
          icon={<Bell size={18} />}
          title="Notifications"
          subtitle="Reminders, alerts, due notifications"
          onClick={() => setShowNotifications(true)}
        />
        <MenuListItem
          icon={<Palette size={18} />}
          title="Appearance"
          subtitle="Theme, display settings"
          onClick={() => setShowAppearance(true)}
        />
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
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem
          icon={<Shield size={18} />}
          title="Security"
          subtitle="Password, biometrics, 2FA"
          onClick={() => setShowSecurity(true)}
        />
        <MenuListItem
          icon={<HelpCircle size={18} />}
          title="Help & FAQ"
          subtitle="Guides, tutorials, contact"
          onClick={() => setShowHelp(true)}
        />
        <MenuListItem
          icon={<FileText size={18} />}
          title="Terms & Privacy"
          subtitle="Legal information"
          onClick={() => setShowTerms(true)}
        />
        <MenuListItem
          icon={<Star size={18} />}
          title="Rate e-Lekha"
          subtitle="Love the app? Rate us 5 stars"
          iconBgClass="bg-warning/15 text-warning"
        />
        <MenuListItem
          icon={<Bug size={18} />}
          title="Report a Bug"
          subtitle="Help us improve the app"
        />
      </div>

      <div className="mx-4 mt-4 mb-4">
        <button
          onClick={() => navigate("/auth")}
          className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive py-3.5 rounded-xl font-semibold text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
        <p className="text-center text-[10px] text-muted-foreground mt-3">e-Lekha v1.0.0</p>
      </div>

      {/* ===== MODALS ===== */}

      {/* Language Modal */}
      <ModalShell show={showLangModal} title="Select Language" onClose={() => setShowLangModal(false)}>
        <div className="space-y-1">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setSelectedLang(lang.code); setShowLangModal(false); }}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                selectedLang === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "text-card-foreground hover:bg-muted"
              }`}
            >
              {lang.label}
              {selectedLang === lang.code && <Check size={16} />}
            </button>
          ))}
        </div>
      </ModalShell>

      {/* Appearance Modal */}
      <ModalShell show={showAppearance} title="Appearance" onClose={() => setShowAppearance(false)}>
        <div className="space-y-5">
          {/* Theme */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: "light" as const, icon: <Sun size={18} />, label: "Light" },
                { key: "dark" as const, icon: <Moon size={18} />, label: "Dark" },
                { key: "system" as const, icon: <Monitor size={18} />, label: "System" },
              ]).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-colors ${
                    theme === t.key
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {t.icon}
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Text Size</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: "small" as const, label: "Small", sample: "Aa" },
                { key: "medium" as const, label: "Medium", sample: "Aa" },
                { key: "large" as const, label: "Large", sample: "Aa" },
              ]).map(f => (
                <button
                  key={f.key}
                  onClick={() => setFontSize(f.key)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-colors ${
                    fontSize === f.key
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  <span className={`font-bold ${f.key === "small" ? "text-sm" : f.key === "medium" ? "text-base" : "text-lg"}`}>{f.sample}</span>
                  <span className="text-[10px] font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-card-foreground">Compact Mode</p>
              <p className="text-xs text-muted-foreground">Reduce spacing for more content</p>
            </div>
            <Toggle enabled={compactMode} onToggle={() => setCompactMode(!compactMode)} />
          </div>
        </div>
      </ModalShell>

      {/* Notifications Modal */}
      <ModalShell show={showNotifications} title="Notifications" onClose={() => setShowNotifications(false)}>
        <div className="space-y-5">
          {/* Channels */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Channels</p>
            <div className="bg-background rounded-xl border border-border divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <BellRing size={16} className="text-primary" />
                  <span className="text-sm font-medium text-card-foreground">Push Notifications</span>
                </div>
                <Toggle enabled={pushEnabled} onToggle={() => setPushEnabled(!pushEnabled)} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-primary" />
                  <span className="text-sm font-medium text-card-foreground">Email Notifications</span>
                </div>
                <Toggle enabled={emailEnabled} onToggle={() => setEmailEnabled(!emailEnabled)} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-primary" />
                  <span className="text-sm font-medium text-card-foreground">SMS Alerts</span>
                </div>
                <Toggle enabled={smsEnabled} onToggle={() => setSmsEnabled(!smsEnabled)} />
              </div>
            </div>
          </div>

          {/* Alert Types */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Alert Types</p>
            <div className="bg-background rounded-xl border border-border divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Payment Reminders</p>
                  <p className="text-[10px] text-muted-foreground">Due date & overdue alerts</p>
                </div>
                <Toggle enabled={reminderEnabled} onToggle={() => setReminderEnabled(!reminderEnabled)} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Due Alerts</p>
                  <p className="text-[10px] text-muted-foreground">EMI, loan & invoice dues</p>
                </div>
                <Toggle enabled={dueAlerts} onToggle={() => setDueAlerts(!dueAlerts)} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Transaction Alerts</p>
                  <p className="text-[10px] text-muted-foreground">Income & expense notifications</p>
                </div>
                <Toggle enabled={txnAlerts} onToggle={() => setTxnAlerts(!txnAlerts)} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Marketing & Updates</p>
                  <p className="text-[10px] text-muted-foreground">New features & promotions</p>
                </div>
                <Toggle enabled={marketingEnabled} onToggle={() => setMarketingEnabled(!marketingEnabled)} />
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="flex items-center gap-3 bg-accent rounded-xl px-4 py-3">
            <Clock size={16} className="text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Quiet Hours</p>
              <p className="text-[10px] text-muted-foreground">10:00 PM - 7:00 AM</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </div>
      </ModalShell>

      {/* Security Modal */}
      <ModalShell show={showSecurity} title="Security" onClose={() => setShowSecurity(false)}>
        <div className="space-y-5">
          <div className="bg-background rounded-xl border border-border divide-y divide-border">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Change Password</p>
                  <p className="text-[10px] text-muted-foreground">Last changed 30 days ago</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Fingerprint size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Biometric Login</p>
                  <p className="text-[10px] text-muted-foreground">Fingerprint or Face ID</p>
                </div>
              </div>
              <Toggle enabled={biometricEnabled} onToggle={() => setBiometricEnabled(!biometricEnabled)} />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Key size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Two-Factor Auth (2FA)</p>
                  <p className="text-[10px] text-muted-foreground">Extra layer of security</p>
                </div>
              </div>
              <Toggle enabled={twoFAEnabled} onToggle={() => setTwoFAEnabled(!twoFAEnabled)} />
            </div>
          </div>

          <div className="bg-accent rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-primary" />
              <p className="text-xs font-semibold text-card-foreground">Active Sessions</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-muted-foreground" />
                  <span className="text-xs text-card-foreground">This device</span>
                </div>
                <span className="text-[10px] text-success font-medium">Active now</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor size={12} className="text-muted-foreground" />
                  <span className="text-xs text-card-foreground">Chrome on Windows</span>
                </div>
                <span className="text-[10px] text-muted-foreground">2 hours ago</span>
              </div>
            </div>
            <button className="text-xs text-destructive font-medium mt-3">Sign out all other sessions</button>
          </div>
        </div>
      </ModalShell>

      {/* Help & FAQ Modal */}
      <ModalShell show={showHelp} title="Help & FAQ" onClose={() => setShowHelp(false)}>
        <div className="space-y-4">
          <div className="bg-background rounded-xl border border-border divide-y divide-border">
            {[
              { q: "How do I create an invoice?", a: "Go to Billing & Invoice → tap + Create Invoice → fill details → Save or Print." },
              { q: "How to add a new product?", a: "Navigate to Products → tap Add Product → enter name, price, stock → Save." },
              { q: "How do I track EMI payments?", a: "Go to EMI & Loans → select a plan → view schedule and mark payments." },
              { q: "Can I export my data?", a: "Yes! Go to Settings → Data → Export Data. Choose CSV, Excel or PDF format." },
              { q: "How to switch between accounts?", a: "Go to Profile → Switch Account to toggle between personal and business." },
            ].map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none">
                  <span className="text-sm font-medium text-card-foreground pr-4">{faq.q}</span>
                  <ChevronRight size={14} className="text-muted-foreground shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Us</p>
            <div className="bg-background rounded-xl border border-border divide-y divide-border">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Mail size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Email Support</p>
                  <p className="text-[10px] text-muted-foreground">support@e-lekha.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Phone size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Phone Support</p>
                  <p className="text-[10px] text-muted-foreground">+977-01-XXXXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <ExternalLink size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Documentation</p>
                  <p className="text-[10px] text-muted-foreground">docs.e-lekha.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalShell>

      {/* Terms & Privacy Modal */}
      <ModalShell show={showTerms} title="Terms & Privacy" onClose={() => setShowTerms(false)}>
        <div className="space-y-4">
          <div className="bg-background rounded-xl border border-border divide-y divide-border">
            <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer">
              <FileText size={16} className="text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Terms of Service</p>
                <p className="text-[10px] text-muted-foreground">Last updated: March 2026</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer">
              <Shield size={16} className="text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Privacy Policy</p>
                <p className="text-[10px] text-muted-foreground">Last updated: March 2026</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer">
              <Lock size={16} className="text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Data Processing Agreement</p>
                <p className="text-[10px] text-muted-foreground">GDPR & data handling</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground" />
            </div>
          </div>

          <div className="bg-accent rounded-xl p-4">
            <p className="text-xs font-semibold text-card-foreground mb-2">Your Data Rights</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Request a copy of your data</li>
              <li>• Delete your account and data</li>
              <li>• Opt out of data processing</li>
              <li>• Update your consent preferences</li>
            </ul>
            <button className="text-xs text-primary font-medium mt-3">Manage Data Preferences</button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            By using e-Lekha, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </ModalShell>

      {/* Tax Calculator Modal */}
      <ModalShell show={showTaxCalc} title="Tax Calculator" onClose={() => setShowTaxCalc(false)}>
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
      </ModalShell>

      {/* Notes Modal */}
      <ModalShell show={showNotes} title="Business Notes" onClose={() => setShowNotes(false)}>
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
      </ModalShell>
    </AppShell>
  );
};

export default SettingsPage;

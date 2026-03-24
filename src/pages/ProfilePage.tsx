import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuListItem } from "@/components/shared/MenuListItem";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Building2, Phone, Mail, MapPin, Edit, Wallet, ChevronDown, Check, X, User } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAccountSwitch, setShowAccountSwitch] = useState(false);
  const [activeAccount, setActiveAccount] = useState<"business" | "personal">("business");

  const [profile, setProfile] = useState({
    name: "Kapil Dhami",
    role: "Business Owner",
    initials: "KD",
    businessName: "My Business",
    phone: "9868569297",
    email: "kapil@elekha.com",
    address: "Dhangadhi, Kailali",
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const handleEditSave = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      {/* Header */}
      <header className="bg-header text-header-foreground px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="ml-auto p-2 rounded-full hover:bg-primary-foreground/10">
              <Edit size={18} />
            </button>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              <button onClick={handleEditCancel} className="p-2 rounded-full hover:bg-primary-foreground/10">
                <X size={18} />
              </button>
              <button onClick={handleEditSave} className="p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30">
                <Check size={18} />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center bg-primary-foreground/10">
            <span className="text-xl font-bold">{profile.initials}</span>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-1">
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value, initials: e.target.value.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() })}
                  className="bg-primary-foreground/10 rounded-lg px-3 py-1.5 text-lg font-bold w-full outline-none border border-primary-foreground/20"
                />
                <input
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="bg-primary-foreground/10 rounded-lg px-3 py-1 text-sm w-full outline-none border border-primary-foreground/20"
                />
              </div>
            ) : (
              <>
                <p className="text-xl font-bold">{profile.name}</p>
                <p className="text-sm opacity-80">{profile.role}</p>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-8 -mt-2">
        {/* Account Switch */}
        <div className="mx-4 mt-4 mb-3">
          <button
            onClick={() => setShowAccountSwitch(!showAccountSwitch)}
            className="w-full flex items-center justify-between bg-card rounded-xl border border-border px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${activeAccount === "business" ? "bg-primary/15" : "bg-accent"}`}>
                {activeAccount === "business" ? <Building2 size={16} className="text-primary" /> : <User size={16} className="text-primary" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-card-foreground">
                  {activeAccount === "business" ? "Business Account" : "Personal Account"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeAccount === "business" ? "My Business" : "Personal use"}
                </p>
              </div>
            </div>
            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showAccountSwitch ? "rotate-180" : ""}`} />
          </button>
          {showAccountSwitch && (
            <div className="mt-1 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              <button
                onClick={() => { setActiveAccount("business"); setShowAccountSwitch(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <Building2 size={16} className="text-primary" />
                <span className="text-sm font-medium text-card-foreground">Business Account</span>
                {activeAccount === "business" && <Check size={14} className="text-success ml-auto" />}
              </button>
              <button
                onClick={() => { setActiveAccount("personal"); setShowAccountSwitch(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <User size={16} className="text-primary" />
                <span className="text-sm font-medium text-card-foreground">Personal Account</span>
                {activeAccount === "personal" && <Check size={14} className="text-success ml-auto" />}
              </button>
            </div>
          )}
        </div>

        {/* Business Info Card */}
        <div className="mx-4 bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={16} className="text-primary" />
            <p className="text-sm font-semibold text-card-foreground">
              {isEditing ? "Edit Business Info" : profile.businessName}
            </p>
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Business Name</label>
                <input
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-card-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-card-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <input
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-card-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Address</label>
                <input
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-card-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>{profile.address}</span>
              </div>
            </div>
          )}
        </div>

        {/* Account Details */}
        <SectionHeader title="Accounts" />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
          <MenuListItem icon={<Wallet size={18} />} title="Cash in Hand" subtitle="Primary cash account" rightContent={<span className="text-sm font-bold text-success">₹25,400</span>} />
          <MenuListItem icon={<Wallet size={18} />} title="Business Bank" subtitle="Main bank account" rightContent={<span className="text-sm font-bold text-success">₹1,45,000</span>} />
          <MenuListItem icon={<Wallet size={18} />} title="eSewa" subtitle="Digital wallet" rightContent={<span className="text-sm font-bold text-success">₹3,200</span>} />
        </div>

        {/* Quick Stats */}
        <SectionHeader title="This Month" />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden">
          {[
            { label: "Total Sales", value: "₹1,25,000" },
            { label: "Total Collections", value: "₹98,000" },
            { label: "Total Purchases", value: "₹72,000" },
            { label: "Active EMI Plans", value: "3" },
            { label: "Parties", value: "24" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-card-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
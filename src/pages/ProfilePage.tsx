import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Phone, Mail, MapPin, Edit, ChevronDown, ChevronRight, Check, User,
  LogOut, Plus, Camera, Shield, Globe, Calendar, Upload, ImageIcon, Briefcase
} from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [showAccountSwitch, setShowAccountSwitch] = useState(false);
  const [activeAccount, setActiveAccount] = useState<"business" | "personal">("business");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [personalProfile, setPersonalProfile] = useState({
    fullName: "Kapil Dhami",
    phone: "+9779868569297",
    email: "kapil@elekha.com",
  });
  const [editPersonal, setEditPersonal] = useState({ ...personalProfile });

  const [businessProfile, setBusinessProfile] = useState({
    legalName: "Dhami Suppliers",
    businessPhone: "+9779868569297",
    address: "Dhangadhi, Kailali",
    pan: "123456789",
    type: "Retail & Wholesale",
    established: "2024",
  });
  const [editBusiness, setEditBusiness] = useState({ ...businessProfile });

  const initials = personalProfile.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleSavePersonal = () => {
    setPersonalProfile({ ...editPersonal });
    setIsEditingPersonal(false);
    toast.success("Personal profile updated");
  };
  const handleCancelPersonal = () => {
    setEditPersonal({ ...personalProfile });
    setIsEditingPersonal(false);
  };
  const handleSaveBusiness = () => {
    setBusinessProfile({ ...editBusiness });
    setIsEditingBusiness(false);
    toast.success("Business profile updated");
  };
  const handleCancelBusiness = () => {
    setEditBusiness({ ...businessProfile });
    setIsEditingBusiness(false);
  };

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result as string);
      reader.readAsDataURL(file);
      toast.success("Profile photo updated");
    }
  };

  const handleBusinessLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBusinessLogo(reader.result as string);
      reader.readAsDataURL(file);
      toast.success("Business logo uploaded");
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      {/* Header with profile hero */}
      <header className="bg-header text-header-foreground">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-full hover:bg-white/10 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <h1 className="text-base font-semibold">Profile</h1>
          </div>
        </div>
      </header>
      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-10">
        {/* Profile Hero - Centered avatar + name */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-[3px] border-primary/20 flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{initials}</span>
              )}
            </div>
            <input type="file" ref={profileInputRef} accept="image/*" onChange={handleProfilePhoto} className="hidden" />
            <button
              onClick={() => profileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md border-2 border-background"
            >
              <Camera size={13} />
            </button>
          </div>
          <h2 className="text-lg font-bold text-foreground">{personalProfile.fullName}</h2>
          <p className="text-sm text-muted-foreground">{personalProfile.email}</p>
          <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
            <Building2 size={12} />
            {businessProfile.legalName}
          </div>
        </div>

        {/* Account Switcher */}
        <div className="mx-4 mb-1">
          <button
            onClick={() => setShowAccountSwitch(!showAccountSwitch)}
            className="w-full flex items-center justify-between px-4 py-3 bg-card rounded-xl border border-border transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                {activeAccount === "business" ? <Briefcase size={16} className="text-primary" /> : <User size={16} className="text-primary" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  {activeAccount === "business" ? "Business Account" : "Personal Account"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {activeAccount === "business" ? businessProfile.legalName : "Personal use"}
                </p>
              </div>
            </div>
            <ChevronDown size={15} className={`text-muted-foreground transition-transform duration-200 ${showAccountSwitch ? "rotate-180" : ""}`} />
          </button>
          {showAccountSwitch && (
            <div className="mt-1 bg-card rounded-xl border border-border overflow-hidden">
              {[
                { key: "business" as const, icon: Briefcase, label: "Business Account", sub: businessProfile.legalName },
                { key: "personal" as const, icon: User, label: "Personal Account", sub: "Personal use" },
              ].map(acc => (
                <button
                  key={acc.key}
                  onClick={() => { setActiveAccount(acc.key); setShowAccountSwitch(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-border last:border-b-0 ${activeAccount === acc.key ? "bg-accent/50" : "hover:bg-muted/30"}`}
                >
                  <acc.icon size={15} className="text-primary" />
                  <div className="text-left flex-1">
                    <span className="text-sm font-medium text-foreground">{acc.label}</span>
                    <p className="text-[11px] text-muted-foreground">{acc.sub}</p>
                  </div>
                  {activeAccount === acc.key && <Check size={15} className="text-success" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Personal Information Section */}
        <SectionLabel
          title="Personal Information"
          action={!isEditingPersonal ? (
            <button onClick={() => setIsEditingPersonal(true)} className="text-xs font-semibold text-primary flex items-center gap-1">
              <Edit size={12} /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleCancelPersonal} className="text-xs font-medium text-muted-foreground">Cancel</button>
              <button onClick={handleSavePersonal} className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-lg">Save</button>
            </div>
          )}
        />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden">
          {isEditingPersonal ? (
            <div className="p-4 space-y-3">
              <FieldInput label="Full Name" value={editPersonal.fullName} onChange={v => setEditPersonal({ ...editPersonal, fullName: v })} />
              <FieldInput label="Phone" value={editPersonal.phone} onChange={v => setEditPersonal({ ...editPersonal, phone: v })} />
              <FieldInput label="Email" value={editPersonal.email} onChange={v => setEditPersonal({ ...editPersonal, email: v })} />
            </div>
          ) : (
            <div className="divide-y divide-border">
              <ListField icon={User} label="Full Name" value={personalProfile.fullName} />
              <ListField icon={Phone} label="Phone" value={personalProfile.phone} />
              <ListField icon={Mail} label="Email" value={personalProfile.email || "—"} />
            </div>
          )}
        </div>

        {/* Business Information Section */}
        <SectionLabel
          title="Business Information"
          action={!isEditingBusiness ? (
            <button onClick={() => setIsEditingBusiness(true)} className="text-xs font-semibold text-primary flex items-center gap-1">
              <Edit size={12} /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleCancelBusiness} className="text-xs font-medium text-muted-foreground">Cancel</button>
              <button onClick={handleSaveBusiness} className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-lg">Save</button>
            </div>
          )}
        />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden">
          {isEditingBusiness ? (
            <div className="p-4 space-y-3">
              <FieldInput label="Legal Business Name" value={editBusiness.legalName} onChange={v => setEditBusiness({ ...editBusiness, legalName: v })} />
              <FieldInput label="Business Phone" value={editBusiness.businessPhone} onChange={v => setEditBusiness({ ...editBusiness, businessPhone: v })} />
              <FieldInput label="Address" value={editBusiness.address} onChange={v => setEditBusiness({ ...editBusiness, address: v })} />
              <FieldInput label="PAN / Tax ID" value={editBusiness.pan} onChange={v => setEditBusiness({ ...editBusiness, pan: v })} />
              <FieldInput label="Business Type" value={editBusiness.type} onChange={v => setEditBusiness({ ...editBusiness, type: v })} />
              <FieldInput label="Established Year" value={editBusiness.established} onChange={v => setEditBusiness({ ...editBusiness, established: v })} />
            </div>
          ) : (
            <div className="divide-y divide-border">
              <ListField icon={Building2} label="Business Name" value={businessProfile.legalName} />
              <ListField icon={Phone} label="Business Phone" value={businessProfile.businessPhone || "—"} />
              <ListField icon={MapPin} label="Address" value={businessProfile.address || "—"} />
              <ListField icon={Shield} label="PAN / Tax ID" value={businessProfile.pan || "—"} />
              <ListField icon={Globe} label="Business Type" value={businessProfile.type || "—"} />
              <ListField icon={Calendar} label="Established" value={businessProfile.established || "—"} />
            </div>
          )}
        </div>

        {/* Business Logo Section */}
        <SectionLabel title="Business Branding" />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden">
          <input type="file" ref={logoInputRef} accept="image/*" onChange={handleBusinessLogo} className="hidden" />
          <button
            onClick={() => logoInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl border border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
              {businessLogo ? (
                <img src={businessLogo} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <ImageIcon size={20} className="text-muted-foreground" />
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{businessLogo ? "Change Business Logo" : "Upload Business Logo"}</p>
              <p className="text-[11px] text-muted-foreground">Used on invoices, receipts & reports</p>
            </div>
            <Upload size={16} className="text-muted-foreground shrink-0" />
          </button>
        </div>

        {/* Actions Section */}
        <SectionLabel title="More" />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
          <ActionRow icon={Plus} label="Create New Business" sublabel="Add another workspace" onClick={() => {}} />
          <ActionRow icon={LogOut} label="Logout" sublabel="Sign out from this device" onClick={() => navigate("/auth")} destructive />
        </div>

        <div className="h-6" />
      </main>
    </div>
  );
};

/* Section label */
const SectionLabel = ({ title, action }: { title: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between px-5 pt-5 pb-2">
    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
    {action}
  </div>
);

/* List-style field row */
const ListField = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <Icon size={16} className="text-muted-foreground shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  </div>
);

/* Action row */
const ActionRow = ({ icon: Icon, label, sublabel, onClick, destructive }: { icon: any; label: string; sublabel: string; onClick: () => void; destructive?: boolean }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${destructive ? "bg-destructive/10" : "bg-primary/10"}`}>
      <Icon size={16} className={destructive ? "text-destructive" : "text-primary"} />
    </div>
    <div className="text-left flex-1">
      <p className={`text-sm font-medium ${destructive ? "text-destructive" : "text-foreground"}`}>{label}</p>
      <p className="text-[11px] text-muted-foreground">{sublabel}</p>
    </div>
    <ChevronRight size={15} className="text-muted-foreground" />
  </button>
);

/* Edit field input */
const FieldInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
    />
  </div>
);

export default ProfilePage;

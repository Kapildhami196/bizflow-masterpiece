import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Phone, Mail, MapPin, Edit, ChevronDown, Check, User,
  LogOut, Plus, Camera, Shield, Globe, Calendar, Upload, ImageIcon
} from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [showAccountSwitch, setShowAccountSwitch] = useState(false);
  const [activeAccount, setActiveAccount] = useState<"business" | "personal">("business");
  const [showMoreBusiness, setShowMoreBusiness] = useState(false);
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
      {/* Profile Header */}
      <header className="bg-header text-header-foreground relative">
        <div className="px-5 pt-4 pb-8">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-full hover:bg-white/10 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-[68px] h-[68px] rounded-full border-[2.5px] border-white/25 flex items-center justify-center bg-white/10 shadow-lg overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[22px] font-bold tracking-wide">{initials}</span>
                )}
              </div>
              <input type="file" ref={profileInputRef} accept="image/*" onChange={handleProfilePhoto} className="hidden" />
              <button onClick={() => profileInputRef.current?.click()} className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center shadow-md">
                <Camera size={12} />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[20px] font-bold leading-tight truncate">{personalProfile.fullName}</h1>
              <p className="text-sm text-white/70 mt-0.5 truncate">{businessProfile.legalName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-10">
        {/* Account Switcher */}
        <div className="px-4 -mt-4 relative z-10">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <button
              onClick={() => setShowAccountSwitch(!showAccountSwitch)}
              className="w-full flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeAccount === "business" ? "bg-primary/10" : "bg-accent"}`}>
                  {activeAccount === "business" ? <Building2 size={18} className="text-primary" /> : <User size={18} className="text-primary" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-card-foreground">
                    {activeAccount === "business" ? "Business Account" : "Personal Account"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeAccount === "business" ? businessProfile.legalName : "Personal use"}
                  </p>
                </div>
              </div>
              <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${showAccountSwitch ? "rotate-180" : ""}`} />
            </button>
            {showAccountSwitch && (
              <div className="border-t border-border">
                {[
                  { key: "business" as const, icon: Building2, label: "Business Account", sub: businessProfile.legalName },
                  { key: "personal" as const, icon: User, label: "Personal Account", sub: "Personal use" },
                ].map(acc => (
                  <button
                    key={acc.key}
                    onClick={() => { setActiveAccount(acc.key); setShowAccountSwitch(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeAccount === acc.key ? "bg-primary/5" : "hover:bg-muted/30"}`}
                  >
                    <acc.icon size={16} className="text-primary" />
                    <div className="text-left flex-1">
                      <span className="text-sm font-medium text-card-foreground">{acc.label}</span>
                      <p className="text-xs text-muted-foreground">{acc.sub}</p>
                    </div>
                    {activeAccount === acc.key && <Check size={16} className="text-success" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Business Logo Upload Card */}
        <div className="px-4 mt-4">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <ImageIcon size={15} className="text-primary" />
              <span className="text-sm font-semibold text-card-foreground">Business Logo</span>
            </div>
            <div className="p-4">
              <input type="file" ref={logoInputRef} accept="image/*" onChange={handleBusinessLogo} className="hidden" />
              <div className="flex items-center gap-4">
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-20 h-20 rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all overflow-hidden"
                >
                  {businessLogo ? (
                    <img src={businessLogo} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <>
                      <Upload size={18} className="text-muted-foreground mb-1" />
                      <span className="text-[9px] text-muted-foreground">Upload</span>
                    </>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-card-foreground">
                    {businessLogo ? "Logo uploaded" : "No logo uploaded"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Used on invoices, receipts & reports
                  </p>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="mt-2 text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
                  >
                    <Upload size={10} /> {businessLogo ? "Change Logo" : "Upload Logo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Profile Card */}
        <div className="px-4 mt-4">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <User size={15} className="text-primary" />
                <span className="text-sm font-semibold text-card-foreground">Personal Profile</span>
              </div>
              {!isEditingPersonal ? (
                <button onClick={() => setIsEditingPersonal(true)} className="flex items-center gap-1 text-xs font-medium text-primary px-2.5 py-1 rounded-lg hover:bg-primary/5 transition-colors">
                  <Edit size={12} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button onClick={handleCancelPersonal} className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-lg hover:bg-muted/50">Cancel</button>
                  <button onClick={handleSavePersonal} className="text-xs font-medium text-white bg-primary px-3 py-1 rounded-lg hover:bg-primary/90">Save</button>
                </div>
              )}
            </div>
            <div className="p-4">
              {isEditingPersonal ? (
                <div className="space-y-3">
                  <FieldInput label="Full Name" value={editPersonal.fullName} onChange={v => setEditPersonal({ ...editPersonal, fullName: v })} />
                  <FieldInput label="Phone" value={editPersonal.phone} onChange={v => setEditPersonal({ ...editPersonal, phone: v })} />
                  <FieldInput label="Email" value={editPersonal.email} onChange={v => setEditPersonal({ ...editPersonal, email: v })} />
                </div>
              ) : (
                <div className="space-y-3">
                  <FieldRow icon={User} label="FULL NAME" value={personalProfile.fullName} />
                  <FieldRow icon={Phone} label="PHONE" value={personalProfile.phone} />
                  <FieldRow icon={Mail} label="EMAIL" value={personalProfile.email || "—"} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Profile Card */}
        <div className="px-4 mt-4">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Building2 size={15} className="text-primary" />
                <span className="text-sm font-semibold text-card-foreground">Active Business Profile</span>
              </div>
              {!isEditingBusiness ? (
                <button onClick={() => setIsEditingBusiness(true)} className="flex items-center gap-1 text-xs font-medium text-primary px-2.5 py-1 rounded-lg hover:bg-primary/5 transition-colors">
                  <Edit size={12} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button onClick={handleCancelBusiness} className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-lg hover:bg-muted/50">Cancel</button>
                  <button onClick={handleSaveBusiness} className="text-xs font-medium text-white bg-primary px-3 py-1 rounded-lg hover:bg-primary/90">Save</button>
                </div>
              )}
            </div>
            <div className="p-4">
              {isEditingBusiness ? (
                <div className="space-y-3">
                  <FieldInput label="Legal Business Name" value={editBusiness.legalName} onChange={v => setEditBusiness({ ...editBusiness, legalName: v })} />
                  <FieldInput label="Business Phone" value={editBusiness.businessPhone} onChange={v => setEditBusiness({ ...editBusiness, businessPhone: v })} />
                  <FieldInput label="Address" value={editBusiness.address} onChange={v => setEditBusiness({ ...editBusiness, address: v })} />
                  <FieldInput label="PAN / Tax ID" value={editBusiness.pan} onChange={v => setEditBusiness({ ...editBusiness, pan: v })} />
                  <FieldInput label="Business Type" value={editBusiness.type} onChange={v => setEditBusiness({ ...editBusiness, type: v })} />
                  <FieldInput label="Established Year" value={editBusiness.established} onChange={v => setEditBusiness({ ...editBusiness, established: v })} />
                </div>
              ) : (
                <div className="space-y-3">
                  <FieldRow icon={Building2} label="LEGAL BUSINESS NAME" value={businessProfile.legalName} />
                  <FieldRow icon={Phone} label="BUSINESS PHONE" value={businessProfile.businessPhone || "—"} />
                  <FieldRow icon={MapPin} label="REGISTERED / OPERATING ADDRESS" value={businessProfile.address || "—"} />
                  {showMoreBusiness && (
                    <>
                      <FieldRow icon={Shield} label="PAN / TAX ID" value={businessProfile.pan || "—"} />
                      <FieldRow icon={Globe} label="BUSINESS TYPE" value={businessProfile.type || "—"} />
                      <FieldRow icon={Calendar} label="ESTABLISHED" value={businessProfile.established || "—"} />
                    </>
                  )}
                  <button
                    onClick={() => setShowMoreBusiness(!showMoreBusiness)}
                    className="text-xs font-semibold text-primary pt-1 hover:underline"
                  >
                    {showMoreBusiness ? "Show less" : "Show more"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create New Business */}
        <div className="px-4 mt-4">
          <button className="w-full bg-card rounded-2xl border border-border shadow-sm flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Plus size={18} className="text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-card-foreground">Create New Business Profile</p>
              <p className="text-xs text-muted-foreground">Add another business workspace from profile</p>
            </div>
            <ChevronDown size={16} className="text-muted-foreground -rotate-90" />
          </button>
        </div>

        {/* Logout */}
        <div className="px-4 mt-4">
          <button
            onClick={() => navigate("/auth")}
            className="w-full bg-card rounded-2xl border border-destructive/20 shadow-sm flex items-center gap-3 px-4 py-3.5 hover:bg-destructive/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut size={18} className="text-destructive" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-destructive">Logout</p>
              <p className="text-xs text-muted-foreground">Sign out from this device</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

/* Reusable field display row */
const FieldRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={14} className="text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">{label}</p>
      <p className="text-sm text-card-foreground mt-0.5 break-words">{value}</p>
    </div>
  </div>
);

/* Reusable edit field input */
const FieldInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase block mb-1.5">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
    />
  </div>
);

export default ProfilePage;

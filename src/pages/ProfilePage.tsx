import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MenuListItem } from "@/components/shared/MenuListItem";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { User, LogOut, Lock, Fingerprint, ShieldQuestion, Trophy } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      {/* Header with avatar */}
      <header className="bg-header text-header-foreground px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 className="text-lg font-semibold">My Profile</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center bg-primary-foreground/10">
            <span className="text-xl font-bold">PD</span>
          </div>
          <div>
            <p className="text-xl font-bold">PARAS DHAMI</p>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
              9868569297
            </div>
          </div>
        </div>
      </header>

      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-8 -mt-2">
        {/* Reward Points Card */}
        <div className="mx-4 bg-card rounded-xl border border-border p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Available Reward Points</p>
            <p className="text-2xl font-bold text-card-foreground">2196.00 <span className="text-sm font-normal text-muted-foreground">Points</span></p>
            <button className="mt-2 border border-border text-sm px-4 py-1.5 rounded-lg text-card-foreground font-medium">
              View Points
            </button>
          </div>
          <div className="w-14 h-14 rounded-full bg-warning/20 flex items-center justify-center">
            <Trophy size={24} className="text-warning" />
          </div>
        </div>

        {/* Basic Information */}
        <SectionHeader title="Basic Information" />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
          <MenuListItem icon={<User size={18} />} title="My Information" subtitle="View your basic information." />
          <MenuListItem icon={<LogOut size={18} />} title="Logout" subtitle="Logout of this app." />
        </div>

        {/* Security Settings */}
        <SectionHeader title="Security Settings" />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
          <MenuListItem icon={<Lock size={18} />} title="Change Password" subtitle="Change Password" />
          <MenuListItem icon={<Fingerprint size={18} />} title="Setup Biometrics" subtitle="Setup Biometrics" />
          <MenuListItem icon={<ShieldQuestion size={18} />} title="Security Questions" subtitle="Security Questions" />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

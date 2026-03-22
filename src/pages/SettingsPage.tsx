import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MenuListItem } from "@/components/shared/MenuListItem";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Building2, Globe, Bell, Shield, Palette, Download,
  Upload, HelpCircle, FileText, LogOut, Users, Crown,
} from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();

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
        <MenuListItem icon={<Globe size={18} />} title="Language & Currency" subtitle="English • NPR" />
        <MenuListItem icon={<Bell size={18} />} title="Notifications" subtitle="Reminders, alerts, due notifications" />
        <MenuListItem icon={<Palette size={18} />} title="Appearance" subtitle="Theme, display settings" />
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
    </AppShell>
  );
};

export default SettingsPage;

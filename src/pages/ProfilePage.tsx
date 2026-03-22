import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MenuListItem } from "@/components/shared/MenuListItem";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { User, Building2, Phone, Mail, MapPin, Edit, Wallet } from "lucide-react";

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
          <h1 className="text-lg font-semibold">Profile</h1>
          <button className="ml-auto p-2 rounded-full hover:bg-primary-foreground/10">
            <Edit size={18} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center bg-primary-foreground/10">
            <span className="text-xl font-bold">KD</span>
          </div>
          <div>
            <p className="text-xl font-bold">Kapil Dhami</p>
            <p className="text-sm opacity-80">Business Owner</p>
          </div>
        </div>
      </header>

      <div className="h-1 bg-destructive w-full" />

      <main className="flex-1 overflow-y-auto pb-8 -mt-2">
        {/* Business Info Card */}
        <div className="mx-4 bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={16} className="text-primary" />
            <p className="text-sm font-semibold text-card-foreground">My Business</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone size={14} />
              <span>9868569297</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} />
              <span>kapil@elekha.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>Dhangadhi, Kailali</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <SectionHeader title="Accounts" />
        <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
          <MenuListItem
            icon={<Wallet size={18} />}
            title="Cash in Hand"
            subtitle="Primary cash account"
            rightContent={<span className="text-sm font-bold text-success">₹25,400</span>}
          />
          <MenuListItem
            icon={<Wallet size={18} />}
            title="Business Bank"
            subtitle="Main bank account"
            rightContent={<span className="text-sm font-bold text-success">₹1,45,000</span>}
          />
          <MenuListItem
            icon={<Wallet size={18} />}
            title="eSewa"
            subtitle="Digital wallet"
            rightContent={<span className="text-sm font-bold text-success">₹3,200</span>}
          />
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

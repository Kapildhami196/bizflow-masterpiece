import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MenuListItem } from "@/components/shared/MenuListItem";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Building2, SendHorizontal, Globe, Landmark, Wallet,
} from "lucide-react";

const transferOptions = [
  {
    icon: <Building2 size={18} />,
    title: "Same Bank",
    subtitle: "Transfer fund to other accounts within same bank",
  },
  {
    icon: <SendHorizontal size={18} />,
    title: "Other Bank",
    subtitle: "Transfer fund to other accounts in other banks",
  },
  {
    icon: <Globe size={18} />,
    title: "Connect IPS",
    subtitle: "Transfer fund to accounts in other banks using Connect IPS",
  },
  {
    icon: <Landmark size={18} />,
    title: "NEPALPAY Instant",
    subtitle: "Transfer funds to other bank accounts using mobile No.",
  },
  {
    icon: <Wallet size={18} />,
    title: "eLekha PAY",
    subtitle: "Transfer fund to other accounts using eLekha PAY",
  },
];

const SendMoneyPage = () => {
  const navigate = useNavigate();

  return (
    <AppShell headerTitle="Send Money">
      <div className="mx-4 mt-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {transferOptions.map((opt, idx) => (
          <MenuListItem
            key={idx}
            icon={opt.icon}
            title={opt.title}
            subtitle={opt.subtitle}
          />
        ))}
      </div>

      <SectionHeader title="Favourite Accounts" actionLabel="View All" />
      <div className="mx-4 bg-card rounded-xl border border-border p-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-card-foreground mb-1">No Favourite Accounts</p>
        <p className="text-xs text-muted-foreground text-center">You can save transfers by clicking on Add button below.</p>
      </div>

      <div className="px-4 pt-4 pb-4">
        <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          Add Transfer
        </button>
      </div>
    </AppShell>
  );
};

export default SendMoneyPage;

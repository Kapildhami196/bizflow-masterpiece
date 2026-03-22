import { AppShell } from "@/components/layout/AppShell";
import { QuickActionCard } from "@/components/shared/QuickActionCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Landmark, BookCheck, ClipboardList, Package,
  Flag, HelpCircle, CreditCard, FileText,
} from "lucide-react";

const MorePage = () => {
  return (
    <AppShell headerTitle="More">
      <SectionHeader title="Requests" />
      <div className="px-4 grid grid-cols-4 gap-3">
        <QuickActionCard icon={<Landmark size={22} />} label="Fixed Deposit" />
        <QuickActionCard icon={<BookCheck size={22} />} label="Cheque Books" />
      </div>

      <SectionHeader title="Customer Service" />
      <div className="px-4 grid grid-cols-4 gap-3">
        <QuickActionCard icon={<ClipboardList size={22} />} label="Activity Log" />
        <QuickActionCard icon={<Package size={22} />} label="Products" />
        <QuickActionCard icon={<Flag size={22} />} label="Report a Problem" />
        <QuickActionCard icon={<HelpCircle size={22} />} label="FAQ" />
      </div>

      <SectionHeader title="Card Services" />
      <div className="px-4 grid grid-cols-4 gap-3">
        <QuickActionCard icon={<CreditCard size={22} />} label="Card Services" />
      </div>

      <SectionHeader title="Statement Request" />
      <div className="px-4 grid grid-cols-4 gap-3 pb-4">
        <QuickActionCard icon={<FileText size={22} />} label="Statement Request" />
      </div>
    </AppShell>
  );
};

export default MorePage;

import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MenuListItem } from "@/components/shared/MenuListItem";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Package, Warehouse, BarChart3, Tag, Wallet,
  Users, Settings, ShoppingCart, FileText, User, CreditCard,
} from "lucide-react";

const MorePage = () => {
  const navigate = useNavigate();

  return (
    <AppShell headerTitle="More">
      <SectionHeader title="Business Tools" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem icon={<Package size={18} />} title="Products" subtitle="Product & service catalog" onClick={() => navigate("/products")} />
        <MenuListItem icon={<Warehouse size={18} />} title="Inventory" subtitle="Stock tracking & movements" onClick={() => navigate("/inventory")} />
        <MenuListItem icon={<ShoppingCart size={18} />} title="POS" subtitle="Point of sale checkout" onClick={() => navigate("/pos")} />
        <MenuListItem icon={<FileText size={18} />} title="Billing & Invoice" subtitle="Invoices, receipts, credit notes" onClick={() => navigate("/billing")} />
        <MenuListItem icon={<CreditCard size={18} />} title="EMI & Loans" subtitle="EMI plans & loan tracking" onClick={() => navigate("/emi-loans")} />
      </div>

      <SectionHeader title="Management" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        <MenuListItem icon={<Tag size={18} />} title="Categories" subtitle="Income, expense & business categories" onClick={() => navigate("/categories")} />
        <MenuListItem icon={<Wallet size={18} />} title="Accounts" subtitle="Cash, bank, wallet accounts" onClick={() => navigate("/accounts")} />
        <MenuListItem icon={<Users size={18} />} title="Contacts" subtitle="Customers, suppliers, parties" onClick={() => navigate("/contacts")} />
        <MenuListItem icon={<BarChart3 size={18} />} title="Reports" subtitle="Business & financial reports" onClick={() => navigate("/reports")} />
      </div>

      <SectionHeader title="Account" />
      <div className="mx-4 bg-card rounded-xl border border-border overflow-hidden divide-y divide-border mb-4">
        <MenuListItem icon={<User size={18} />} title="Profile" subtitle="Your profile & business info" onClick={() => navigate("/profile")} />
        <MenuListItem icon={<Settings size={18} />} title="Settings" subtitle="Preferences, security, data" onClick={() => navigate("/settings")} />
      </div>
    </AppShell>
  );
};

export default MorePage;
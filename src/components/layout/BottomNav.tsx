import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, CreditCard, ArrowLeftRight, MoreHorizontal } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/ledger", icon: BookOpen, label: "Ledger" },
  { path: "/transactions", icon: ArrowLeftRight, label: "Txns" },
  { path: "/emi-loans", icon: CreditCard, label: "EMI" },
  { path: "/more", icon: MoreHorizontal, label: "More" },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-nav border-t border-border safe-bottom z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? "text-nav-active" : "text-nav-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

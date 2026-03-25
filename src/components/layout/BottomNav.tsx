import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, CreditCard, ShoppingCart, MoreHorizontal } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/ledger", icon: BookOpen, label: "Ledger" },
  { path: "/pos", icon: ShoppingCart, label: "POS", isCenter: true },
  { path: "/emi-loans", icon: CreditCard, label: "EMI" },
  { path: "/more", icon: MoreHorizontal, label: "More" },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-nav border-t border-border safe-bottom z-40">
      <div className="flex items-center justify-around py-2 relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center -mt-7"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-background transition-colors ${
                  isActive ? "bg-primary" : "bg-primary"
                }`}>
                  <Icon size={24} className="text-primary-foreground" strokeWidth={2} />
                </div>
                <span className={`text-[10px] mt-0.5 ${isActive ? "font-semibold text-nav-active" : "font-medium text-nav-foreground"}`}>
                  {item.label}
                </span>
              </button>
            );
          }

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
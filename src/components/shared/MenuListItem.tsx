import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface MenuListItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  rightContent?: ReactNode;
  iconBgClass?: string;
}

export const MenuListItem = ({ icon, title, subtitle, onClick, rightContent, iconBgClass }: MenuListItemProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-colors"
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBgClass || "bg-accent text-primary"}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-card-foreground">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
    </div>
    {rightContent || <ChevronRight size={18} className="text-muted-foreground shrink-0" />}
  </button>
);

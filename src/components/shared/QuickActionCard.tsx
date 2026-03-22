import { ReactNode } from "react";

interface QuickActionCardProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export const QuickActionCard = ({ icon, label, onClick }: QuickActionCardProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow min-w-[80px]"
  >
    <div className="text-primary">{icon}</div>
    <span className="text-xs font-medium text-card-foreground text-center leading-tight">{label}</span>
  </button>
);

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => (
  <div className="flex items-center justify-between px-4 pt-5 pb-2">
    <h2 className="text-base font-bold text-foreground">{title}</h2>
    {actionLabel && (
      <button onClick={onAction} className="text-sm font-medium text-primary flex items-center gap-1">
        {actionLabel}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    )}
  </div>
);

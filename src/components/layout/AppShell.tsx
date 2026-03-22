import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
  headerTitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  headerVariant?: "primary" | "transparent";
}

export const AppShell = ({
  children,
  headerTitle,
  showBack,
  onBack,
  rightAction,
  headerVariant = "primary",
}: AppShellProps) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background relative">
      {headerTitle && (
        <header className="bg-header text-header-foreground px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
          {showBack && (
            <button onClick={onBack} className="p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}
          <h1 className="text-lg font-semibold">{headerTitle}</h1>
          {rightAction && <div className="ml-auto">{rightAction}</div>}
        </header>
      )}
      <div className="h-1 bg-destructive w-full" />
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

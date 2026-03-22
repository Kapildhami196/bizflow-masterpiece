interface TransactionItemProps {
  icon: React.ReactNode;
  name: string;
  date: string;
  description: string;
  amount: string;
  isDebit?: boolean;
  status?: "success" | "pending" | "failed";
}

export const TransactionItem = ({ icon, name, date, description, amount, isDebit = true, status = "success" }: TransactionItemProps) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-card">
    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-card-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">{date}</p>
      <p className="text-xs text-muted-foreground truncate">{description}</p>
    </div>
    <div className="text-right shrink-0">
      <p className={`text-sm font-semibold ${isDebit ? "text-card-foreground" : "text-success"}`}>
        {isDebit ? "- " : "+ "}{amount}
      </p>
      {status === "success" && (
        <span className="text-[10px] font-semibold bg-success/15 text-success px-2 py-0.5 rounded">
          SUCCESS
        </span>
      )}
    </div>
  </div>
);

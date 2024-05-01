import { cn } from "@ui/lib/utils";

const StatusChip = ({ text, variant = "success", className }: { text: string; variant?: "destructive" | "warning" | "success"; className?: string }) => {
  const varClass =
    variant === "destructive"
      ? "bg-destructive-500/30 text-destructive-600 border-destructive-500 border"
      : variant === "warning"
        ? "bg-yellow-500/30 text-yellow-600 border-yellow-500 border"
        : "bg-primary/30 text-primary border-primary border";
  return <span className={cn("rounded-full flex items-center justify-center text-[10px] px-2 py-[3px] lowercase", varClass, className)}>{text}</span>;
};

export default StatusChip;

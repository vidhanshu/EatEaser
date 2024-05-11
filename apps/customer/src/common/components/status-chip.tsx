import { cn } from "@ui/lib/utils";

const StatusChip = ({ text, variant = "success", className }: { text: string; variant?: "destructive" | "warning" | "success" | "info"; className?: string }) => {
  const varClass =
    variant === "destructive"
      ? "bg-destructive/30 text-destructive border-destructive border"
      : variant === "warning"
        ? "bg-yellow-500/30 text-yellow-600 border-yellow-500 border"
        : variant === "info"
          ? "bg-blue-500/30 text-blue-500 border-blue-500 border"
          : "bg-primary/30 text-primary border-primary border";
  return <span className={cn("font-normal rounded-full flex items-center justify-center text-[10px] w-fit h-5 px-2 lowercase", varClass, className)}>{text}</span>;
};

export default StatusChip;

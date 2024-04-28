import { PropsWithChildren } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "..";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@ui/lib/utils";

interface GenericAlertDialogProps extends PropsWithChildren {
  title?: string;
  description?: string;
  okBtnTitle?: string;
  onOk?: () => void;
  variant?: Variants;
  className?: string;
}

type Variants = "success" | "error" | "warning" | "info";
const getStylesByVariant = (variant: Variants) => {
  switch (variant) {
    case "success":
      return {
        icon: <CheckCircle className="text-green-500" size={24} />,
        btnClassName:
          "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white",
      };
    case "error":
      return {
        icon: <XCircle className="text-rose-500" size={24} />,
        btnClassName:
          "bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white",
      };
    case "info":
      return {
        icon: <Info className="text-blue-500" size={24} />,
        btnClassName:
          "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white",
      };
    case "warning":
      return {
        icon: <AlertTriangle className="text-yellow-500" size={24} />,
        btnClassName:
          "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white",
      };
    default:
      return {};
  }
};

export const GenericAlertDialog = ({
  children,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Are you sure you want to continue?",
  okBtnTitle = "Yes, delete",
  variant = "error",
  onOk = () => {},
  className,
}: GenericAlertDialogProps) => {
  const styles = getStylesByVariant(variant);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-x-2 items-center">
            {styles.icon} {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onOk} className={cn(styles.btnClassName)}>
            {okBtnTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GenericAlertDialog;

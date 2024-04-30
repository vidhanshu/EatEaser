import { PropsWithChildren } from "react";
import type { DialogContentProps } from "@radix-ui/react-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "..";
import { cn } from "@ui/lib/utils";

interface GenericDialogProps extends PropsWithChildren {
  content: React.ReactNode;
  dialogContentProps?: DialogContentProps;
  dissmissable?: boolean;
  dialogTitle?: string;
  queryControlled?: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
}
export const GenericDialog = ({
  children,
  content,
  dialogTitle,
  dissmissable = true,
  queryControlled,
  dialogContentProps: { className, ...restDCP } = {},
}: GenericDialogProps) => {
  const dialogProps = queryControlled
    ? {
        open: queryControlled.open,
        onOpenChange: queryControlled.setOpen,
      }
    : {};
  return (
    <>
      <Dialog {...dialogProps}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className={cn(
            "sm:max-w-[500px] max-h-[calc(100vh-32px)] overflow-y-scroll no-scrollbar",
            className
          )}
          onInteractOutside={
            !dissmissable ? (e) => e.preventDefault() : undefined
          }
          {...restDCP}
        >
          {dialogTitle && (
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
          )}
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
};

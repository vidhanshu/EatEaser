import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LogOut, LucideIcon } from "lucide-react";

import { ActionTooltip, Button, ButtonProps } from "@ui/components";
import Logo from "./logo";
import { cn } from "@ui/lib/utils";
import { SIDEBAR } from "../utils/constants";
import SignOutBtn from "./sign-out-btn";
import GenericAlertDialog from "@ui/components/custom/generic-alert-dialog";
import { Ref, forwardRef } from "react";

const Sidebar = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  return (
    <motion.div
      initial={{ width: iconOnly ? 85 : 250 }}
      animate={{ width: iconOnly ? 85 : 250 }}
      className={cn(
        "z-[51] h-screen fixed top-0 bottom-0 left-0 bg-black text-white flex flex-col dark:border-r dark:border-gray-700/60"
      )}
    >
      {/* logo */}
      <section className="pt-4 h-[100px]">
        <Logo iconOnly={iconOnly} />
      </section>
      {/* sidebar options */}
      <ul className="flex flex-col gap-4 px-4">
        {SIDEBAR.map((item) => (
          <SidebarMenuItem iconOnly={iconOnly} key={item.link} {...item} />
        ))}
      </ul>
      <div className="mt-auto px-4 mb-8">
        <SignOutBtn>
          {(mutate, isPending) => (
            <GenericAlertDialog
              onOk={mutate}
              okBtnTitle="Sign out"
              title="Are you sure you want to sign out?"
              description="You will be redirected to the login page."
            >
              <SidebarMenuItem
                icon={LogOut}
                label="Sign out"
                iconOnly={iconOnly}
                shdShowActive={false}
                btnProps={{
                  variant: "outline",
                  className:
                    "border-rose-500 hover:bg-rose-500/10 hover:text-white bg-black",
                  loading: isPending,
                }}
              />
            </GenericAlertDialog>
          )}
        </SignOutBtn>
      </div>
    </motion.div>
  );
};

export default Sidebar;

const SidebarMenuItem = forwardRef(
  (
    {
      label,
      icon,
      link = "/",
      iconOnly,
      onClick,
      btnProps: { className, ...restBtnProps } = {},
      shdShowActive = true,
    }: {
      link?: string;
      icon: LucideIcon;
      label: string;
      iconOnly?: boolean;
      onClick?: () => void;
      btnProps?: ButtonProps;
      shdShowActive?: boolean;
    },
    ref: Ref<HTMLSpanElement>
  ) => {
    const Icon = icon;
    const path = useLocation().pathname;
    const active = path.includes(link);
    const Comp = onClick ? "div" : Link;

    return (
      <ActionTooltip
        sideOffset={16}
        side="right"
        align="center"
        childrenOnly={!iconOnly}
        content={label}
      >
        <Comp onClick={onClick} className="w-full" to={link}>
          <Button
            className={cn(
              "justify-start w-full bg-black dark:bg-black dark:text-white",
              shdShowActive
                ? active
                  ? "bg-gray-700 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-800"
                  : "hover:bg-gray-600 dark:hover:bg-gray-600"
                : "",
              className
            )}
            startContent={<Icon className="mr-4 dark:text-white" size={20} />}
            {...restBtnProps}
          >
            <AnimatePresence>
              {!iconOnly ? (
                <motion.span
                  ref={ref}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {label}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </Button>
        </Comp>
      </ActionTooltip>
    );
  }
);

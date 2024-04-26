import { useTheme } from "@ui/components";
import { PropsWithChildren } from "react";

const AuthLayout = ({
  children,
  hideLogo = false,
}: PropsWithChildren & { hideLogo?: boolean }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen py-4 flex items-center justify-center bg-[url('/auth-bg.png')] dark:bg-[url('/auth-bg-dark.png')] bg-fixed bg-repeat-x">
      <div className="flex-grow">
        {!hideLogo && (
          <img
            className="translate-y-2 select-none mx-auto"
            width={80}
            draggable={false}
            src={theme === "dark" ? "/logo-dark.svg" : "/logo.svg"}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

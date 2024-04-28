import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, hideLogo = false }: PropsWithChildren & { hideLogo?: boolean }) => {
  return (
    <div className="min-h-screen py-4 flex items-center justify-center bg-[url('/auth-bg.png')] dark:bg-[url('/auth-bg-dark.png')] bg-fixed bg-repeat-x">
      <div className="flex-grow">
        {!hideLogo && (
          <Link to="/">
            <img className="translate-y-2 select-none mx-auto" width={80} draggable={false} src="/logo.svg" />
          </Link>
        )}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

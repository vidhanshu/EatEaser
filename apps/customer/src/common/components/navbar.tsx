import { Bell, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

import { getInitials } from "@ui/helpers";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@repo/ui";
import useAuthStore from "../stores/auth-store";

const Navbar = () => {
  const user = useAuthStore((store) => store.user);

  return (
    <header className="shadow-sm sticky top-0 z-10 bg-white dark:bg-background dark:border-b dark:border-input">
      <nav className="flex justify-between items-center px-4 py-2 gap-x-2">
        <Link to="/">
          <img className="w-10" src="/logo.svg" />
        </Link>
        {user ? (
          <div className="flex gap-x-4">
            <Button className="relative" size="icon" variant="secondary">
              <Bell className="dark:text-white" size={20} />
              <div className="w-2 h-2 rounded-full bg-primary absolute top-0 right-0" />
            </Button>
            <Link to="/profile">
              <Button size="icon" variant="secondary">
                <Avatar>
                  <AvatarImage src={user?.image} alt="name" />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </div>
        ) : (
          <Link to="/sign-in">
            <Button size="icon" variant="secondary">
              <LogIn size={20} />
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

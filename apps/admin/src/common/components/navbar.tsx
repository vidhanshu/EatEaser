import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  useTheme,
} from "@ui/components";
import { Bell, Menu, Moon, Sun, X } from "lucide-react";

import useAuthStore from "../stores/auth-store";
import useSidebarStore from "../stores/sidebar-store";
import { cn } from "@ui/lib/utils";

const Navbar = () => {
  const user = useAuthStore((set) => set.user);
  const { open, toggle } = useSidebarStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "z-50 fixed top-0 right-0 px-4 md:px-8 py-2 shadow-sm bg-white dark:bg-black dark:shadow-none dark:border-b dark:border-gray-700/60",
        open ? "left-[250px] " : "left-[85px]"
      )}
    >
      <nav className="flex justify-between items-center">
        <div>
          <Button onClick={toggle} size="icon" variant="secondary">
            {open ? <X size={16} /> : <Menu size={16} />}
          </Button>
        </div>
        <ul className="flex gap-x-4 items-center">
          <li>
            <Button onClick={toggleTheme} variant="secondary" size="icon">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </li>
          <li>
            <Button variant="secondary" size="icon">
              <Bell size={16} />
            </Button>
          </li>
          <li>
            <Button variant="secondary" size="icon">
              <Avatar>
                <AvatarImage src={user?.image} alt="@shadcn" />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

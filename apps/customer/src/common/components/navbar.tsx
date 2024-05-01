import { Bell, Coins, LogIn, LogOut, Settings, ShoppingCart, User2, UtensilsCrossed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { getInitials } from "@ui/helpers";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components";
import useAuthStore from "../stores/auth-store";
import { CartPage, LoginPage, MenuPage, OrdersPage, ProfilePage, RestaurantsPage, SettingsPage } from "../utils/pages";
import SignOutBtn from "./sign-out-btn";
import useCartStore from "@src/cart/stores/cart-store";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const user = useAuthStore((store) => store.user);
  const isAuth = useAuthStore((store) => store.isAuthenticated());

  return (
    <header className="shadow-sm sticky top-0 z-10 bg-white dark:bg-background dark:border-b dark:border-input">
      <nav className="flex justify-between items-center px-4 py-2 gap-x-2">
        <Link to={MenuPage.href}>
          <img className="w-10" src="/logo.svg" />
        </Link>
        <SignOutBtn>
          {(signOut) => (
            <AlertDialog>
              <div className="flex gap-x-4">
                {isAuth && (
                  <Button className="relative" size="icon" variant="secondary">
                    <Bell className="dark:text-white" size={20} />
                    <div className="w-2 h-2 rounded-full bg-primary absolute top-0 right-0" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary">
                      <Avatar>
                        <AvatarImage src={user?.image} alt="name" />
                        <AvatarFallback>{getInitials(user?.name ? user.name : "U K")}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    {isAuth && <DropdownMenuLabel>My Account</DropdownMenuLabel>}
                    {isAuth && <DropdownMenuSeparator />}
                    <DropdownMenuGroup>
                      {isAuth && (
                        <>
                          <DropdownMenuItem onClick={() => navigate(ProfilePage.href)}>
                            <User2 className="mr-2 size-4" /> Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="justify-between" onClick={() => navigate(CartPage.href)}>
                            <div className="flex items-center">
                              <ShoppingCart className="mr-2 size-4" />
                              Cart
                            </div>
                            {<div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary  text-xs text-white">{cart.length}</div>}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(OrdersPage.href)}>
                            <Coins className="mr-2 size-4" />
                            Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(SettingsPage.href)}>
                            <Settings className="mr-2 size-4" />
                            Settings
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuItem onClick={() => navigate(RestaurantsPage.href)}>
                        <UtensilsCrossed className="mr-2 size-4" />
                        Restaurants
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {isAuth ? (
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive">
                            <LogOut className="mr-2 size-4" />
                            Signout
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      ) : (
                        <DropdownMenuItem onClick={() => navigate(LoginPage.href)} className="text-primary">
                          <LogIn className="mr-2 size-4" />
                          Sign in
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <AlertDialogContent className="max-w-[95vw] w-fit min-w-[350px] rounded-md p-4 dark:border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex gap-x-2 items-center">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-input">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive active:bg-destructive" onClick={signOut}>
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </SignOutBtn>
      </nav>
    </header>
  );
};

export default Navbar;

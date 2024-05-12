import { Bell, Coins, LogIn, LogOut, Settings, ShoppingCart, User2, UtensilsCrossed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useCartStore from "@src/cart/stores/cart-store";
import notify from "@src/common/assets/sounds/notify.wav";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from "@ui/components";
import { getInitials } from "@ui/helpers";
import { useAudio } from "@ui/hooks/use-audio";
import { SOCKET_EVENTS } from "@ui/lib/socket-events";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useSocketContext } from "../contexts/socket";
import useAuthStore from "../stores/auth-store";
import useNotificationStore from "../stores/notification-store";
import { NSRestaurant } from "../types/restaurant.type";
import { CartPage, LoginPage, MenuPage, OrdersPage, ProfilePage, RestaurantsPage, SettingsPage } from "../utils/pages";
import SignOutBtn from "./sign-out-btn";

///-------------------------------------------------------------------------------------------------
const getNotificationLink = (type: "ORDER", id: string) => {
  if (type === "ORDER") return `/orders/${id}`;
  return "/";
};
///-------------------------------------------------------------------------------------------------

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
                {isAuth && <Notification />}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary">
                      <Avatar className="border">
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

const Notification = () => {
  const { socket } = useSocketContext();
  const { elm, onPlayMusic } = useAudio({ src: notify });
  const { addNotification, notifications, clearNotifications } = useNotificationStore();

  useEffect(() => {
    if (!socket) return;
    const updateNotification = (payload: NSRestaurant.INotification) => {
      addNotification(payload);
      onPlayMusic();
    };
    socket.on(SOCKET_EVENTS.NOTIFICATION, updateNotification);
    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION, updateNotification);
    };
  }, [socket]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative" size="icon" variant="secondary">
          <Bell className="dark:text-white" size={20} />
          {notifications.length > 0 && (
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary absolute -top-1 -right-1 text-xs">{notifications.length}</div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 bg-input">
        <>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end text-muted-foreground">
                <Typography>Notifications</Typography>
                <span className="ml-auto text-sm underline cursor-pointer" onClick={clearNotifications}>
                  clear
                </span>
              </div>
              <div className="max-h-[300px] space-y-2 overflow-y-auto no-scrollbar">
                {notifications.map(({ type, message, notId, id, timestamp }) => (
                  <div className="bg-background hover:bg-background/70 w-full rounded-sm p-2 cursor-pointer" key={notId}>
                    <Link to={getNotificationLink(type, id)} className="w-full h-full">
                      <div className="flex justify-between items-center mb-2">
                        🎁
                        <Typography variant="muted" className="text-[12px]">
                          {dayjs(timestamp).format("DD MMM, hh:mm A")}
                        </Typography>
                      </div>
                      <Typography className="text-sm font-normal">{message}</Typography>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      </PopoverContent>
      {elm}
    </Popover>
  );
};

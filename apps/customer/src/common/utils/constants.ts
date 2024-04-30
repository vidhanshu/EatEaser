import { BsCartFill, BsCart } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";
import { MenuPage, SearchPage, CartPage, SettingsPage } from "@src/common/utils/pages";

// export const BASE_URL = "https://eateaser.onrender.com/api";
export const BASE_URL = "http://localhost:4000/api";

export const BOTTOM_TABS = [
  {
    label: "Home",
    icon(active: boolean = false) {
      return active ? GoHomeFill : GoHome;
    },
    href: MenuPage.href,
  },
  {
    label: "Search",
    icon(active: boolean = false) {
      return active ? RiSearchFill : RiSearchLine;
    },
    href: SearchPage().href,
  },
  {
    label: "Cart",
    icon(active: boolean = false) {
      return active ? BsCartFill : BsCart;
    },
    href: CartPage.href,
  },
  {
    label: "Settings",
    icon(active: boolean = false) {
      return active ? IoSettings : IoSettingsOutline;
    },
    href: SettingsPage.href,
  },
];

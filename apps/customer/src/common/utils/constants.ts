import { CartPage, MenuPage, SearchPage, SettingsPage } from "@src/common/utils/pages";
import { BsCart, BsCartFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";

export const BASE_URL = import.meta.env.VITE_API_URL;

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

export const K_RESTAURANT_ID = "restaurantId";
export const K_TABLE_ID = "tableId";

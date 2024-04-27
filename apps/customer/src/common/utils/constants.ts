import { BsCartFill, BsCart } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";

export const BASE_URL = import.meta.env.VITE_API_URL;
console.log(import.meta.env.VITE_API_URL);

export const BOTTOM_TABS = [
  {
    label: "Home",
    icon(active: boolean = false) {
      return active ? GoHomeFill : GoHome;
    },
    href: "/",
  },
  {
    label: "Search",
    icon(active: boolean = false) {
      return active ? RiSearchFill : RiSearchLine;
    },
    href: "/search",
  },
  {
    label: "Cart",
    icon(active: boolean = false) {
      return active ? BsCartFill : BsCart;
    },
    href: "/cart",
  },
  {
    label: "Settings",
    icon(active: boolean = false) {
      return active ? IoSettings : IoSettingsOutline;
    },
    href: "/settings",
  },
];

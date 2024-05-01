import {
  Gauge,
  HandPlatter,
  Settings,
  Soup,
  UserCog,
  Utensils,
} from "lucide-react";

export const BASE_URL = import.meta.env.VITE_API_URL;

// Sidebar
export const SIDEBAR = [
  {
    link: "/dashboard",
    icon: Gauge,
    label: "Dashboard",
  },
  {
    link: "/restaurant",
    icon: Utensils,
    label: "Restaurant",
  },
  {
    link: "/menu",
    icon: Soup,
    label: "Menu",
  },
  {
    link: "/orders",
    icon: HandPlatter,
    label: "Orders",
  },
  {
    link: "/staffs",
    icon: UserCog,
    label: "Staffs",
  },
  {
    link: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

// Days possible
export const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

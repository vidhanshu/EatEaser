import {
  Gauge,
  HandPlatter,
  Settings,
  Soup,
  UserCog,
  Utensils,
} from "lucide-react";

// export const BASE_URL = "http://localhost:4000/api";
export const BASE_URL = "https://eateaser.onrender.com/api";

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

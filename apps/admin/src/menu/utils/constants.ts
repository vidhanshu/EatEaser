import { APP_ROUTES } from "@src/common/utils/app-routes";

export const MENU_EDIT_PAGE_TABS: {
  label: string;
  link: string;
}[] = [];

export const MENU_PAGE_TABS: {
  label: string;
  link: string;
}[] = [
  {
    label: "Menu",
    link: APP_ROUTES.menu,
  },
  {
    label: "Categories",
    link: APP_ROUTES.menuCategories,
  },
  {
    label: "Add Ons",
    link: APP_ROUTES.menuAddOns,
  },
];

export const PRICES = [
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
  "80",
  "90",
  "100",
  "150",
  "200",
  "250",
  "300",
  "350",
  "400",
  "450",
  "500",
];

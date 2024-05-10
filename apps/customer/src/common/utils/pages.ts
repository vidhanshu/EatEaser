interface IPageMeta {
  title: string;
  description?: string;
  href: string;
}
class PageMeta implements IPageMeta {
  title: string = "";
  description?: string | undefined;
  href: string = "/";

  constructor(title: string, href: string, description?: string) {
    this.title = title;
    this.description = description;
    this.href = href;
  }
}

// Main pages
export const MenuPage = new PageMeta("Menu", "/", "Browse delicious food items from our menu");
export const MenuDetailsPage = (id: string) => new PageMeta("Dish", `/menu/${id}`, "View details of this dish");
export const SearchPage = (q?: string) => new PageMeta("Search", q ? `/search?q=${q}` : "/search", "Search for your favorite dishes");
export const ProfilePage = new PageMeta("Profile", "/profile", "View and edit your profile");
export const CartPage = new PageMeta("Cart", "/cart", "View your cart and place an order");
export const SettingsPage = new PageMeta("Settings", "/settings", "Change your app settings");
export const OrdersPage = new PageMeta("Orders", "/orders", "Orders you have placed");
export const OrdersDetailsPage = (id: string) => new PageMeta("Orders Details", `/orders/${id}`, "Order details page");
export const RestaurantsPage = new PageMeta("Restaurants", "/restaurants", "Browse restaurants near you");
export const RestaurantDetailsPage = (id: string) => new PageMeta("Restaurant", `/restaurants/${id}`, "View details of this restaurant");
export const OffersPage = new PageMeta("Offers", "/offers", "Browse available offers");
export const CheckoutPage = new PageMeta("Checkout", "/checkout", "Checkout your order");

// Auth pages
export const LoginPage = new PageMeta("Login", "/sign-in", "Login to your account");
export const RegisterPage = new PageMeta("Register", "/sign-up", "Create a new account");

// Error handling pages
export const NotFoundPage = new PageMeta("404", "/404", "Page not found");
export const ErrorPage = new PageMeta("Error", "/error", "An error occurred");

export const PAGES = {
  MenuPage,
  MenuDetailsPage,
  SearchPage,
  ProfilePage,
  CartPage,
  SettingsPage,
  RestaurantsPage,
  RestaurantDetailsPage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  ErrorPage,
  OffersPage,
  OrdersPage,
  OrdersDetailsPage,
  CheckoutPage,
};

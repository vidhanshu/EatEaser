import { Schema } from "mongoose";

export namespace NSRestaurant {
  export interface IResturant {
    name: string;
    description?: string;
    email: string;
    address: string;
    phone: string;
    image?: string;
    openingHours: {
      day: string;
      opening: string;
      closing: string;
    }[];
    googleMapLink?: string;
    website?: string;
    acceptsReservations?: boolean;
    menus: IMenu[];
    ratingDetails: {
      rating: number;
      counts: { stars: 1 | 2 | 3 | 4 | 5; count: number }[];
    };
  }
  export interface ICreateRestaurantPayload extends IResturant {}
  export interface IUpdateRestaurantPayload extends IResturant {}
  export interface IListRestaurantPayload {
    resultPerPage?: number;
    page?: number;
  }

  // Categories
  export interface ICategory {
    name: string;
    image?: string;
    description?: string;
    restaurant: string | Schema.Types.ObjectId;
  }

  // Menu
  export interface IMenu {
    name: string;
    description?: string;
    restaurant: Schema.Types.ObjectId;
    items: IMenuItem[];
  }

  // MenuItem
  export interface IMenuItem {
    name: string;
    price: number;
    image?: string;
    description?: string;
    moreInfo: { label: string; value: string }[];
    isVegan: boolean;
    isAvailable: boolean;
    isVegetarian: boolean;
    addOns: IAddon[];
    menu: string;
    category: string | Schema.Types.ObjectId;
    restaurant: string | Schema.Types.ObjectId;
    // TODO: more fields....
  }

  // Restaurant Table
  export interface ITable {
    name: string;
    description?: string;
    restaurant: string | Schema.Types.ObjectId;
    capacity: number;
    qrCode: string;
    status: TABLE_STATUS;
  }
  export type TABLE_STATUS = "AVAILABLE" | "RESERVED" | "OCCUPIED";

  // MenuItem addons
  export interface IAddon {
    image?: string;
    name: string;
    price: number;
    description?: string;
    isAvailable?: boolean;
    restaurant: string | Schema.Types.ObjectId;
  }

  // Order
  export interface IOrder {
    _id: string;
    restaurant: string | Schema.Types.ObjectId;
    table: string | Schema.Types.ObjectId;
    items: IOrderItem[];
    total: number;
    status: ORDER_STATUS;
    payment: IPayment;
    customer: string | Schema.Types.ObjectId | { _id: string };
  }

  export interface IOrderItem {
    item: string | Schema.Types.ObjectId;
    quantity: number;
    addons: string[] | Schema.Types.ObjectId[];
  }

  export type ORDER_STATUS =
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";

  export interface IPayment {
    method: PAYMENT_METHOD;
    status: PAYMENT_STATUS;
    transactionId: string;
  }

  export type PAYMENT_METHOD = "CASH" | "CARD" | "NETBANKING" | "UPI";
  export type PAYMENT_STATUS = "PENDING" | "COMPLETED" | "FAILED";
}

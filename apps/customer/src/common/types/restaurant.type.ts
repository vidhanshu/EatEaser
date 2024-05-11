export namespace NSRestaurant {
  export interface IResturant {
    _id: string;
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
    tables?: ITable[];
    admin: { _id: string; name: string };
  }

  // Table
  export interface ITable {
    _id: string;
    name: string;
    description?: string;
    restaurant: {
      _id: string;
      name: string;
    };
    capacity: number;
    qrCode: string;
    status: TABLE_STATUS;
  }
  export type TABLE_STATUS = "AVAILABLE" | "RESERVED" | "OCCUPIED";

  // MenuItem
  export interface IMenuItem {
    _id: string;
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
    category: ICategory;
    restaurant: string;
    quantity?: number;
    // TODO: more fields....
  }

  // MenuItem addons
  export interface IAddon {
    _id: string;
    image?: string;
    name: string;
    price: number;
    description?: string;
    restaurant: string;
  }

  // Categories
  export interface ICategory {
    _id: string;
    name: string;
    image?: string;
    description?: string;
    restaurant: string;
  }

  export interface IOrder {
    _id: string;
    restaurant: string;
    table: string;
    items: IOrderItem[];
    total: number;
    status: ORDER_STATUS;
    payment: IPayment;
    customer: { _id: string };
  }

  export interface IOrderItem {
    item: string;
    quantity: number;
    addons: string[];
  }

  export type ORDER_STATUS = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

  export interface IPayment {
    method: PAYMENT_METHOD;
    status: PAYMENT_STATUS;
    transactionId: string;
  }

  export type PAYMENT_METHOD = "CASH" | "CARD" | "NETBANKING" | "UPI";
  export type PAYMENT_STATUS = "PENDING" | "COMPLETED" | "FAILED";

  export interface INotification {
    id: string;
    notId: string;
    message: string;
    type: "ORDER";
    timestamp: Date;
  }

  // Response types
  export interface IROrder {
    _id: string;
    restaurant: string;
    table: {
      _id: string;
      name: string;
    };
    admin: {
      _id: string;
      name: string;
    };
    items: {
      item: IMenuItem;
      quantity: number;
      addons: IAddon[];
    }[];
    total: number;
    status: ORDER_STATUS;
    payment: IPayment;
    customer: { _id: string };
    createdAt: string;
    updatedAt: string;
  }
}

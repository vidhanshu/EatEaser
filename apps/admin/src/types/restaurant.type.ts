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
    table: { _id: string; name: string };
    items: IOrderItem[];
    total: number;
    status: ORDER_STATUS;
    payment: IPayment;
    customer: string;
  }

  export interface IOrderItem {
    item: IMenuItem;
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

  // update  payload types
  export interface IUpadetOrderPayload {
    id: string;
    payload: {
      item?: NSRestaurant.IMenuItem;
      paymentMethod?: NSRestaurant.PAYMENT_METHOD;
      paymentStatus?: NSRestaurant.PAYMENT_STATUS;
      transactionId?: string;
      status?: NSRestaurant.ORDER_STATUS;
    };
  }
}

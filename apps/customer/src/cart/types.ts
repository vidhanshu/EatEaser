import { NSRestaurant } from "@src/common/types/restaurant.type";

export namespace NSCart {
  export interface ICreateOrderPayload {
    items: {
      item: string;
      quantity: number;
      addons: string[];
    }[];
    paymentMethod: NSRestaurant.PAYMENT_METHOD;
  }
}

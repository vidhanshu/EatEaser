import { NSRestaurant } from "./restaurant.type";

namespace NSSocket {
  export interface IOrderUpdatePayload {
    to: string;
    payload: NSRestaurant.IOrder;
  }
}

export default NSSocket;

import { NSRestaurant } from "./restaurant";

namespace NSSocket {
  export interface IOrderUpdatePayload {
    to: string;
    payload: NSRestaurant.IOrder;
  }
}

export default NSSocket;

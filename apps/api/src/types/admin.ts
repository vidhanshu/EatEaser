import { NSAuth } from "./auth";

export namespace NSAdmin {
  export interface IAdminCreatePayload extends NSAuth.IUserSignupPayload {
    restaurantId: string;
  }
}

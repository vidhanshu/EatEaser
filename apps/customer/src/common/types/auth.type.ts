namespace NSAuth {
  export interface IUser {
    _id: string;
    name: string;
    image?: string;
    email: string;
    phone: string;
    role: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }
}

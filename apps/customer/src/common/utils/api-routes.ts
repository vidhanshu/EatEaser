export const ROUTES = {
  auth: {
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    signOutAll: "/auth/sign-out-all",
    profile: "/auth/profile",
    verifyEmail: "/auth/verify-email",
    resendEmailVerificationOTP: "/auth/resend-email-verification-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  restaurant: {
    category: {
      list: (resturantId: string) => `/restaurant/${resturantId}/category/list`,
      byId: (id: string) => `/restaurant/category/${id}/get`,
    },
    menuItem: {
      list: (resturantId: string) =>
        `/restaurant/${resturantId}/menu-item/list`,
      byId: (id: string) => `/restaurant/menu/menu-item/${id}/get`,
    },
  },
};

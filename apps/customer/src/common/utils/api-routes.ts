export const ROUTES = {
  auth: {
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    signOutAll: "/auth/sign-out-all",
    profile: "/auth/profile",
    update: "/auth/profile/update",
    verifyEmail: "/auth/verify-email",
    resendEmailVerificationOTP: "/auth/resend-email-verification-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  restaurant: {
    list: "/restaurant/list",
    byId: (id: string) => `/restaurant/${id}/get`,
    category: {
      list: (resturantId: string) => `/restaurant/${resturantId}/category/list`,
      byId: (id: string) => `/restaurant/category/${id}/get`,
    },
    menuItem: {
      list: (resturantId: string) => `/restaurant/${resturantId}/menu-item/list`,
      byId: (id: string) => `/restaurant/menu/menu-item/${id}/get`,
    },
    table: {
      list: "/admin/restaurant/table/list",
      byId: (id: string) => `/admin/restaurant/table/${id}/get`,
    },
    order: {
      list: "/restaurant/order/list",
      byId: "/restaurant/order/:id/get",
      create: "/restaurant/order/create",
      cancel: "/restaurant/order/:id/cancel",
      update: "/restaurant/order/:id/update",
    },
  },
  file: {
    upload: "/file/upload",
    delete: "/file/delete",
  },
};

export const ROUTES = {
  auth: {
    signIn: "/auth/admin/sign-in",
    signOut: "/auth/admin/sign-out",
    signOutAll: "/auth/admin/sign-out-all",
    verifyEmail: "/auth/admin/verify-email",
    resendEmailVerificationOTP: "/auth/admin/resend-email-verification-otp",
    profile: "/auth/admin/profile",
    forgotPassword: "/auth/admin/forgot-password",
    resetPassword: "/auth/admin/reset-password",
  },
  restaurant: {
    myRestaurant: "/admin/restaurant/my-restaurant",
    update: "/admin/restaurant/update",
    menuItem: {
      create: `/admin/restaurant/menu-item/create`,
      delete: (id: string) => `/admin/restaurant/menu-item/${id}/delete`,
      update: (id: string) => `/admin/restaurant/menu-item/${id}/update`,
      list: `/admin/restaurant/menu-item/list`,
      byId: (id: string) => `/admin/restaurant/menu-item/${id}/get`,
    },
    category: {
      create: "/admin/restaurant/category/create",
      update: (id: string) => `/admin/restaurant/category/${id}/update`,
      delete: (id: string) => `/admin/restaurant/category/${id}/delete`,
      list: "/admin/restaurant/category/list",
      byId: (id: string) => `/admin/restaurant/category/${id}/get`,
    },
    addOn: {
      create: "/admin/restaurant/add-on/create",
      update: (id: string) => `/admin/restaurant/add-on/${id}/update`,
      delete: (id: string) => `/admin/restaurant/add-on/${id}/delete`,
      list: "/admin/restaurant/add-on/list",
      byId: (id: string) => `/admin/restaurant/add-on/${id}/get`,
    },
    table: {
      create: "/admin/restaurant/table/create",
      update: (id: string) => `/admin/restaurant/table/${id}/update`,
      delete: (id: string) => `/admin/restaurant/table/${id}/delete`,
      list: "/admin/restaurant/table/list",
      byId: (id: string) => `/admin/restaurant/table/${id}/get`,
    },
  },
  file: {
    upload: "/file/upload",
    delete: "/file/delete",
  },
};

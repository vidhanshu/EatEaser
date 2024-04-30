export const ROUTES = {
  customer: {
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
      byId: "/restaurant/:id/get",
      menuItem: {
        list: "/restaurant/:id/menu-item/list",
        byId: "/restaurant/menu/menu-item/:id/get",
      },
      category: {
        list: "/restaurant/:restaurantId/category/list",
        byId: "/restaurant/category/:id/get",
      },
      table: {
        list: "/admin/restaurant/table/list",
        byId: "/admin/restaurant/table/:id/get",
      },
      order: {
        list: "/restaurant/order/list",
        byId: "/restaurant/order/:id/get",
        create: "/restaurant/order/create",
        cancel: "/restaurant/order/:id/cancel",
        update: "/restaurant/order/:id/update",
      },
    },
  },
  admin: {
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
        create: "/admin/restaurant/menu-item/create",
        delete: "/admin/restaurant/menu-item/:id/delete",
        update: "/admin/restaurant/menu-item/:id/update",
        list: "/admin/restaurant/menu-item/list",
        byId: "/admin/restaurant/menu-item/:id/get",
      },
      category: {
        create: "/admin/restaurant/category/create",
        update: "/admin/restaurant/category/:id/update",
        delete: "/admin/restaurant/category/:id/delete",
        list: "/admin/restaurant/category/list",
        byId: "/admin/restaurant/category/:id/get",
      },
      addOn: {
        create: "/admin/restaurant/add-on/create",
        update: "/admin/restaurant/add-on/:id/update",
        delete: "/admin/restaurant/add-on/:id/delete",
        list: "/admin/restaurant/add-on/list",
        byId: "/admin/restaurant/add-on/:id/get",
      },
      table: {
        create: "/admin/restaurant/table/create",
        update: "/admin/restaurant/table/:id/update",
        delete: "/admin/restaurant/table/:id/delete",
        list: "/admin/restaurant/table/list",
        byId: "/admin/restaurant/table/:id/get",
      },
      order: {
        list: "/admin/restaurant/order/list",
        byId: "/admin/restaurant/order/:id/get",
        update: "/admin/restaurant/order/:id/update",
      },
    },
  },
  superAdmin: {
    auth: {
      signIn: "/auth/super-admin/sign-in",
      signOut: "/auth/super-admin/sign-out",
      signOutAll: "/auth/super-admin/sign-out-all",
      verifyEmail: "/auth/super-admin/verify-email",
      resendEmailVerificationOTP:
        "/auth/super-admin/resend-email-verification-otp",
      profile: "/auth/super-admin/profile",
      forgotPassword: "/auth/super-admin/forgot-password",
      resetPassword: "/auth/super-admin/reset-password",
    },
    restaurant: {
      delete: "/super-admin/restaurant/delete",
      create: "/super-admin/restaurant/create",
      update: "/super-admin/restaurant/update",
      list: "/super-admin/restaurant/list",
      admin: {
        create: "/super-admin/restaurant/:restaurantId/admin/create",
      },
    },
  },
};

// auth
export const SALT = 10;
export const OTP_EXPIRES_IN_FROM_NOW = 300; // sec = 5 min
export const RESET_PASSWORD_TOKEN_EXPIRES_IN = "5m";
export const MAX_SESSIONS_ALLOWED_PER_USER = 5;

// RegEx
export const MOBILE_REGEX = /^[0-9]{10,15}$/;

// enums
export const ROLES = ["customer", "admin", "staff", "kitchen", "super-admin"];
export const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
export const PAYMENT_STATUS = ["PENDING", "COMPLETED", "FAILED"];
export const ORDER_STATUS = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
export const PAYMENT_METHODS = ["CASH", "CARD", "ONLINE"];

// S3
export const S3_VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
export const S3_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const S3_ALL_AVAILABLE_PATHS = [
  "staff/",
  "dish/",
  "kitchen/",
  "customer/",
  "restaurant/",
  "admin/",
];
export const S3_PATH_ACCESS = {
  staff: ["staff/"],
  kitchen: ["dish/", "kitchen/"],
  customer: ["customer/"],
  admin: ["restaurant/", "admin/", "dish/"],
  "super-admin": ["restaurant/", "admin/", "dish/", "customer/", "staff/"],
};

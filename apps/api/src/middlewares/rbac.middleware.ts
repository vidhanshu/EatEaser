/**
 * This is role based access control middleware
 * it checks if the upcoming request is allowed for the specified roles
 */
import httpStatus from "http-status";
import { NextFunction, Response } from "express";

import { NSAuth, NSCommon } from "../types";
import { sendResponse } from "../utils/response";

export function RBACMiddleware(roles: NSAuth.ROLES[] = []) {
  return function (
    req: NSCommon.IAuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    if (!roles.includes(req.role!)) {
      return sendResponse(res, {
        error: "Forbidden",
        statusCode: httpStatus.FORBIDDEN,
      });
    }
    next();
  };
}

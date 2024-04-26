import { NextFunction, Response } from "express";
import { verifyJWT } from "../utils/helpers";
import { NSCommon, NSAuth } from "../types";
import { User } from "../models";
import { redis } from "../configs";
import { ResponseError, sendErrorResponse } from "../utils/response";

export async function authMiddleware(
  req: NSCommon.IAuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const rawToken = req.headers.authorization?.split(" ");
    if (!rawToken?.length || rawToken?.[0] !== "Bearer" || !rawToken?.[1]) {
      throw new ResponseError("Unauthorized", 401);
    }
    const token = rawToken[1];
    const { _id } = verifyJWT(token);
    const userExists = await User.findById(_id);
    if (!userExists) {
      throw new ResponseError("Unauthorized", 401);
    }
    const userTokens = await redis.lrange(`accessTokens:${_id}`, 0, -1);
    if (!userTokens.includes(token)) {
      throw new ResponseError("Unauthorized", 401);
    }

    if (!["customer", "super-admin"].includes(userExists.role)) {
      // in here the user would be restaurant entity i.e. admin, staff, etc.
      if (!userExists.restaurant) {
        throw new ResponseError("Unauthorized", 401);
      } else {
        req.restaurantId = userExists.restaurant;
      }
    }
    req._id = _id;
    req.role = userExists.role as NSAuth.ROLES;
    // token is required for sign out, hence attaching it with req
    req.token = token;
    next();
  } catch (error: any) {
    sendErrorResponse(res, error);
  }
}

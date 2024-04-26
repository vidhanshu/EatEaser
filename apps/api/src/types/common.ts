/**
 * This file contains common types used across the application
 */

import type { NextFunction, Request, Response } from "express";
import type { DeepPartial } from "utility-types";
import { NSAuth } from "./auth";

export namespace NSCommon {
  // See this for the following types
  // https://stackoverflow.com/questions/34508081/how-to-add-typescript-definitions-to-express-req-res
  // https://stackoverflow.com/questions/61132262/typescript-deep-partial

  export type RequireAtLeastOne<T> = {
    [K in keyof T]-?: Required<Pick<T, K>> &
      Partial<Pick<T, Exclude<keyof T, K>>>;
  }[keyof T];

  // More strictly typed Express.Request type
  export type TypedRequest<
    ReqBody = Record<string, unknown>,
    QueryString = Record<string, unknown>,
  > = Request<
    Record<string, unknown>,
    Record<string, unknown>,
    DeepPartial<ReqBody>,
    DeepPartial<QueryString>
  >;

  // More strictly typed express middleware type
  export type ExpressMiddleware<
    ReqBody = Record<string, unknown>,
    Res = Record<string, unknown>,
    QueryString = Record<string, unknown>,
  > = (
    req: TypedRequest<ReqBody, QueryString>,
    res: Response<Res>,
    next: NextFunction,
  ) => Promise<void> | void;

  // This is express request type with user property
  export interface IAuthRequest extends Request {
    _id?: string;
    role?: NSAuth.ROLES;
    token?: string;
    restaurantId?: string;
  }

  export interface IListDataPayload {
    resultPerPage?: number;
    page?: number;
  }
  export interface IIdParamPayload {
    id: string;
  }
}

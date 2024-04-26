/**
 * [STANDARD RESPONSE PATTERN]
 * return response will contain a json which may have 5 fields: data, error, message, token, errors
 */

import { Response } from "express";

export class ResponseError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const sendErrorResponse = (res: Response, error: any) => {
  if (error instanceof ResponseError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  res.status(500).json({ error: error.message });
};

type ResponsePayload = {
  data?: any;
  error?: string;
  message?: string;
  token?: string;
  statusCode?: number;
  errors?: { field: string; message: string }[];
};
export const sendResponse = (
  res: Response,
  { data, error, message, token, statusCode = 200, errors }: ResponsePayload,
) => {
  res.status(statusCode).json({
    message: message,
    data: data,
    errors,
    error,
    token,
  });
};

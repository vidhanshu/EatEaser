import { Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../utils/response";
import { config, s3Client } from "../configs";
import { NSCommon } from "../types";
import { S3_PATH_ACCESS } from "../utils/constants";

const handleDeleteObject = async (
  req: NSCommon.IAuthRequest,
  res: Response,
) => {
  try {
    const role = req.role!;
    const ALLOWED_PATHS = S3_PATH_ACCESS[role];
    const dir = req.body.key.split("/")[0];
    if (!ALLOWED_PATHS.includes(`${dir}/`)) {
      throw new ResponseError("Unauthorized", 403);
    }
    const command = new DeleteObjectCommand({
      Key: req.body.key,
      Bucket: config.s3.bucket_name,
    });

    await s3Client.send(command);

    sendResponse(res, {
      message: "File deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const s3Controller = { handleDeleteObject };

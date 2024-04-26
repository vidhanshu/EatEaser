import { Request, Router } from "express";
import multer, { MulterError } from "multer";
import multerS3 from "multer-s3";
import { RBACMiddleware, authMiddleware, validate } from "../middlewares";
import { s3Controller } from "../controllers";
import { config, s3Client } from "../configs";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../utils/response";
import { s3Validation } from "../utils/validations";
import {
  S3_MAX_FILE_SIZE,
  S3_PATH_ACCESS,
  S3_VALID_FILE_TYPES,
} from "../utils/constants";
import { NSCommon } from "../types";

export const s3Router = Router();

var upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: config.s3.bucket_name,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file, cb) {
      const key = `${req.query.path}${Date.now()}-${file.originalname}`;
      cb(null, key);
    },
  }),
  limits: {
    fileSize: S3_MAX_FILE_SIZE, // we are allowing only 5 MB files
    files: 1, // only 1 file is allowed
  },
  fileFilter: function (req: NSCommon.IAuthRequest, file, cb) {
    const path = req.query.path as string;
    const role = req.role!;
    const ALLOWED_PATHS = S3_PATH_ACCESS[role]; // get allowed paths based on role

    if (!path) {
      return cb(
        new ResponseError(
          `field path is required, ${ALLOWED_PATHS.join(
            ", "
          )} are valid values for path`,
          403
        )
      );
    }
    if (!ALLOWED_PATHS.includes(path)) {
      return cb(
        new ResponseError(
          `path is not allowed, allowed paths ${ALLOWED_PATHS.join(", ")}`,
          403
        )
      );
    }
    if (!file) {
      return cb(new ResponseError("File is required", 403));
    }
    if (!S3_VALID_FILE_TYPES.includes(file.mimetype.toLowerCase())) {
      return cb(
        new ResponseError(
          `File type is not supported. Only ${S3_VALID_FILE_TYPES.join(
            ", "
          )}  are supported`,
          403
        )
      );
    }
    cb(null, true);
  },
});

s3Router.post(
  "/upload",
  authMiddleware,
  RBACMiddleware(["admin", "customer"]),
  validate(s3Validation.uploadFileSchema),
  function (req: any, res) {
    upload.single("file")(req, res, function (err) {
      if (err) {
        if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE") {
          return sendErrorResponse(
            res,
            new ResponseError(
              "File size is too large. Allowed file size is 5MB",
              403
            )
          );
        }
        return sendErrorResponse(res, err);
      }
      sendResponse(res, {
        message: "File uploaded successfully",
        data: {
          url: req.file?.location,
        },
      });
    });
  }
);

s3Router.delete(
  "/delete",
  authMiddleware,
  RBACMiddleware(["admin", "customer"]),
  validate(s3Validation.deleteFileSchema),
  s3Controller.handleDeleteObject
);

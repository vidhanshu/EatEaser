/**
 * All server configuration, routes, middlewares lies in this file
 */

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { Server } from "socket.io";
import { createServer } from "http";
import express, { Express, Request, Response } from "express";

import { config } from "./configs";
import { authLimiter } from "./middlewares";
import {
  s3Router,
  superAdminAuthRouter,
  superAdminAdminRouter,
  superAdminRestaurantRouter,
  adminAuthRouter,
  adminTableRouter,
  adminAddOnRouter,
  adminOrderRouter,
  adminCategoryRouter,
  adminMenuItemRouter,
  adminRestaurantRouter,
  customerAuthRouter,
  customerOrderRouter,
  customerCategoryRouter,
  customerMenuItemRouter,
  customerRestaurantRouter,
} from "./routes";
import { customerTableRouter } from "./routes/customer/restaurant/table.route";

const app: Express = express();
const httpServer = createServer(app);

// for api request logging
app.use(morgan("dev"));

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(
  cors({
    origin: String(config.cors.cors_origin).split("|"),
    credentials: true,
  })
);

// api routes
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.get("/api/health", (req: Request, res: Response) => {
  res.send("Health is fine ✅");
});

// add auth limiter in production
if (process.env.NODE_ENV === "production") {
  app.use("/api/auth", authLimiter);
}
// superadmin routes
app
  .use("/api", superAdminAuthRouter)
  .use("/api", superAdminAdminRouter)
  .use("/api", superAdminRestaurantRouter);

// admin routes
app
  .use("/api", adminAuthRouter)
  .use("/api", adminTableRouter)
  .use("/api", adminOrderRouter)
  .use("/api", adminAddOnRouter)
  .use("/api", adminCategoryRouter)
  .use("/api", adminMenuItemRouter)
  .use("/api", adminRestaurantRouter);

// customer routes
app
  .use("/api", customerAuthRouter)
  .use("/api", customerOrderRouter)
  .use("/api", customerCategoryRouter)
  .use("/api", customerMenuItemRouter)
  .use("/api", customerRestaurantRouter)
  .use("/api", customerTableRouter);

// s3 routes
app.use("/api/file", s3Router);

// realtime (socket) server
const io = new Server(httpServer, {
  cors: {
    origin: String(config.cors.cors_origin).split("|"),
    credentials: true,
  },
});

export { httpServer, io };

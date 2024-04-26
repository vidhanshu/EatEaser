import mongoose from "mongoose";
import { config } from "./config";

mongoose
  .connect(config.mongo.uri)
  .then(() => {
    console.log("Database connected 🧃");
  })
  .catch((err) => {
    console.log(`Error connecting database: ${err.message}`);
  });

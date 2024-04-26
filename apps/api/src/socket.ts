/**
 * All realtime logic should be handled here
 */
import { io } from "./app";

io.on("connection", (socket) => {
  console.log("[USER_CONNECTED]", socket.id);
});

/**
 * All realtime logic should be handled here
 */
import { Socket } from "socket.io";
import { io } from "./app";
import NSSocket from "./types/socket";
import { socketContext } from "./utils/contexts/socket-context";
import { generateOTP } from "./utils/helpers";
import { SOCKET_EVENTS } from "./utils/socket-events";

io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket & { handshake: any }) => {
  if (socket.handshake.query.userId) {
    socketContext.set(socket.handshake.query.userId, socket.id);
  }
  console.log("[USER_CONENCTED_WITH_USER_ID_&_SOCKET_ID]", socket.handshake.query.userId, socket.id);

  socket.on(SOCKET_EVENTS.ORDER_UPDATED, ({ to, payload, notify }: NSSocket.IOrderUpdatePayload & { notify?: boolean }) => {
    const socketId = socketContext.get(to);
    if (socketId) {
      io.to(socketId).emit(SOCKET_EVENTS.ORDER_UPDATED, payload);
      if (notify) {
        io.to(socketId).emit(SOCKET_EVENTS.NOTIFICATION, {
          type: "ORDER",
          id: payload._id,
          notId: generateOTP(10),
          message: payload.status === "CONFIRMED" ? "Your order is confirmed!" : `Your order status got changed to ${payload.status.toLowerCase()}!`,
          timestamp: new Date(),
        });
      }
    }
    console.log("[ORDER_UPDATED]", to, payload, notify);
  });

  socket.on(SOCKET_EVENTS.ORDER_CANCELLED, ({ to, orderId }: { to: string; orderId: string }) => {
    const socketId = socketContext.get(to);
    if (socketId) {
      io.to(socketId).emit(SOCKET_EVENTS.ORDER_CANCELLED, orderId);
    }
    console.log("[ORDER_CANCELLED]", to, orderId);
  });

  socket.on(SOCKET_EVENTS.PAYMENT_SUCCESS, ({ to, payload }: { to: string; payload: string }) => {
    const socketId = socketContext.get(to);
    if (socketId) io.to(socketId).emit(SOCKET_EVENTS.PAYMENT_SUCCESS, payload);
    console.log("[PAYMENT_SUCCESS]", to, payload);
  });

  socket.on(SOCKET_EVENTS.ORDER_CREATED, ({ to, payload }: NSSocket.IOrderUpdatePayload) => {
    const socketId = socketContext.get(to);
    if (socketId) io.to(socketId).emit(SOCKET_EVENTS.ORDER_CREATED, payload);
    console.log("[ORDER_CREATED]", to, payload);
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    socketContext.delete(socket.handshake.query.userId);
    console.log("[USER_DISCONNECTED_WITH_USER_ID_&_SOCKET_ID]", socket.handshake.query.userId, socket.id);
  });
});

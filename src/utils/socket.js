import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (socket && socket.connected) return socket;
  if (socket) return socket;

  socket = io({
    withCredentials: true,
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("socket connected:", socket.id);
  });
  socket.on("connect_error", (err) => {
    console.log("socket connect_error:", err.message);
  });
  socket.on("disconnect", (reason) => {
    console.log("socket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

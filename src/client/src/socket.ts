import { io } from "socket.io-client";

export const socket = io("http://localhost:4000");

socket.on("connect", () => {
    console.log("connected to server, id =", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("socket connect_error:", err);
});

socket.on("disconnect", (reason) => {
    console.log("socket disconnected:", reason);
});

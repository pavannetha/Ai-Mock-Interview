import { io } from "socket.io-client";

const socket = io(`http://localhost:4000`, {
  autoConnect: false,
  auth: { token: localStorage.getItem("token") },
});

export const reconnectSocket = () => {
  const token = localStorage.getItem("token");
  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;

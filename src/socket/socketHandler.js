import jwt from "jsonwebtoken";

export const onlineUsers = new Map();

export const socketHandler = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication Error: Token Not Provided!"));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decodedToken;
      next();
    } catch (err) {
      return next(new Error("Authentication Error: Invalid Token!"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ User ${socket.user.id} Connected:`, socket.id);
    onlineUsers.set(socket.user.id, socket.id);

    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));

    socket.on("disconnect", () => {
      console.log("❌ A User Disconnected:", socket.id);
      onlineUsers.delete(socket.user.id);

      io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

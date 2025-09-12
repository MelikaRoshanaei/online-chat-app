import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const onlineUsers = new Map();

export const socketHandler = (io) => {
  io.use((socket, next) => {
    try {
      cookieParser()(socket.request, socket.request.res || {}, (err) => {
        if (err) return next(err);

        const { accessToken } = socket.request.cookies || {};
        if (!accessToken) {
          return next(new Error("Authentication Error: No Access Token!"));
        }

        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        socket.user = decodedToken;
        next();
      });
    } catch (err) {
      return next(new Error("Authentication Error: ", err.message));
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

import jwt from "jsonwebtoken";

export const socketHandler = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication Error: Token Not Provided!"));
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decode;
      next();
    } catch (err) {
      return next(new Error("Authentication Error: Invalid Token!"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ A User Connected!", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ A User Disconnected:", socket.id);
    });
  });
};

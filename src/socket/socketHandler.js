export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ A User Connected!", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ A User Disconnected:", socket.id);
    });
  });
};

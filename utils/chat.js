const Messages = require("../models/message/messages");

function chatHandler(io) {
  io.on("connection", (socket) => {
    console.log("[Chat] New socket connected:", socket.id);

    // ✅ Join a Team Room
    socket.on("joinTeamRoom", ({ teamId, userId }) => {
      console.log("[Chat] joinTeamRoom received:", { teamId, userId });

      if (!teamId || !userId) {
        console.log("[Chat] Missing teamId or userId — cannot join room.");
        return;
      }

      socket.join(teamId);
      socket.data = { teamId, userId };
      console.log(`[Chat] User ${userId} joined team room ${teamId}`);
    });

    // ✅ Send Message
    socket.on("sendMessage", async ({ teamId, senderId, content }) => {
      console.log("[Chat] sendMessage received:", { teamId, senderId, content });

      if (!teamId || !senderId || !content) {
        console.log("[Chat] Missing required fields for sendMessage.");
        return;
      }

      try {
        const message = await Messages.create({
          teamId,
          senderId,
          content,
        });

        // Emit to all sockets in the same room
        io.to(teamId).emit("receiveMessage", {
          _id: message._id,
          content: message.content,
          senderId: message.senderId,
          teamId: message.teamId,
          createdAt: message.createdAt,
        });
      } catch (err) {
        console.error("[Chat] Error saving message:", err);
      }
    });

    // ✅ Fetch Chat History
    socket.on("fetchHistory", async ({ teamId }) => {
      if (!teamId) return;

      try {
        const history = await Messages.find({ teamId })
          .populate("senderId", "name email")
          .sort({ createdAt: 1 });

        socket.emit("chatHistory", history);
      } catch (err) {
        console.error("[Chat] Error fetching chat history:", err);
      }
    });

    // ✅ Handle Disconnect
    socket.on("disconnect", () => {
      console.log("[Chat] Socket disconnected:", socket.id);
    });
  });
}

module.exports = chatHandler;

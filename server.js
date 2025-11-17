const app = require("./app")
const dotenv = require("dotenv");
const connectToMongoDB = require("./config/connectDB");
const http = require("http");
const { Server } = require("socket.io");
const chatHandler = require("./utils/chat.js");
dotenv.config({ path: "config/config.env" });


// Handling UnCaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`UnCaughtException Error: ${err}`);
  console.log(`Shutting the Server due to UnCaught Exception Error`);
  process.exit(1);
});

const PORT = process.env.PORT || 3839
app.get("/", (req, res) => {
    res.send("Hi, I am Live Here ✅👍✅");
})

connectToMongoDB()
const server = http.createServer(app);

// Initialize Socket.IO with CORS support
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3008",
      "http://localhost:3008/",
    ],
    credentials: true,
  },
});

chatHandler(io);

server.listen(PORT, () => {
    console.log(`Server is Wokring PORT No. http://localhost:${PORT} `)
})

// Unhandled Promises Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log(`Shutting Down the Server due to the Unhandled Rejection Error`);
  server.close(() => {
    process.exit(1);
  });
});
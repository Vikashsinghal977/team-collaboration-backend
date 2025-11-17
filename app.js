const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// CORS ORIGIN
app.use(
  cors({
    origin: [
      "http://localhost:3008",
      "http://localhost:3008/",
      "https://workunity.netlify.app",
      "https://workunity.netlify.app/"
    ],
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

// User Routes
const userRoutes = require("./routers/users/users");
const teamsRoutes = require("./routers/teams/teams");
const projectsRoutes = require("./routers/projects/projects");
const tasksRoutes = require("./routers/task/tasks");
const messageRoutes = require("./routers/message/messages")


// Api's
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/teams", teamsRoutes);
app.use("/api/v1/projects", projectsRoutes);
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/message", messageRoutes);


module.exports = app;
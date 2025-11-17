const express = require("express");
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
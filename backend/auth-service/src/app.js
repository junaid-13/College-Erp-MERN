"use strict";

const express = require("express");

const logger = require("../../../shared/logger/logger");
const buildCors = require("../../../shared/middleware/cors");
const errorHandler = require("../../../shared/middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(buildCors());
app.use(express.json());
app.use(logger.requestLogger);

app.use("/health", healthRoutes);

// Auth API. Mounted at root (the gateway strips the /api/auth prefix)
// and at /api/auth (for direct service access during testing).
app.use("/", authRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ service: "auth-service", status: "ok" });
});

app.use(errorHandler.notFoundHandler);
app.use(errorHandler);

module.exports = app;

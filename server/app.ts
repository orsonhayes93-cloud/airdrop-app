import express from "express";
import cors from "cors";
import { router } from "./routes";

export const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5000" }));
app.use(express.json());
app.use(express.static("dist/client"));

// API routes
app.use("/api", router);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

import express from "express";
import cors from "cors";
import { router } from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Allowed origins: local dev + live frontend
const allowedOrigins = [
  "http://localhost:5000",            // your local frontend
  process.env.ALLOWED_ORIGIN || ""    // live frontend URL from .env
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

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

export { app };

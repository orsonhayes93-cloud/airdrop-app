import { app } from "./app";

const PORT = 5001;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Stop the other process and try again.`);
    process.exit(1);
  }
  throw err;
});

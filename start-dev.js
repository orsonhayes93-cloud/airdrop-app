#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Starting full-stack development environment...");
console.log("📦 Frontend: http://localhost:5000 (Vite)");
console.log("🔧 Backend: http://localhost:5001 (Express)");
console.log("");

// Start frontend (Vite)
const frontend = spawn("npm", ["run", "dev:vite"], {
  cwd: process.cwd(),
  stdio: "inherit",
  shell: true,
});

// Start backend (tsx watch)
setTimeout(() => {
  const backend = spawn("npx", ["tsx", "watch", "server/index.ts"], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });

  backend.on("error", (err) => {
    console.error("Backend error:", err);
  });
}, 1000);

frontend.on("error", (err) => {
  console.error("Frontend error:", err);
});

// Handle Ctrl+C
process.on("SIGINT", () => {
  console.log("\n\nShutting down servers...");
  process.exit(0);
});

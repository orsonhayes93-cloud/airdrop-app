#!/usr/bin/env node
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Start both servers
const frontend = spawn("npm", ["run", "dev"], {
  cwd: __dirname,
  stdio: "inherit",
  env: { ...process.env, PORT: "5000" },
});

// Give frontend a second to start, then start backend
setTimeout(() => {
  const backend = spawn("npx", ["tsx", "watch", "server/index.ts"], {
    cwd: __dirname,
    stdio: "inherit",
    env: { ...process.env, PORT: "5001" },
  });

  process.on("SIGINT", () => {
    frontend.kill();
    backend.kill();
    process.exit(0);
  });
}, 1000);

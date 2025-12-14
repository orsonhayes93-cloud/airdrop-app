import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Starting frontend and backend...\n');

// Start backend
const backend = spawn('npx', ['tsx', 'server/index-dev.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
});

// Start frontend after a short delay
setTimeout(() => {
  const frontend = spawn('npx', ['vite', 'dev', '--port', '5000'], {
    cwd: __dirname,
    stdio: 'inherit',
  });

  frontend.on('error', (err) => {
    console.error('Frontend error:', err);
    process.exit(1);
  });
}, 1000);

backend.on('error', (err) => {
  console.error('Backend error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  backend.kill();
  process.exit(0);
});

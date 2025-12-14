#!/bin/bash
echo "🚀 Starting both Backend (5001) and Frontend (5000)..."
concurrently "tsx server/index-dev.ts" "vite dev --port 5000"

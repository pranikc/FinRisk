#!/bin/bash
# FinRisk AI - Start All Services
# Usage: ./start.sh

cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
PID_DIR="$PROJECT_DIR/.pids"
mkdir -p "$PID_DIR"

echo "========================================"
echo "  FinRisk AI - Starting All Services"
echo "========================================"

# Kill any existing services first
"$PROJECT_DIR/stop.sh" 2>/dev/null

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "[setup] Installing dependencies..."
  npm install
fi

# --- Frontend (Vite) ---
echo "[frontend] Starting Vite dev server..."
npx vite --host > "$PID_DIR/frontend.log" 2>&1 &
echo $! > "$PID_DIR/frontend.pid"
echo "[frontend] PID: $(cat "$PID_DIR/frontend.pid")"

# --- Backend (add future backend services here) ---
# Example:
# echo "[backend] Starting API server..."
# node server.js > "$PID_DIR/backend.log" 2>&1 &
# echo $! > "$PID_DIR/backend.pid"
# echo "[backend] PID: $(cat "$PID_DIR/backend.pid")"

# Wait for frontend to be ready
echo ""
echo "Waiting for services to start..."
sleep 2

echo ""
echo "========================================"
echo "  Services Running:"
echo "  Frontend:  http://localhost:5173"
# echo "  Backend:   http://localhost:3001"
echo ""
echo "  Logs:      $PID_DIR/*.log"
echo "  Stop all:  ./stop.sh"
echo "========================================"

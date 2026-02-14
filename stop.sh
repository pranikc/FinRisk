#!/bin/bash
# FinRisk AI - Stop All Services
# Usage: ./stop.sh

cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
PID_DIR="$PROJECT_DIR/.pids"

echo "========================================"
echo "  FinRisk AI - Stopping All Services"
echo "========================================"

STOPPED=0

# Kill all services from PID files
if [ -d "$PID_DIR" ]; then
  for pidfile in "$PID_DIR"/*.pid; do
    [ -f "$pidfile" ] || continue
    SERVICE=$(basename "$pidfile" .pid)
    PID=$(cat "$pidfile")
    if kill -0 "$PID" 2>/dev/null; then
      kill "$PID" 2>/dev/null
      # Wait briefly then force kill if still running
      sleep 0.5
      kill -0 "$PID" 2>/dev/null && kill -9 "$PID" 2>/dev/null
      echo "[${SERVICE}] Stopped (PID: $PID)"
      STOPPED=$((STOPPED + 1))
    else
      echo "[${SERVICE}] Already stopped (PID: $PID)"
    fi
    rm -f "$pidfile"
  done
fi

# Fallback: kill any stray vite/node processes tied to this project
pkill -f "vite.*$PROJECT_DIR" 2>/dev/null && echo "[cleanup] Killed stray vite process" && STOPPED=$((STOPPED + 1))
pkill -f "node.*$PROJECT_DIR/server" 2>/dev/null && echo "[cleanup] Killed stray node process" && STOPPED=$((STOPPED + 1))

# Clean up old PID file if it exists
rm -f "$PROJECT_DIR/.vite.pid"

if [ "$STOPPED" -eq 0 ]; then
  echo "No running services found."
fi

echo "========================================"

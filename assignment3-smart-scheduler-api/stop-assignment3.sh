#!/bin/bash

echo "🛑 Stopping Assignment 3 services..."

# Kill by PID if file exists
if [ -f .assignment3_pids ]; then
    while read -r pid; do
        kill $pid 2>/dev/null || true
        echo "Stopped process $pid"
    done < .assignment3_pids
    rm .assignment3_pids
fi

# Kill by port and process name
lsof -ti:5002 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "ProjectManagerApi" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

echo "✅ Assignment 3 services stopped"
echo "📁 Log files: backend.log, frontend.log"

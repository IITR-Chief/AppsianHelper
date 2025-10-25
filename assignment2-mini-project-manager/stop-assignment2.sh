#!/bin/bash

echo "🛑 Stopping Assignment 2 services..."

# Kill by PID if file exists
if [ -f .assignment2_pids ]; then
    while read -r pid; do
        kill $pid 2>/dev/null || true
        echo "Stopped process $pid"
    done < .assignment2_pids
    rm .assignment2_pids
fi

# Kill by port and process name
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "ProjectManagerApi" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

echo "✅ Assignment 2 services stopped"
echo "📁 Log files: backend.log, frontend.log"

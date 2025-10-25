#!/bin/bash

echo "🛑 Stopping Assignment 1 services..."

# Kill by PID if file exists
if [ -f .assignment1_pids ]; then
    while read -r pid; do
        kill $pid 2>/dev/null || true
        echo "Stopped process $pid"
    done < .assignment1_pids
    rm .assignment1_pids
fi

# Kill by port and process name
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "TaskManagerApi" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

echo "✅ Assignment 1 services stopped"
echo "📁 Log files: backend.log, frontend.log"

#!/bin/bash

echo "🛑 Stopping all assignment services..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill processes by name
echo -e "${YELLOW}Stopping .NET processes...${NC}"
pkill -f "dotnet run" 2>/dev/null || true
pkill -f "TaskManagerApi" 2>/dev/null || true
pkill -f "ProjectManagerApi" 2>/dev/null || true

echo -e "${YELLOW}Stopping React processes...${NC}"
pkill -f "react-scripts" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true

# Kill specific ports
echo -e "${YELLOW}Killing processes on ports 5000, 5001, 5002, 3000...${NC}"
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5002 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Clean up PID file if it exists
if [ -f .test_pids ]; then
    echo -e "${YELLOW}Cleaning up tracked processes...${NC}"
    while read -r pid; do
        kill $pid 2>/dev/null || true
    done < .test_pids
    rm .test_pids
fi

echo -e "${GREEN}✅ All services stopped!${NC}"
echo -e "${YELLOW}💡 Ports 3000, 5000, 5001, 5002 are now available${NC}"

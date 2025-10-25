#!/bin/bash

echo "🔷 Assignment 1: Basic Task Manager - Testing Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if service is running
check_service() {
    local url=$1
    local service_name=$2
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not running${NC}"
        return 1
    fi
}

echo -e "${BLUE}Starting Assignment 1 Services...${NC}"

# Kill existing processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "TaskManagerApi" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Start Backend
echo -e "${YELLOW}Starting backend...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
dotnet run --urls="http://localhost:5000" > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 8

# Check backend
if check_service "http://localhost:5000/api/tasks" "Backend API"; then
    echo -e "${BLUE}Backend API: http://localhost:5000/api/tasks${NC}"
    echo -e "${BLUE}Swagger UI: http://localhost:5000/swagger${NC}"
else
    echo -e "${RED}Backend failed to start. Check backend.log${NC}"
    exit 1
fi

# Start Frontend
echo -e "${YELLOW}Starting frontend...${NC}"
cd frontend
npm install > /dev/null 2>&1
BROWSER=none npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
sleep 12

# Check frontend
if check_service "http://localhost:3000" "Frontend App"; then
    echo -e "${BLUE}Frontend App: http://localhost:3000${NC}"
else
    echo -e "${RED}Frontend failed to start. Check frontend.log${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Assignment 1 is running successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Service URLs:${NC}"
echo -e "${YELLOW}• Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}• Backend API: http://localhost:5000/api/tasks${NC}"
echo -e "${YELLOW}• Swagger UI: http://localhost:5000/swagger${NC}"
echo ""
echo -e "${BLUE}🧪 API Test Commands:${NC}"
echo -e "${YELLOW}# Get all tasks${NC}"
echo -e "curl http://localhost:5000/api/tasks"
echo ""
echo -e "${YELLOW}# Create a task${NC}"
echo -e 'curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d "{\"description\":\"API Test Task\",\"isCompleted\":false}"'
echo ""
echo -e "${YELLOW}# Update a task (replace {id} with actual task ID)${NC}"
echo -e 'curl -X PUT http://localhost:5000/api/tasks/{id} -H "Content-Type: application/json" -d "{\"description\":\"Updated Task\",\"isCompleted\":true}"'
echo ""
echo -e "${YELLOW}# Delete a task (replace {id} with actual task ID)${NC}"
echo -e 'curl -X DELETE http://localhost:5000/api/tasks/{id}'
echo ""
echo -e "${BLUE}🎯 Manual Test Checklist:${NC}"
echo -e "${YELLOW}1. Open http://localhost:3000 in browser${NC}"
echo -e "${YELLOW}2. Add a new task${NC}"
echo -e "${YELLOW}3. Mark task as completed${NC}"
echo -e "${YELLOW}4. Test filter buttons (All/Active/Completed)${NC}"
echo -e "${YELLOW}5. Delete a task${NC}"
echo -e "${YELLOW}6. Test offline mode (disconnect network)${NC}"
echo ""

# Save PIDs for cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .assignment1_pids

echo -e "${YELLOW}⚠️  To stop services, run: ./stop-assignment1.sh${NC}"
echo -e "${GREEN}Services are running in background. Check logs: backend.log, frontend.log${NC}"

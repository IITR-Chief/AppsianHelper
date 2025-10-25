#!/bin/bash

echo "🔷 Assignment 1: Basic Task Manager - Step by Step Testing"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check .NET
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ .NET 8 is not installed. Installing now...${NC}"
    brew install --cask dotnet-sdk
    echo -e "${YELLOW}Please restart terminal and run this script again after .NET installation${NC}"
    exit 1
else
    echo -e "${GREEN}✅ .NET $(dotnet --version) found${NC}"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"
fi

echo -e "${BLUE}Step 2: Cleaning up any existing processes...${NC}"
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
echo -e "${GREEN}✅ Ports cleaned${NC}"

echo -e "${BLUE}Step 3: Setting up Assignment 1 Backend...${NC}"
cd assignment1-basic-task-manager/backend

echo -e "${YELLOW}Installing backend dependencies...${NC}"
dotnet restore
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to restore .NET packages${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo -e "${YELLOW}Starting backend server on port 5000...${NC}"
dotnet run --urls="http://localhost:5000" &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

echo -e "${BLUE}Step 4: Waiting for backend to be ready...${NC}"
sleep 10

# Test backend API
echo -e "${YELLOW}Testing backend API...${NC}"
if curl -s "http://localhost:5000/api/tasks" > /dev/null; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${RED}❌ Backend API is not responding${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${BLUE}Step 5: Setting up Assignment 1 Frontend...${NC}"
cd ../frontend

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install npm packages${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

echo -e "${YELLOW}Starting frontend server on port 3000...${NC}"
BROWSER=none npm start &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo -e "${BLUE}Step 6: Waiting for frontend to be ready...${NC}"
sleep 15

# Test frontend
echo -e "${YELLOW}Testing frontend...${NC}"
if curl -s "http://localhost:3000" > /dev/null; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Assignment 1 is running successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Test URLs:${NC}"
echo -e "${YELLOW}• Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}• Backend API: http://localhost:5000/api/tasks${NC}"
echo -e "${YELLOW}• Swagger UI: http://localhost:5000/swagger${NC}"
echo ""
echo -e "${BLUE}🧪 Manual Test Steps:${NC}"
echo -e "${YELLOW}1. Open http://localhost:3000 in your browser${NC}"
echo -e "${YELLOW}2. Add a new task: 'Test Task 1'${NC}"
echo -e "${YELLOW}3. Mark it as completed${NC}"
echo -e "${YELLOW}4. Test the filter buttons (All/Active/Completed)${NC}"
echo -e "${YELLOW}5. Delete the task${NC}"
echo ""
echo -e "${BLUE}🔧 API Test Commands:${NC}"
echo -e "${YELLOW}# Get all tasks${NC}"
echo -e "curl http://localhost:5000/api/tasks"
echo ""
echo -e "${YELLOW}# Create a task${NC}"
echo -e 'curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '"'"'{"description":"API Test Task","isCompleted":false}'"'"''
echo ""

# Save PIDs for cleanup
echo "$BACKEND_PID $FRONTEND_PID" > ../assignment1_pids.txt

echo -e "${YELLOW}⚠️  To stop Assignment 1, run:${NC}"
echo -e "${BLUE}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo -e "${YELLOW}or use: ./stop-assignment1.sh${NC}"

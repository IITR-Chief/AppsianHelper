#!/bin/bash

echo "🚀 Testing All Three Assignments - Task Management Applications"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Port $port is already in use. Please stop the process or use a different port.${NC}"
        return 1
    else
        echo -e "${GREEN}Port $port is available.${NC}"
        return 0
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Waiting for $service_name to start...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}$service_name is ready!${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}$service_name failed to start within 60 seconds.${NC}"
    return 1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check .NET
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ .NET 8 is not installed. Please install from: https://dotnet.microsoft.com/download${NC}"
    exit 1
else
    echo -e "${GREEN}✅ .NET $(dotnet --version) found${NC}"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install from: https://nodejs.org/${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"
fi

# Check NPM
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not found${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm $(npm --version) found${NC}"
fi

echo ""

# Check if ports are available
echo -e "${BLUE}Checking port availability...${NC}"
check_port 5000 || exit 1
check_port 5001 || exit 1  
check_port 5002 || exit 1
check_port 3000 || exit 1

echo ""
echo -e "${GREEN}✅ All prerequisites met!${NC}"
echo ""

# Start Assignment 1
echo -e "${BLUE}🔷 Starting Assignment 1: Basic Task Manager${NC}"
echo "Backend: http://localhost:5000 | Frontend: http://localhost:3000"

cd assignment1-basic-task-manager/backend
echo -e "${YELLOW}Installing backend dependencies...${NC}"
dotnet restore > /dev/null 2>&1

echo -e "${YELLOW}Starting backend on port 5000...${NC}"
dotnet run --urls="http://localhost:5000" > /dev/null 2>&1 &
BACKEND1_PID=$!

cd ../frontend
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install > /dev/null 2>&1

# Wait for backend to be ready
wait_for_service "http://localhost:5000/api/tasks" "Assignment 1 Backend"

echo -e "${YELLOW}Starting frontend on port 3000...${NC}"
BROWSER=none npm start > /dev/null 2>&1 &
FRONTEND1_PID=$!

# Wait for frontend to be ready
wait_for_service "http://localhost:3000" "Assignment 1 Frontend"

echo -e "${GREEN}✅ Assignment 1 is running!${NC}"
echo -e "${BLUE}  Backend API: http://localhost:5000/api/tasks${NC}"
echo -e "${BLUE}  Swagger UI: http://localhost:5000/swagger${NC}"
echo -e "${BLUE}  Frontend: http://localhost:3000${NC}"
echo ""

# Test Assignment 1 API
echo -e "${YELLOW}Testing Assignment 1 API...${NC}"
if curl -s "http://localhost:5000/api/tasks" > /dev/null; then
    echo -e "${GREEN}✅ Assignment 1 API is responding${NC}"
else
    echo -e "${RED}❌ Assignment 1 API is not responding${NC}"
fi

cd ../../

# Start Assignment 2  
echo -e "${BLUE}🔷 Starting Assignment 2: Mini Project Manager${NC}"
echo "Backend: http://localhost:5001 | Frontend: http://localhost:3000"

cd assignment2-mini-project-manager/backend
echo -e "${YELLOW}Installing backend dependencies...${NC}"
dotnet restore > /dev/null 2>&1

echo -e "${YELLOW}Starting backend on port 5001...${NC}"
dotnet run --urls="http://localhost:5001" > /dev/null 2>&1 &
BACKEND2_PID=$!

cd ../frontend
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install > /dev/null 2>&1

# Wait for backend to be ready
wait_for_service "http://localhost:5001/api/projects" "Assignment 2 Backend"

# Kill Assignment 1 frontend to free port 3000
echo -e "${YELLOW}Switching frontend to Assignment 2...${NC}"
kill $FRONTEND1_PID 2>/dev/null || true
sleep 3

echo -e "${YELLOW}Starting Assignment 2 frontend on port 3000...${NC}"
BROWSER=none npm start > /dev/null 2>&1 &
FRONTEND2_PID=$!

# Wait for frontend to be ready
wait_for_service "http://localhost:3000" "Assignment 2 Frontend"

echo -e "${GREEN}✅ Assignment 2 is running!${NC}"
echo -e "${BLUE}  Backend API: http://localhost:5001/api${NC}"
echo -e "${BLUE}  Swagger UI: http://localhost:5001/swagger${NC}"
echo -e "${BLUE}  Frontend: http://localhost:3000${NC}"
echo ""

# Test Assignment 2 API
echo -e "${YELLOW}Testing Assignment 2 API...${NC}"
if curl -s "http://localhost:5001/api/projects" > /dev/null; then
    echo -e "${GREEN}✅ Assignment 2 API is responding${NC}"
else
    echo -e "${RED}❌ Assignment 2 API is not responding${NC}"
fi

cd ../../

# Start Assignment 3
echo -e "${BLUE}🔷 Starting Assignment 3: Smart Scheduler API${NC}"
echo "Backend: http://localhost:5002 | Frontend: http://localhost:3000"

cd assignment3-smart-scheduler-api/backend
echo -e "${YELLOW}Installing backend dependencies...${NC}"
dotnet restore > /dev/null 2>&1

echo -e "${YELLOW}Starting backend on port 5002...${NC}"
dotnet run --urls="http://localhost:5002" > /dev/null 2>&1 &
BACKEND3_PID=$!

cd ../frontend
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install > /dev/null 2>&1

# Wait for backend to be ready
wait_for_service "http://localhost:5002/api/projects" "Assignment 3 Backend"

# Kill Assignment 2 frontend to free port 3000
echo -e "${YELLOW}Switching frontend to Assignment 3...${NC}"
kill $FRONTEND2_PID 2>/dev/null || true
sleep 3

echo -e "${YELLOW}Starting Assignment 3 frontend on port 3000...${NC}"
BROWSER=none npm start > /dev/null 2>&1 &
FRONTEND3_PID=$!

# Wait for frontend to be ready  
wait_for_service "http://localhost:3000" "Assignment 3 Frontend"

echo -e "${GREEN}✅ Assignment 3 is running!${NC}"
echo -e "${BLUE}  Backend API: http://localhost:5002/api${NC}"
echo -e "${BLUE}  Swagger UI: http://localhost:5002/swagger${NC}"
echo -e "${BLUE}  Frontend: http://localhost:3000${NC}"
echo ""

# Test Assignment 3 API
echo -e "${YELLOW}Testing Assignment 3 API...${NC}"
if curl -s "http://localhost:5002/api/projects" > /dev/null; then
    echo -e "${GREEN}✅ Assignment 3 API is responding${NC}"
else
    echo -e "${RED}❌ Assignment 3 API is not responding${NC}"
fi

cd ../../

echo ""
echo -e "${GREEN}🎉 All assignments are now running!${NC}"
echo ""
echo -e "${BLUE}📊 Current Status:${NC}"
echo -e "${GREEN}✅ Assignment 1 Backend: http://localhost:5000${NC}"
echo -e "${GREEN}✅ Assignment 2 Backend: http://localhost:5001${NC}" 
echo -e "${GREEN}✅ Assignment 3 Backend: http://localhost:5002${NC}"
echo -e "${GREEN}✅ Assignment 3 Frontend: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}🔍 Testing URLs:${NC}"
echo -e "${BLUE}• Assignment 1 API: curl http://localhost:5000/api/tasks${NC}"
echo -e "${BLUE}• Assignment 2 API: curl http://localhost:5001/api/projects${NC}"
echo -e "${BLUE}• Assignment 3 API: curl http://localhost:5002/api/v1/projects/sample/schedule/sample${NC}"
echo ""
echo -e "${YELLOW}🌐 Web Interfaces:${NC}"
echo -e "${BLUE}• Current Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}• Swagger Assignment 1: http://localhost:5000/swagger${NC}"
echo -e "${BLUE}• Swagger Assignment 2: http://localhost:5001/swagger${NC}"
echo -e "${BLUE}• Swagger Assignment 3: http://localhost:5002/swagger${NC}"
echo ""

# Save PIDs for cleanup
echo "$BACKEND1_PID $BACKEND2_PID $BACKEND3_PID $FRONTEND3_PID" > .test_pids

echo -e "${YELLOW}⚠️  To stop all services, run: ./stop-all-services.sh${NC}"
echo -e "${YELLOW}💡 To switch between frontends, use the individual assignment scripts${NC}"
echo ""
echo -e "${GREEN}Ready for testing! 🚀${NC}"

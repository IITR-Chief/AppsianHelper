#!/bin/bash

echo "🔷 Assignment 2: Mini Project Manager - Testing Script"
echo "===================================================="

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

echo -e "${BLUE}Starting Assignment 2 Services...${NC}"

# Kill existing processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "ProjectManagerApi" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Start Backend
echo -e "${YELLOW}Starting backend with JWT authentication...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
dotnet run --urls="http://localhost:5001" > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 8

# Check backend
if check_service "http://localhost:5001/api/projects" "Backend API"; then
    echo -e "${BLUE}Backend API: http://localhost:5001/api${NC}"
    echo -e "${BLUE}Swagger UI: http://localhost:5001/swagger${NC}"
else
    echo -e "${RED}Backend failed to start. Check backend.log${NC}"
    exit 1
fi

# Start Frontend
echo -e "${YELLOW}Starting frontend with authentication...${NC}"
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
echo -e "${GREEN}🎉 Assignment 2 is running successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Service URLs:${NC}"
echo -e "${YELLOW}• Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}• Backend API: http://localhost:5001/api${NC}"
echo -e "${YELLOW}• Swagger UI: http://localhost:5001/swagger${NC}"
echo ""
echo -e "${BLUE}🧪 API Test Commands:${NC}"
echo -e "${YELLOW}# Register a user${NC}"
echo -e 'curl -X POST http://localhost:5001/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}"'
echo ""
echo -e "${YELLOW}# Login user${NC}"
echo -e 'curl -X POST http://localhost:5001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"'
echo ""
echo -e "${YELLOW}# Get projects (requires JWT token)${NC}"
echo -e 'curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5001/api/projects'
echo ""
echo -e "${YELLOW}# Create project (requires JWT token)${NC}"
echo -e 'curl -X POST http://localhost:5001/api/projects -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d "{\"title\":\"Test Project\",\"description\":\"A test project\"}"'
echo ""
echo -e "${BLUE}🎯 Manual Test Checklist:${NC}"
echo -e "${YELLOW}1. Open http://localhost:3000${NC}"
echo -e "${YELLOW}2. Register a new user${NC}"
echo -e "${YELLOW}3. Login with credentials${NC}"
echo -e "${YELLOW}4. Create a new project${NC}"
echo -e "${YELLOW}5. Add tasks to the project${NC}"
echo -e "${YELLOW}6. Mark tasks as completed${NC}"
echo -e "${YELLOW}7. Test logout and login again${NC}"
echo ""
echo -e "${BLUE}👤 Test User Credentials:${NC}"
echo -e "${YELLOW}Email: test@example.com${NC}"
echo -e "${YELLOW}Password: password123${NC}"
echo ""

# Save PIDs for cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .assignment2_pids

echo -e "${YELLOW}⚠️  To stop services, run: ./stop-assignment2.sh${NC}"
echo -e "${GREEN}Services are running in background. Check logs: backend.log, frontend.log${NC}"

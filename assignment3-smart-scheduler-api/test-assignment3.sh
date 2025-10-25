#!/bin/bash

echo "🔷 Assignment 3: Smart Scheduler API - Testing Script"
echo "==================================================="

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

echo -e "${BLUE}Starting Assignment 3 Services...${NC}"

# Kill existing processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
lsof -ti:5002 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "ProjectManagerApi" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Start Backend
echo -e "${YELLOW}Starting backend with smart scheduler...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
dotnet run --urls="http://localhost:5002" > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 8

# Check backend
if check_service "http://localhost:5002/api/projects" "Backend API"; then
    echo -e "${BLUE}Backend API: http://localhost:5002/api${NC}"
    echo -e "${BLUE}Swagger UI: http://localhost:5002/swagger${NC}"
    echo -e "${BLUE}Smart Scheduler: http://localhost:5002/api/v1/projects/{projectId}/schedule${NC}"
else
    echo -e "${RED}Backend failed to start. Check backend.log${NC}"
    exit 1
fi

# Start Frontend
echo -e "${YELLOW}Starting frontend with smart scheduler UI...${NC}"
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
echo -e "${GREEN}🎉 Assignment 3 is running successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Service URLs:${NC}"
echo -e "${YELLOW}• Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}• Backend API: http://localhost:5002/api${NC}"
echo -e "${YELLOW}• Swagger UI: http://localhost:5002/swagger${NC}"
echo ""
echo -e "${BLUE}🧪 Smart Scheduler API Test Commands:${NC}"
echo -e "${YELLOW}# Get sample schedule format${NC}"
echo -e 'curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5002/api/v1/projects/sample/schedule/sample'
echo ""
echo -e "${YELLOW}# Generate smart schedule (replace PROJECT_ID and JWT_TOKEN)${NC}"
echo 'curl -X POST http://localhost:5002/api/v1/projects/{PROJECT_ID}/schedule \'
echo '  -H "Content-Type: application/json" \'
echo '  -H "Authorization: Bearer YOUR_JWT_TOKEN" \'
echo '  -d '\''{'
echo '    "tasks": ['
echo '      {'
echo '        "title": "Design API",'
echo '        "estimatedHours": 5,'
echo '        "dueDate": "2025-10-26T00:00:00Z",'
echo '        "dependencies": []'
echo '      },'
echo '      {'
echo '        "title": "Implement Backend",'
echo '        "estimatedHours": 12,'
echo '        "dueDate": "2025-10-28T00:00:00Z",'
echo '        "dependencies": ["Design API"]'
echo '      }'
echo '    ]'
echo '  }'\'''
echo ""
echo -e "${BLUE}🎯 Manual Test Checklist:${NC}"
echo -e "${YELLOW}1. Open http://localhost:3000${NC}"
echo -e "${YELLOW}2. Register/Login user${NC}"
echo -e "${YELLOW}3. Create a project${NC}"
echo -e "${YELLOW}4. Open project details${NC}"
echo -e "${YELLOW}5. Click 'Smart Scheduler' button${NC}"
echo -e "${YELLOW}6. Load sample data${NC}"
echo -e "${YELLOW}7. Generate schedule${NC}"
echo -e "${YELLOW}8. Review recommended order and conflicts${NC}"
echo ""
echo -e "${BLUE}🤖 Smart Scheduler Features:${NC}"
echo -e "${YELLOW}• Dependency resolution with cycle detection${NC}"
echo -e "${YELLOW}• Topological sorting for optimal task ordering${NC}"
echo -e "${YELLOW}• Conflict detection for impossible deadlines${NC}"
echo -e "${YELLOW}• Priority calculation based on dependencies${NC}"
echo -e "${YELLOW}• Interactive UI with sample data${NC}"
echo ""

# Save PIDs for cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .assignment3_pids

echo -e "${YELLOW}⚠️  To stop services, run: ./stop-assignment3.sh${NC}"
echo -e "${GREEN}Services are running in background. Check logs: backend.log, frontend.log${NC}"

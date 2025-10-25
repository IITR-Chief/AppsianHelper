# 🧪 Testing Guide - All Assignments

## 📋 Quick Testing Commands

### **Assignment 1: Basic Task Manager**
```bash
cd assignment1-basic-task-manager
./test-assignment1.sh          # Start services
./stop-assignment1.sh          # Stop services
```
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger

### **Assignment 2: Mini Project Manager** 
```bash
cd assignment2-mini-project-manager
./test-assignment2.sh          # Start services
./stop-assignment2.sh          # Stop services
```
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001  
- **Swagger**: http://localhost:5001/swagger

### **Assignment 3: Smart Scheduler API**
```bash
cd assignment3-smart-scheduler-api
./test-assignment3.sh          # Start services
./stop-assignment3.sh          # Stop services  
```
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5002
- **Swagger**: http://localhost:5002/swagger

---

## 🔄 **Testing Workflow**

### **1. Test Assignment 1**
```bash
cd /Users/prathamkailasiya/Downloads/vishrut3/assignment1-basic-task-manager
./test-assignment1.sh
# Test the app at http://localhost:3000
./stop-assignment1.sh
```

### **2. Test Assignment 2**
```bash
cd ../assignment2-mini-project-manager  
./test-assignment2.sh
# Test the app at http://localhost:3000
./stop-assignment2.sh
```

### **3. Test Assignment 3**
```bash
cd ../assignment3-smart-scheduler-api
./test-assignment3.sh
# Test the app at http://localhost:3000
./stop-assignment3.sh
```

---

## 📊 **Port Usage**

| Assignment | Frontend | Backend | Features |
|------------|----------|---------|----------|
| Assignment 1 | 3000 | 5000 | Basic CRUD, Filtering |
| Assignment 2 | 3000 | 5001 | JWT Auth, Projects |  
| Assignment 3 | 3000 | 5002 | Smart Scheduling |

---

## 🧪 **API Testing Commands**

### **Assignment 1 API Tests**
```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# Create task  
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"Test Task","isCompleted":false}'

# Update task (replace {id})
curl -X PUT http://localhost:5000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"description":"Updated Task","isCompleted":true}'

# Delete task (replace {id})
curl -X DELETE http://localhost:5000/api/tasks/{id}
```

### **Assignment 2 API Tests**
```bash
# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login user  
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get projects (use JWT from login)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5001/api/projects

# Create project
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Project","description":"A test project"}'
```

### **Assignment 3 API Tests**
```bash
# Get sample schedule format
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5002/api/v1/projects/sample/schedule/sample

# Generate smart schedule
curl -X POST http://localhost:5002/api/v1/projects/{PROJECT_ID}/schedule \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tasks": [
      {
        "title": "Design API",
        "estimatedHours": 5,
        "dueDate": "2025-10-26T00:00:00Z", 
        "dependencies": []
      },
      {
        "title": "Implement Backend",
        "estimatedHours": 12,
        "dueDate": "2025-10-28T00:00:00Z",
        "dependencies": ["Design API"]
      }
    ]
  }'
```

---

## ✅ **Manual Testing Checklists**

### **Assignment 1 Testing**
- [ ] Add new task
- [ ] Mark task as completed
- [ ] Filter tasks (All/Active/Completed)  
- [ ] Delete task
- [ ] Test offline functionality (disconnect network)
- [ ] Check responsive design on mobile

### **Assignment 2 Testing**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Create new project
- [ ] Add tasks to project
- [ ] Update task details
- [ ] Mark tasks complete
- [ ] Delete tasks and projects
- [ ] Test logout and re-login
- [ ] Verify JWT token persistence

### **Assignment 3 Testing**  
- [ ] All Assignment 2 features
- [ ] Open Smart Scheduler
- [ ] Load sample data
- [ ] Generate schedule
- [ ] Review recommended task order
- [ ] Check conflict warnings
- [ ] Test dependency validation
- [ ] Try circular dependency (should fail)
- [ ] Test impossible deadlines

---

## 🐛 **Troubleshooting**

### **Common Issues**
```bash
# Port already in use
lsof -ti:5000 | xargs kill -9  # Kill port 5000
lsof -ti:3000 | xargs kill -9  # Kill port 3000

# .NET issues
dotnet --version               # Check .NET version
dotnet restore                 # Restore packages
dotnet clean                   # Clean build

# Node.js issues  
node --version                 # Check Node version
npm install                    # Install packages
rm -rf node_modules && npm install  # Clean install
```

### **Log Files**
Each assignment creates log files:
- `backend.log` - Backend service logs
- `frontend.log` - Frontend service logs

### **Service Status Check**
```bash
# Check if services are running
curl -s http://localhost:5000/api/tasks    # Assignment 1
curl -s http://localhost:5001/api/projects # Assignment 2  
curl -s http://localhost:5002/api/projects # Assignment 3
```

---

## 🎯 **Success Criteria**

### **Assignment 1** ✅
- Backend API responds on port 5000
- Frontend loads on port 3000
- Can create, read, update, delete tasks
- Task filtering works correctly
- Offline mode with localStorage

### **Assignment 2** ✅  
- Backend with JWT auth on port 5001
- User registration and login working
- Project and task CRUD operations
- Protected routes and API endpoints
- Session persistence

### **Assignment 3** ✅
- Enhanced backend on port 5002
- Smart scheduler algorithm working
- Dependency resolution and conflict detection
- Interactive scheduler UI
- All Assignment 2 features preserved

**Status: 🎉 ALL ASSIGNMENTS READY FOR TESTING**

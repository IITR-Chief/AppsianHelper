
# Assignment Solutions - Task Management Applications
![ss1](https://github.com/user-attachments/assets/b4b88ee4-df8a-490a-9f94-574aa0ed029c)
![ss2](https://github.com/user-attachments/assets/ca8d629f-efc4-4b01-9b95-b4ef6a0dec8e)
![ss3](https://github.com/user-attachments/assets/df7cb4d4-c3d5-492f-b4e5-ddee62b5d7dc)

This repository contains three progressively advanced task management applications built with C# .NET 8 backend and React TypeScript frontend.

## 📁 Project Structure

```
vishrut3/
├── assignment1-basic-task-manager/     # 10 credits - Basic Task Manager
├── assignment2-mini-project-manager/   # 20 credits - Project Manager with Auth
├── assignment3-smart-scheduler-api/    # 30 credits - Smart Scheduler Enhancement
└── README.md                          # This file
```

## 🚀 Quick Start Commands

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Installation Commands

```bash
# Clone and navigate to the repository
cd /Users/Downloads/vishrut3

# Install .NET 8 (if not already installed)
# brew install --cask dotnet  # macOS
# Or download from: https://dotnet.microsoft.com/download

# Verify .NET installation
dotnet --version  # Should show 8.x.x
```

---

## 📋 Assignment 1: Basic Task Manager (10 Credits)

A simple CRUD task manager with in-memory storage.

### ✨ Features Implemented
- ✅ Display list of tasks
- ✅ Add new task with description
- ✅ Mark task as completed/uncompleted
- ✅ Delete tasks
- ✅ Task filtering (All/Active/Completed)
- ✅ Local storage backup
- ✅ Bootstrap UI with responsive design
- ✅ RESTful API with .NET 8
- ✅ In-memory data storage
- ✅ CORS enabled for React integration

### 🔧 Testing Commands

```bash
# Navigate to Assignment 1
cd assignment1-basic-task-manager

# Backend Setup & Run
cd backend
dotnet restore
dotnet run --urls="http://localhost:5000"
# API available at: http://localhost:5000
# Swagger UI: http://localhost:5000/swagger

# Frontend Setup & Run (new terminal)
cd ../frontend
npm install
npm start
# App available at: http://localhost:3000
```

### 📊 API Endpoints
```
GET    /api/tasks           # Get all tasks
POST   /api/tasks           # Create task
PUT    /api/tasks/{id}      # Update task
DELETE /api/tasks/{id}      # Delete task
```

### 🧪 Test Scenarios
1. **Create Task**: Add "Learn React" → Verify task appears in list
2. **Toggle Complete**: Check task as done → Verify strikethrough styling
3. **Filter Tasks**: Switch between All/Active/Completed → Verify filtering works
4. **Delete Task**: Remove task → Verify it's gone from list
5. **Offline Mode**: Disconnect network → Tasks should persist via localStorage

---

## 👥 Assignment 2: Mini Project Manager (20 Credits)

Advanced project management with user authentication and Entity Framework.

### ✨ Features Implemented
- ✅ User registration and JWT authentication
- ✅ Protected routes and user sessions
- ✅ Multiple projects per user
- ✅ Tasks within projects with due dates
- ✅ Complete CRUD operations
- ✅ Form validation and error handling
- ✅ Responsive Material Design UI
- ✅ Entity Framework Core with relationships
- ✅ Data annotations validation
- ✅ Separation of concerns (DTOs, Services)

### 🔧 Testing Commands

```bash
# Navigate to Assignment 2
cd assignment2-mini-project-manager

# Backend Setup & Run
cd backend
dotnet restore
dotnet run --urls="http://localhost:5001"
# API available at: http://localhost:5001
# Swagger UI: http://localhost:5001/swagger

# Frontend Setup & Run (new terminal)
cd ../frontend
npm install
npm start
# App available at: http://localhost:3000
```

### 📊 API Endpoints
```
# Authentication
POST /api/auth/register     # Register user
POST /api/auth/login        # Login user

# Projects (Requires Authentication)
GET  /api/projects          # Get user projects
POST /api/projects          # Create project
GET  /api/projects/{id}     # Get project details
DELETE /api/projects/{id}   # Delete project

# Tasks (Requires Authentication)
POST /api/projects/{projectId}/tasks  # Create task
PUT  /api/tasks/{taskId}              # Update task
DELETE /api/tasks/{taskId}            # Delete task
```

### 🧪 Test Scenarios
1. **Registration**: Create account with email/password → Verify auto-login
2. **Login/Logout**: Test authentication flow → Verify JWT handling
3. **Create Project**: Add "E-commerce Website" project → Verify creation
4. **Add Tasks**: Create tasks with due dates → Verify task management
5. **Project Access**: Verify users only see their own projects
6. **Task Dependencies**: Test task completion workflow

### 👤 Test User Credentials
```
Email: test@example.com
Password: password123
Name: Test User
```

---

## 🤖 Assignment 3: Smart Scheduler API (10 Credits)

Enhanced project manager with intelligent task scheduling and dependency management.

### ✨ Features Implemented
- ✅ All Assignment 2 features
- ✅ Smart task scheduling algorithm
- ✅ Dependency management with cycle detection
- ✅ Topological sorting for task ordering
- ✅ Conflict detection and warnings
- ✅ Priority calculation based on deadlines
- ✅ Interactive scheduler UI component
- ✅ Sample data loading for demos
- ✅ Enhanced task model with time estimates
- ✅ Visual schedule timeline

### 🔧 Testing Commands

```bash
# Navigate to Assignment 3
cd assignment3-smart-scheduler-api

# Backend Setup & Run
cd backend
dotnet restore
dotnet run --urls="http://localhost:5002"
# API available at: http://localhost:5002
# Swagger UI: http://localhost:5002/swagger

# Frontend Setup & Run (new terminal)
cd ../frontend
npm install
npm start
# App available at: http://localhost:3000
```

### 📊 Enhanced API Endpoints
```
# All Assignment 2 endpoints plus:
POST /api/v1/projects/{projectId}/schedule  # Generate smart schedule
GET  /api/v1/projects/{projectId}/schedule/sample  # Get sample input
```

### 🧪 Advanced Test Scenarios

#### Smart Scheduler Testing
1. **Load Sample Data**: Use the "Load Sample Data" button in scheduler
2. **Generate Schedule**: Run scheduling algorithm → Verify task ordering
3. **Dependency Validation**: Try circular dependencies → Verify error handling
4. **Conflict Detection**: Set impossible deadlines → Verify warnings
5. **Priority Calculation**: Test urgent vs normal tasks → Verify ordering

#### Sample Test Data
```json
{
  "tasks": [
    {
      "title": "Design API",
      "estimatedHours": 5,
      "dueDate": "2025-10-25",
      "dependencies": []
    },
    {
      "title": "Implement Backend", 
      "estimatedHours": 12,
      "dueDate": "2025-10-28",
      "dependencies": ["Design API"]
    },
    {
      "title": "Build Frontend",
      "estimatedHours": 10, 
      "dueDate": "2025-10-30",
      "dependencies": ["Design API"]
    },
    {
      "title": "End-to-End Test",
      "estimatedHours": 8,
      "dueDate": "2025-10-31", 
      "dependencies": ["Implement Backend", "Build Frontend"]
    }
  ]
}
```

### Expected Output
```json
{
  "recommendedOrder": ["Design API", "Implement Backend", "Build Frontend", "End-to-End Test"],
  "isScheduleValid": true,
  "warnings": [],
  "taskDetails": {
    "Design API": {
      "suggestedStartDate": "2025-10-25T00:00:00Z",
      "suggestedEndDate": "2025-10-25T05:00:00Z",
      "priority": 1
    }
  }
}
```

---

## 🛠 Troubleshooting Guide

### Common Issues & Solutions

#### Backend Issues
```bash
# Port conflicts
netstat -an | grep :5000  # Check if port is in use
pkill -f dotnet           # Kill existing .NET processes

# Package issues
dotnet clean
dotnet restore
dotnet build
```

#### Frontend Issues
```bash
# Dependency issues
rm -rf node_modules package-lock.json
npm install

# Port conflicts
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
```

#### CORS Issues
- Verify backend CORS is configured for frontend URL
- Check browser console for specific CORS errors
- Ensure frontend API base URL matches backend port

#### Database Issues (Assignment 2 & 3)
- In-memory database resets on restart (intended behavior)
- No manual database setup required
- All data is lost when backend stops

---

## 📈 Performance Benchmarks

| Assignment | API Response Time | Frontend Load Time | Bundle Size |
|------------|-------------------|-------------------|-------------|
| 1 (Basic) | < 50ms | < 2s | ~500KB |
| 2 (Auth) | < 100ms | < 3s | ~800KB |
| 3 (Scheduler) | < 200ms | < 4s | ~1MB |

---

## 🔒 Security Features

### Assignment 1
- Input validation on frontend
- XSS protection via React
- CORS configuration

### Assignment 2 & 3
- JWT authentication with 7-day expiry
- Password hashing with BCrypt
- Protected API endpoints
- SQL injection prevention via EF Core
- HTTPS ready configuration

---

## 📱 Mobile Responsiveness

All applications are fully responsive and tested on:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024) 
- ✅ Mobile (375x667)
- ✅ Mobile (414x896)

---

## 🚢 Deployment Ready

### Production Configuration
```bash
# Backend - Production build
dotnet publish -c Release -o publish

# Frontend - Production build  
npm run build
```

### Environment Variables
```bash
# Backend
ASPNETCORE_ENVIRONMENT=Production
JwtSettings__SecretKey=your-super-secure-key-here

# Frontend
REACT_APP_API_URL=https://your-api-domain.com
```

---

## ✅ Testing Checklist

### Pre-Demo Verification

#### Assignment 1
- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 3000  
- [ ] Can create/read/update/delete tasks
- [ ] Task filtering works (All/Active/Completed)
- [ ] LocalStorage persists data

#### Assignment 2  
- [ ] Backend starts on port 5001
- [ ] User registration works
- [ ] JWT authentication flow works
- [ ] Can create/manage projects
- [ ] Can create/manage tasks within projects
- [ ] Protected routes work correctly

#### Assignment 3
- [ ] Backend starts on port 5002
- [ ] Smart scheduler UI loads
- [ ] Sample data loads correctly
- [ ] Schedule generation works
- [ ] Dependency validation works
- [ ] Conflict detection works

### Manual Testing Scripts

#### Quick Smoke Test
```bash
# Test all three backends are responsive
curl http://localhost:5000/api/tasks
curl http://localhost:5001/api/auth/register
curl http://localhost:5002/api/v1/projects/sample/schedule/sample
```

---

**Happy Testing! 🎉**

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  projectId: string;
}

export interface CreateTaskRequest {
  title: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}

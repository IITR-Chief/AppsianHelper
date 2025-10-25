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
  estimatedHours: number;
  suggestedStartDate?: string;
  suggestedEndDate?: string;
  priority: number;
  dependencies: Task[];
}

export interface CreateTaskRequest {
  title: string;
  dueDate?: string;
  estimatedHours?: number;
  dependencyIds?: string[];
}

export interface UpdateTaskRequest {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  estimatedHours: number;
  dependencyIds?: string[];
}

export interface ScheduleTaskInput {
  title: string;
  estimatedHours: number;
  dueDate: string;
  dependencies: string[];
}

export interface ScheduleRequest {
  tasks: ScheduleTaskInput[];
}

export interface ScheduledTaskDetails {
  title: string;
  suggestedStartDate: string;
  suggestedEndDate: string;
  dueDate: string;
  estimatedHours: number;
  dependencies: string[];
  priority: number;
  hasConflict: boolean;
}

export interface ScheduleResponse {
  recommendedOrder: string[];
  taskDetails: Record<string, ScheduledTaskDetails>;
  warnings: string[];
  isScheduleValid: boolean;
}

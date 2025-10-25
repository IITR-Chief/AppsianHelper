import axios from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Project, 
  CreateProjectRequest, 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  ScheduleRequest,
  ScheduleResponse
} from '../types';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }
}

export class ProjectService {
  static async getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  }

  static async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  }

  static async createProject(project: CreateProjectRequest): Promise<Project> {
    const response = await api.post<Project>('/projects', project);
    return response.data;
  }

  static async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  }

  static async createTask(projectId: string, task: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, task);
    return response.data;
  }

  static async updateTask(taskId: string, task: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${taskId}`, task);
    return response.data;
  }

  static async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  }

  static async generateSchedule(projectId: string, request: ScheduleRequest): Promise<ScheduleResponse> {
    const response = await api.post<ScheduleResponse>(`/v1/projects/${projectId}/schedule`, request);
    return response.data;
  }

  static async getSampleScheduleInput(): Promise<any> {
    const response = await api.get(`/v1/projects/sample/schedule/sample`);
    return response.data;
  }
}

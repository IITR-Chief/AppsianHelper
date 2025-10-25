import axios from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/Task';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  }

  static async getTaskById(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  }

  static async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  }

  static async updateTask(id: string, task: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  }

  static async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
}

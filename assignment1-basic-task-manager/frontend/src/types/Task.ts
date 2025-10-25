export interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface CreateTaskRequest {
  description: string;
  isCompleted?: boolean;
}

export interface UpdateTaskRequest {
  description: string;
  isCompleted: boolean;
}

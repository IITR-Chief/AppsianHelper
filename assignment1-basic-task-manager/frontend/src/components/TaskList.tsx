import React from 'react';
import { ListGroup, Button, Form } from 'react-bootstrap';
import { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string, isCompleted: boolean) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  filter: 'all' | 'active' | 'completed';
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onDeleteTask, 
  filter 
}) => {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <p>No tasks found.</p>
      </div>
    );
  }

  return (
    <ListGroup>
      {filteredTasks.map((task) => (
        <ListGroup.Item
          key={task.id}
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={task.isCompleted}
              onChange={(e) => onToggleComplete(task.id, e.target.checked)}
              className="me-3"
            />
            <span
              className={task.isCompleted ? 'text-decoration-line-through text-muted' : ''}
            >
              {task.description}
            </span>
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDeleteTask(task.id)}
          >
            Delete
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TaskList;

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

interface TaskFormProps {
  onSubmit: (description: string) => Promise<void>;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading = false }) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Task description is required');
      return;
    }

    try {
      setError(null);
      await onSubmit(description.trim());
      setDescription('');
    } catch (err) {
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>New Task</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter task description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Button variant="primary" type="submit" disabled={isLoading || !description.trim()}>
        {isLoading ? 'Adding...' : 'Add Task'}
      </Button>
    </Form>
  );
};

export default TaskForm;

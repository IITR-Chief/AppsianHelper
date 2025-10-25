import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import { TaskService } from './services/TaskService';
import { Task } from './types/Task';
import { useLocalStorage } from './hooks/useLocalStorage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useLocalStorage<'all' | 'active' | 'completed'>('taskFilter', 'all');

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const fetchedTasks = await TaskService.getAllTasks();
      setTasks(fetchedTasks);
      
      // Save to localStorage as backup
      localStorage.setItem('tasks', JSON.stringify(fetchedTasks));
    } catch (err) {
      console.error('Failed to load tasks:', err);
      
      // Try to load from localStorage as fallback
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
        setError('Using offline data. Check your connection.');
      } else {
        setError('Failed to load tasks. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (description: string) => {
    try {
      const newTask = await TaskService.createTask({ description, isCompleted: false });
      setTasks(prev => [...prev, newTask]);
      
      // Update localStorage
      const updatedTasks = [...tasks, newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (err) {
      throw new Error('Failed to create task');
    }
  };

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === id);
      if (!taskToUpdate) return;

      const updatedTask = await TaskService.updateTask(id, {
        description: taskToUpdate.description,
        isCompleted
      });

      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));

      // Update localStorage
      const updatedTasks = tasks.map(task => 
        task.id === id ? updatedTask : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await TaskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      
      // Update localStorage
      const updatedTasks = tasks.filter(task => task.id !== id);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.isCompleted).length,
    completed: tasks.filter(t => t.isCompleted).length
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center mb-4">Task Manager</h1>
          
          {error && (
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <TaskForm onSubmit={handleCreateTask} />
          
          <TaskFilter
            activeFilter={filter}
            onFilterChange={setFilter}
            taskCounts={taskCounts}
          />
          
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            filter={filter}
          />
          
          {tasks.length > 0 && (
            <div className="mt-3 text-center text-muted">
              <small>
                {taskCounts.active} active, {taskCounts.completed} completed
              </small>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;

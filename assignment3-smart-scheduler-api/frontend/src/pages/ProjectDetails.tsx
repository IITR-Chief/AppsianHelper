import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Form, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { Project, Task, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { ProjectService } from '../services/api';
import SmartScheduler from '../components/SmartScheduler';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskLoading, setTaskLoading] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    title: '',
    dueDate: '',
    estimatedHours: 1
  });
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      setError(null);
      const fetchedProject = await ProjectService.getProject(projectId);
      setProject(fetchedProject);
    } catch (err: any) {
      setError('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim() || !id) {
      setError('Task title is required');
      return;
    }

    setTaskLoading(true);
    setError(null);

    try {
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate || undefined
      };
      
      const createdTask = await ProjectService.createTask(id, taskData);
      
      if (project) {
        setProject({
          ...project,
          tasks: [...project.tasks, createdTask]
        });
      }
      
      setShowCreateTaskModal(false);
      setNewTask({ title: '', dueDate: '', estimatedHours: 1 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setTaskLoading(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTask) return;

    setTaskLoading(true);
    setError(null);

    try {
      const updatedTask = await ProjectService.updateTask(editingTask.id, {
        title: editingTask.title,
        dueDate: editingTask.dueDate || undefined,
        isCompleted: editingTask.isCompleted,
        estimatedHours: editingTask.estimatedHours || 1
      });
      
      if (project) {
        setProject({
          ...project,
          tasks: project.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        });
      }
      
      setEditingTask(null);
    } catch (err: any) {
      setError('Failed to update task');
    } finally {
      setTaskLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await ProjectService.deleteTask(taskId);
      
      if (project) {
        setProject({
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        });
      }
    } catch (err: any) {
      setError('Failed to delete task');
    }
  };

  const handleToggleTaskCompletion = async (task: Task) => {
    try {
      const updatedTask = await ProjectService.updateTask(task.id, {
        title: task.title,
        dueDate: task.dueDate,
        isCompleted: !task.isCompleted,
        estimatedHours: task.estimatedHours || 1
      });
      
      if (project) {
        setProject({
          ...project,
          tasks: project.tasks.map(t => 
            t.id === updatedTask.id ? updatedTask : t
          )
        });
      }
    } catch (err: any) {
      setError('Failed to update task');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Alert variant="danger">
          Project not found. <Link to="/dashboard">Return to dashboard</Link>
        </Alert>
      </Container>
    );
  }

  const activeTasks = project.tasks.filter(t => !t.isCompleted);
  const completedTasks = project.tasks.filter(t => t.isCompleted);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/dashboard" className="text-decoration-none mb-2 d-inline-block">
            ← Back to Dashboard
          </Link>
          <h1>{project.title}</h1>
          {project.description && <p className="text-muted">{project.description}</p>}
          <p className="text-muted">
            <small>Created: {formatDate(project.createdAt)}</small>
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => setShowCreateTaskModal(true)}>
            Add New Task
          </Button>
          <Button variant="info" onClick={() => setShowScheduler(true)}>
            🤖 Smart Scheduler
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <div className="mb-4">
        <h3>
          Tasks 
          <Badge bg="primary" className="ms-2">{activeTasks.length} active</Badge>
          <Badge bg="success" className="ms-1">{completedTasks.length} completed</Badge>
        </h3>
      </div>

      {project.tasks.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h4>No Tasks Yet</h4>
            <p className="text-muted">Add your first task to get started!</p>
            <Button variant="primary" onClick={() => setShowCreateTaskModal(true)}>
              Add Task
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          {activeTasks.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5>Active Tasks</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {activeTasks.map((task) => (
                  <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleToggleTaskCompletion(task)}
                        className="me-3"
                      />
                      <div>
                        <div>{task.title}</div>
                        {task.dueDate && (
                          <small className="text-muted">Due: {formatDate(task.dueDate)}</small>
                        )}
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setEditingTask(task)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}

          {completedTasks.length > 0 && (
            <Card>
              <Card.Header>
                <h5>Completed Tasks</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {completedTasks.map((task) => (
                  <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleToggleTaskCompletion(task)}
                        className="me-3"
                      />
                      <div>
                        <div className="text-decoration-line-through text-muted">{task.title}</div>
                        {task.dueDate && (
                          <small className="text-muted">Due: {formatDate(task.dueDate)}</small>
                        )}
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setEditingTask(task)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
        </>
      )}

      {/* Create Task Modal */}
      <Modal show={showCreateTaskModal} onHide={() => setShowCreateTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateTask}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Task Title *</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                disabled={taskLoading}
                maxLength={200}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estimated Hours</Form.Label>
              <Form.Control
                type="number"
                min="0.1"
                step="0.5"
                value={newTask.estimatedHours}
                onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseFloat(e.target.value) || 1 })}
                disabled={taskLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                disabled={taskLoading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateTaskModal(false)} disabled={taskLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={taskLoading}>
              {taskLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal show={!!editingTask} onHide={() => setEditingTask(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateTask}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Task Title *</Form.Label>
              <Form.Control
                type="text"
                value={editingTask?.title || ''}
                onChange={(e) => setEditingTask(editingTask ? { ...editingTask, title: e.target.value } : null)}
                required
                disabled={taskLoading}
                maxLength={200}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estimated Hours</Form.Label>
              <Form.Control
                type="number"
                min="0.1"
                step="0.5"
                value={editingTask?.estimatedHours || 1}
                onChange={(e) => setEditingTask(editingTask ? { ...editingTask, estimatedHours: parseFloat(e.target.value) || 1 } : null)}
                disabled={taskLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={editingTask?.dueDate?.split('T')[0] || ''}
                onChange={(e) => setEditingTask(editingTask ? { ...editingTask, dueDate: e.target.value } : null)}
                disabled={taskLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Mark as completed"
                checked={editingTask?.isCompleted || false}
                onChange={(e) => setEditingTask(editingTask ? { ...editingTask, isCompleted: e.target.checked } : null)}
                disabled={taskLoading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingTask(null)} disabled={taskLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={taskLoading}>
              {taskLoading ? 'Updating...' : 'Update Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Smart Scheduler Modal */}
      <SmartScheduler 
        show={showScheduler}
        onHide={() => setShowScheduler(false)}
        projectId={id || ''}
      />
    </Container>
  );
};

export default ProjectDetails;

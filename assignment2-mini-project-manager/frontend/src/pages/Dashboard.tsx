import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Project, CreateProjectRequest } from '../types';
import { ProjectService } from '../services/api';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newProject, setNewProject] = useState<CreateProjectRequest>({
    title: '',
    description: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setError(null);
      const fetchedProjects = await ProjectService.getProjects();
      setProjects(fetchedProjects);
    } catch (err: any) {
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.title.trim()) {
      setError('Project title is required');
      return;
    }

    setCreateLoading(true);
    setError(null);

    try {
      const createdProject = await ProjectService.createProject(newProject);
      setProjects(prev => [createdProject, ...prev]);
      setShowCreateModal(false);
      setNewProject({ title: '', description: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await ProjectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err: any) {
      setError('Failed to delete project');
    }
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

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Projects</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create New Project
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {projects.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h3>No Projects Yet</h3>
            <p className="text-muted">Create your first project to get started!</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Project
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {projects.map((project) => (
            <Col md={6} lg={4} key={project.id} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {project.description || 'No description provided'}
                  </Card.Text>
                  <div className="mt-auto">
                    <p className="text-muted mb-2">
                      <small>{project.tasks.length} task(s)</small>
                    </p>
                    <div className="d-flex gap-2">
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Project Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateProject}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Title *</Form.Label>
              <Form.Control
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                required
                disabled={createLoading}
                maxLength={100}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                disabled={createLoading}
                maxLength={500}
              />
              <Form.Text className="text-muted">
                Optional, max 500 characters
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={createLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Dashboard;

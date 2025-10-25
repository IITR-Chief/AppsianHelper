import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner, Card, Badge, ListGroup } from 'react-bootstrap';
import { ProjectService } from '../services/api';
import { ScheduleRequest, ScheduleResponse, ScheduleTaskInput } from '../types';

interface SmartSchedulerProps {
  show: boolean;
  onHide: () => void;
  projectId: string;
}

const SmartScheduler: React.FC<SmartSchedulerProps> = ({ show, onHide, projectId }) => {
  const [tasks, setTasks] = useState<ScheduleTaskInput[]>([
    {
      title: '',
      estimatedHours: 1,
      dueDate: '',
      dependencies: []
    }
  ]);
  const [scheduleResult, setScheduleResult] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTask = () => {
    setTasks([...tasks, {
      title: '',
      estimatedHours: 1,
      dueDate: '',
      dependencies: []
    }]);
  };

  const updateTask = (index: number, field: keyof ScheduleTaskInput, value: any) => {
    const updatedTasks = [...tasks];
    if (field === 'dependencies') {
      updatedTasks[index].dependencies = value.split(',').map((dep: string) => dep.trim()).filter((dep: string) => dep);
    } else if (field === 'title') {
      updatedTasks[index].title = value;
    } else if (field === 'estimatedHours') {
      updatedTasks[index].estimatedHours = value;
    } else if (field === 'dueDate') {
      updatedTasks[index].dueDate = value;
    }
    setTasks(updatedTasks);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const generateSchedule = async () => {
    const validTasks = tasks.filter(task => task.title.trim() && task.dueDate);
    
    if (validTasks.length === 0) {
      setError('Please add at least one task with a title and due date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: ScheduleRequest = { tasks: validTasks };
      const result = await ProjectService.generateSchedule(projectId, request);
      setScheduleResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const sampleTasks: ScheduleTaskInput[] = [
      {
        title: 'Design API',
        estimatedHours: 5,
        dueDate: new Date(tomorrow.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: []
      },
      {
        title: 'Implement Backend',
        estimatedHours: 12,
        dueDate: new Date(tomorrow.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['Design API']
      },
      {
        title: 'Build Frontend',
        estimatedHours: 10,
        dueDate: new Date(tomorrow.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['Design API']
      },
      {
        title: 'End-to-End Test',
        estimatedHours: 8,
        dueDate: new Date(tomorrow.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['Implement Backend', 'Build Frontend']
      }
    ];
    
    setTasks(sampleTasks);
  };

  const reset = () => {
    setTasks([{
      title: '',
      estimatedHours: 1,
      dueDate: '',
      dependencies: []
    }]);
    setScheduleResult(null);
    setError(null);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Smart Task Scheduler</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="mb-3">
          <Button variant="outline-secondary" onClick={loadSampleData} className="me-2">
            Load Sample Data
          </Button>
          <Button variant="outline-warning" onClick={reset}>
            Reset
          </Button>
        </div>

        {!scheduleResult ? (
          <>
            <h5>Add Tasks to Schedule</h5>
            {tasks.map((task, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6>Task #{index + 1}</h6>
                    {tasks.length > 1 && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeTask(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <Form.Group className="mb-2">
                    <Form.Label>Task Title *</Form.Label>
                    <Form.Control
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(index, 'title', e.target.value)}
                      placeholder="Enter task title"
                    />
                  </Form.Group>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-2">
                        <Form.Label>Estimated Hours *</Form.Label>
                        <Form.Control
                          type="number"
                          min="0.1"
                          step="0.5"
                          value={task.estimatedHours}
                          onChange={(e) => updateTask(index, 'estimatedHours', parseFloat(e.target.value) || 1)}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-2">
                        <Form.Label>Due Date *</Form.Label>
                        <Form.Control
                          type="date"
                          value={task.dueDate}
                          onChange={(e) => updateTask(index, 'dueDate', e.target.value)}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  
                  <Form.Group className="mb-2">
                    <Form.Label>Dependencies</Form.Label>
                    <Form.Control
                      type="text"
                      value={task.dependencies.join(', ')}
                      onChange={(e) => updateTask(index, 'dependencies', e.target.value)}
                      placeholder="Enter task titles that this task depends on (comma-separated)"
                    />
                    <Form.Text className="text-muted">
                      List other task titles that must be completed before this task can start
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
            ))}
            
            <div className="d-flex justify-content-between">
              <Button variant="outline-primary" onClick={addTask}>
                Add Another Task
              </Button>
              <Button 
                variant="primary" 
                onClick={generateSchedule}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Generating Schedule...
                  </>
                ) : (
                  'Generate Smart Schedule'
                )}
              </Button>
            </div>
          </>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Schedule Results</h5>
              <Button variant="outline-secondary" onClick={() => setScheduleResult(null)}>
                Modify Tasks
              </Button>
            </div>
            
            {scheduleResult.warnings.length > 0 && (
              <Alert variant="warning">
                <Alert.Heading>Warnings:</Alert.Heading>
                <ul className="mb-0">
                  {scheduleResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </Alert>
            )}
            
            <Card className={`mb-3 border-${scheduleResult.isScheduleValid ? 'success' : 'danger'}`}>
              <Card.Header>
                <h6>
                  Schedule Status: 
                  <Badge bg={scheduleResult.isScheduleValid ? 'success' : 'danger'} className="ms-2">
                    {scheduleResult.isScheduleValid ? 'Valid' : 'Has Conflicts'}
                  </Badge>
                </h6>
              </Card.Header>
              <Card.Body>
                <h6>Recommended Order:</h6>
                <ListGroup variant="flush">
                  {scheduleResult.recommendedOrder.map((taskTitle, index) => {
                    const taskDetails = scheduleResult.taskDetails[taskTitle];
                    return (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{index + 1}. {taskTitle}</strong>
                          <div className="text-muted small">
                            Start: {new Date(taskDetails.suggestedStartDate).toLocaleDateString()} | 
                            End: {new Date(taskDetails.suggestedEndDate).toLocaleDateString()} | 
                            Due: {new Date(taskDetails.dueDate).toLocaleDateString()} |
                            Hours: {taskDetails.estimatedHours}
                          </div>
                          {taskDetails.dependencies.length > 0 && (
                            <div className="text-muted small">
                              Depends on: {taskDetails.dependencies.join(', ')}
                            </div>
                          )}
                        </div>
                        <div>
                          <Badge bg="info" className="me-1">Priority: {taskDetails.priority}</Badge>
                          {taskDetails.hasConflict && (
                            <Badge bg="danger">Conflict!</Badge>
                          )}
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SmartScheduler;

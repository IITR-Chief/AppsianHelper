import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

interface TaskFilterProps {
  activeFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

const TaskFilter: React.FC<TaskFilterProps> = ({ 
  activeFilter, 
  onFilterChange, 
  taskCounts 
}) => {
  return (
    <div className="mb-3">
      <ButtonGroup>
        <Button
          variant={activeFilter === 'all' ? 'primary' : 'outline-primary'}
          onClick={() => onFilterChange('all')}
        >
          All ({taskCounts.all})
        </Button>
        <Button
          variant={activeFilter === 'active' ? 'primary' : 'outline-primary'}
          onClick={() => onFilterChange('active')}
        >
          Active ({taskCounts.active})
        </Button>
        <Button
          variant={activeFilter === 'completed' ? 'primary' : 'outline-primary'}
          onClick={() => onFilterChange('completed')}
        >
          Completed ({taskCounts.completed})
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default TaskFilter;

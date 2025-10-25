using System.ComponentModel.DataAnnotations;

namespace ProjectManagerApi.DTOs
{
    public class CreateProjectRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class ProjectDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TaskDto> Tasks { get; set; } = new();
    }

    public class CreateTaskRequest
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;
        
        public DateTime? DueDate { get; set; }
        
        [Range(0.1, 1000)]
        public double EstimatedHours { get; set; } = 1.0;
        
        public List<Guid> DependencyIds { get; set; } = new();
    }

    public class UpdateTaskRequest
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;
        
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        
        [Range(0.1, 1000)]
        public double EstimatedHours { get; set; }
        
        public List<Guid> DependencyIds { get; set; } = new();
    }

    public class TaskDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ProjectId { get; set; }
        public double EstimatedHours { get; set; }
        public DateTime? SuggestedStartDate { get; set; }
        public DateTime? SuggestedEndDate { get; set; }
        public int Priority { get; set; }
        public List<TaskDto> Dependencies { get; set; } = new();
    }
}

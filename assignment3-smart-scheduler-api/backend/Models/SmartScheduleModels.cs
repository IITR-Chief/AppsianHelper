using System.ComponentModel.DataAnnotations;

namespace ProjectManagerApi.Models
{
    public class ScheduleTaskInput
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [Range(0.5, 1000)]
        public double EstimatedHours { get; set; }
        
        [Required]
        public DateTime DueDate { get; set; }
        
        public List<string> Dependencies { get; set; } = new();
    }

    public class ScheduleRequest
    {
        [Required]
        [MinLength(1)]
        public List<ScheduleTaskInput> Tasks { get; set; } = new();
    }

    public class ScheduleResponse
    {
        public List<string> RecommendedOrder { get; set; } = new();
        public Dictionary<string, ScheduledTaskDetails> TaskDetails { get; set; } = new();
        public List<string> Warnings { get; set; } = new();
        public bool IsScheduleValid { get; set; }
    }

    public class ScheduledTaskDetails
    {
        public string Title { get; set; } = string.Empty;
        public DateTime SuggestedStartDate { get; set; }
        public DateTime SuggestedEndDate { get; set; }
        public DateTime DueDate { get; set; }
        public double EstimatedHours { get; set; }
        public List<string> Dependencies { get; set; } = new();
        public int Priority { get; set; }
        public bool HasConflict { get; set; }
    }

    public class TaskDependency
    {
        public Guid Id { get; set; }
        public Guid TaskId { get; set; }
        public ProjectTask Task { get; set; } = null!;
        public Guid DependsOnTaskId { get; set; }
        public ProjectTask DependsOnTask { get; set; } = null!;
    }
}

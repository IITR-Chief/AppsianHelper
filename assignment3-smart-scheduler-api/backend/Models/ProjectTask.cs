using System.ComponentModel.DataAnnotations;

namespace ProjectManagerApi.Models
{
    public class ProjectTask
    {
        public Guid Id { get; set; }
        
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;
        
        public DateTime? DueDate { get; set; }
        
        public bool IsCompleted { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public double EstimatedHours { get; set; }
        
        public DateTime? SuggestedStartDate { get; set; }
        
        public DateTime? SuggestedEndDate { get; set; }
        
        public int Priority { get; set; }
        
        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;
        
        public ICollection<TaskDependency> Dependencies { get; set; } = new List<TaskDependency>();
        public ICollection<TaskDependency> DependentTasks { get; set; } = new List<TaskDependency>();
    }
}

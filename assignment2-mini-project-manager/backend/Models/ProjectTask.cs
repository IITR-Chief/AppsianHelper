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
        
        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }
}

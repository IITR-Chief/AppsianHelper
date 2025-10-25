using Microsoft.EntityFrameworkCore;
using ProjectManagerApi.Data;
using ProjectManagerApi.Models;
using ProjectManagerApi.DTOs;

namespace ProjectManagerApi.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(Guid userId);
        Task<ProjectDto?> GetProjectByIdAsync(Guid projectId, Guid userId);
        Task<ProjectDto> CreateProjectAsync(CreateProjectRequest request, Guid userId);
        Task<bool> DeleteProjectAsync(Guid projectId, Guid userId);
        Task<TaskDto> CreateTaskAsync(Guid projectId, CreateTaskRequest request, Guid userId);
        Task<TaskDto?> UpdateTaskAsync(Guid taskId, UpdateTaskRequest request, Guid userId);
        Task<bool> DeleteTaskAsync(Guid taskId, Guid userId);
    }

    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;

        public ProjectService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(Guid userId)
        {
            var projects = await _context.Projects
                .Where(p => p.UserId == userId)
                .Include(p => p.Tasks)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return projects.Select(MapToProjectDto);
        }

        public async Task<ProjectDto?> GetProjectByIdAsync(Guid projectId, Guid userId)
        {
            var project = await _context.Projects
                .Where(p => p.Id == projectId && p.UserId == userId)
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync();

            return project != null ? MapToProjectDto(project) : null;
        }

        public async Task<ProjectDto> CreateProjectAsync(CreateProjectRequest request, Guid userId)
        {
            var project = new Project
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return MapToProjectDto(project);
        }

        public async Task<bool> DeleteProjectAsync(Guid projectId, Guid userId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TaskDto> CreateTaskAsync(Guid projectId, CreateTaskRequest request, Guid userId)
        {
            // Verify project ownership
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
                throw new UnauthorizedAccessException("Project not found or access denied");

            var task = new ProjectTask
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                DueDate = request.DueDate,
                ProjectId = projectId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToTaskDto(task);
        }

        public async Task<TaskDto?> UpdateTaskAsync(Guid taskId, UpdateTaskRequest request, Guid userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null) return null;

            task.Title = request.Title;
            task.DueDate = request.DueDate;
            task.IsCompleted = request.IsCompleted;

            await _context.SaveChangesAsync();
            return MapToTaskDto(task);
        }

        public async Task<bool> DeleteTaskAsync(Guid taskId, Guid userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        private static ProjectDto MapToProjectDto(Project project)
        {
            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                Tasks = project.Tasks?.Select(MapToTaskDto).ToList() ?? new List<TaskDto>()
            };
        }

        private static TaskDto MapToTaskDto(ProjectTask task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                ProjectId = task.ProjectId
            };
        }
    }
}

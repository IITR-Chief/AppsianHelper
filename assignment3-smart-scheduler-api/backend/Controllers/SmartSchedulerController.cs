using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ProjectManagerApi.Models;
using ProjectManagerApi.Services;

namespace ProjectManagerApi.Controllers
{
    [ApiController]
    [Route("api/v1/projects/{projectId}/[controller]")]
    [Authorize]
    public class ScheduleController : ControllerBase
    {
        private readonly ISmartSchedulerService _schedulerService;
        private readonly IProjectService _projectService;

        public ScheduleController(ISmartSchedulerService schedulerService, IProjectService projectService)
        {
            _schedulerService = schedulerService;
            _projectService = projectService;
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }
            return userId;
        }

        /// <summary>
        /// Generate an intelligent schedule for tasks within a project
        /// </summary>
        /// <param name="projectId">The project ID</param>
        /// <param name="request">Schedule request containing tasks with dependencies</param>
        /// <returns>Recommended task order and scheduling details</returns>
        [HttpPost]
        public async Task<ActionResult<ScheduleResponse>> GenerateSchedule(Guid projectId, ScheduleRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = GetCurrentUserId();
                
                // Verify project ownership
                var project = await _projectService.GetProjectByIdAsync(projectId, userId);
                if (project == null)
                {
                    return NotFound(new { message = "Project not found or access denied" });
                }

                var scheduleResponse = await _schedulerService.GenerateSmartScheduleAsync(projectId, request, userId);
                
                return Ok(scheduleResponse);
            }
            catch (UnauthorizedAccessException)
            {
                return NotFound(new { message = "Project not found or access denied" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while generating the schedule", error = ex.Message });
            }
        }

        /// <summary>
        /// Get sample input format for the smart scheduler
        /// </summary>
        [HttpGet("sample")]
        public ActionResult<object> GetSampleInput()
        {
            var sample = new
            {
                tasks = new[]
                {
                    new
                    {
                        title = "Design API",
                        estimatedHours = 5.0,
                        dueDate = "2025-10-25T00:00:00Z",
                        dependencies = new string[] { }
                    },
                    new
                    {
                        title = "Implement Backend",
                        estimatedHours = 12.0,
                        dueDate = "2025-10-28T00:00:00Z",
                        dependencies = new[] { "Design API" }
                    },
                    new
                    {
                        title = "Build Frontend",
                        estimatedHours = 10.0,
                        dueDate = "2025-10-30T00:00:00Z",
                        dependencies = new[] { "Design API" }
                    },
                    new
                    {
                        title = "End-to-End Test",
                        estimatedHours = 8.0,
                        dueDate = "2025-10-31T00:00:00Z",
                        dependencies = new[] { "Implement Backend", "Build Frontend" }
                    }
                }
            };

            return Ok(sample);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ProjectManagerApi.DTOs;
using ProjectManagerApi.Services;

namespace ProjectManagerApi.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public TasksController(IProjectService projectService)
        {
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

        [HttpPut("{taskId}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(Guid taskId, UpdateTaskRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();
            var task = await _projectService.UpdateTaskAsync(taskId, request, userId);
            
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(Guid taskId)
        {
            var userId = GetCurrentUserId();
            var deleted = await _projectService.DeleteTaskAsync(taskId, userId);
            
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}

using TaskManagerApi.Models;
using System.Collections.Concurrent;

namespace TaskManagerApi.Services
{
    public class InMemoryTaskService : ITaskService
    {
        private readonly ConcurrentDictionary<Guid, TaskItem> _tasks = new();

        public Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            return Task.FromResult(_tasks.Values.AsEnumerable());
        }

        public Task<TaskItem?> GetTaskByIdAsync(Guid id)
        {
            _tasks.TryGetValue(id, out var task);
            return Task.FromResult(task);
        }

        public Task<TaskItem> CreateTaskAsync(TaskItem task)
        {
            task.Id = Guid.NewGuid();
            _tasks[task.Id] = task;
            return Task.FromResult(task);
        }

        public Task<TaskItem?> UpdateTaskAsync(Guid id, TaskItem task)
        {
            if (_tasks.TryGetValue(id, out var existingTask))
            {
                existingTask.Description = task.Description;
                existingTask.IsCompleted = task.IsCompleted;
                return Task.FromResult<TaskItem?>(existingTask);
            }
            return Task.FromResult<TaskItem?>(null);
        }

        public Task<bool> DeleteTaskAsync(Guid id)
        {
            return Task.FromResult(_tasks.TryRemove(id, out _));
        }
    }
}

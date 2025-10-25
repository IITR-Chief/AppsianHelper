using ProjectManagerApi.Models;
using ProjectManagerApi.DTOs;

namespace ProjectManagerApi.Services
{
    public interface ISmartSchedulerService
    {
        Task<ScheduleResponse> GenerateSmartScheduleAsync(Guid projectId, ScheduleRequest request, Guid userId);
    }

    public class SmartSchedulerService : ISmartSchedulerService
    {
        public Task<ScheduleResponse> GenerateSmartScheduleAsync(Guid projectId, ScheduleRequest request, Guid userId)
        {
            var response = new ScheduleResponse();
            var taskDetails = new Dictionary<string, ScheduledTaskDetails>();
            var warnings = new List<string>();
            var taskGraph = new Dictionary<string, List<string>>();
            var taskMap = new Dictionary<string, ScheduleTaskInput>();

            // Build task map and dependency graph
            foreach (var task in request.Tasks)
            {
                taskMap[task.Title] = task;
                taskGraph[task.Title] = task.Dependencies;
            }

            // Validate dependencies
            var validationResult = ValidateDependencies(taskMap, taskGraph);
            if (!validationResult.isValid)
            {
                response.IsScheduleValid = false;
                response.Warnings = validationResult.warnings;
                return Task.FromResult(response);
            }

            // Perform topological sort to determine order
            var sortResult = TopologicalSort(taskGraph);
            if (!sortResult.success)
            {
                response.IsScheduleValid = false;
                response.Warnings.Add("Circular dependency detected in task dependencies.");
                return Task.FromResult(response);
            }

            response.RecommendedOrder = sortResult.order;

            // Calculate scheduling details
            var currentDate = DateTime.UtcNow.Date;
            var taskSchedule = new Dictionary<string, DateTime>();

            foreach (var taskTitle in response.RecommendedOrder)
            {
                var task = taskMap[taskTitle];
                var startDate = CalculateStartDate(task, taskSchedule, currentDate);
                var endDate = startDate.AddHours(task.EstimatedHours);

                taskSchedule[taskTitle] = endDate;

                var scheduledTask = new ScheduledTaskDetails
                {
                    Title = task.Title,
                    SuggestedStartDate = startDate,
                    SuggestedEndDate = endDate,
                    DueDate = task.DueDate,
                    EstimatedHours = task.EstimatedHours,
                    Dependencies = task.Dependencies,
                    Priority = CalculatePriority(task, taskMap),
                    HasConflict = endDate > task.DueDate
                };

                if (scheduledTask.HasConflict)
                {
                    warnings.Add($"Task '{task.Title}' may not complete by its due date ({task.DueDate:yyyy-MM-dd})");
                }

                taskDetails[taskTitle] = scheduledTask;
            }

            response.TaskDetails = taskDetails;
            response.Warnings = warnings;
            response.IsScheduleValid = !taskDetails.Values.Any(t => t.HasConflict);

            return Task.FromResult(response);
        }

        private (bool isValid, List<string> warnings) ValidateDependencies(
            Dictionary<string, ScheduleTaskInput> taskMap, 
            Dictionary<string, List<string>> taskGraph)
        {
            var warnings = new List<string>();
            var isValid = true;

            foreach (var task in taskMap.Values)
            {
                // Check if all dependencies exist
                foreach (var dependency in task.Dependencies)
                {
                    if (!taskMap.ContainsKey(dependency))
                    {
                        warnings.Add($"Task '{task.Title}' has unknown dependency '{dependency}'");
                        isValid = false;
                    }
                }

                // Check for self-dependencies
                if (task.Dependencies.Contains(task.Title))
                {
                    warnings.Add($"Task '{task.Title}' cannot depend on itself");
                    isValid = false;
                }

                // Validate estimated hours
                if (task.EstimatedHours <= 0)
                {
                    warnings.Add($"Task '{task.Title}' must have positive estimated hours");
                    isValid = false;
                }

                // Check due date is in the future
                if (task.DueDate <= DateTime.UtcNow)
                {
                    warnings.Add($"Task '{task.Title}' due date should be in the future");
                }
            }

            return (isValid, warnings);
        }

        private (bool success, List<string> order) TopologicalSort(Dictionary<string, List<string>> graph)
        {
            var inDegree = new Dictionary<string, int>();
            var adjList = new Dictionary<string, List<string>>();
            var result = new List<string>();

            // Initialize in-degree and adjacency list
            foreach (var node in graph.Keys)
            {
                inDegree[node] = 0;
                adjList[node] = new List<string>();
            }

            // Build adjacency list and calculate in-degrees
            foreach (var kvp in graph)
            {
                var node = kvp.Key;
                var dependencies = kvp.Value;

                foreach (var dependency in dependencies)
                {
                    if (graph.ContainsKey(dependency))
                    {
                        adjList[dependency].Add(node);
                        inDegree[node]++;
                    }
                }
            }

            // Kahn's algorithm
            var queue = new Queue<string>();
            foreach (var kvp in inDegree)
            {
                if (kvp.Value == 0)
                {
                    queue.Enqueue(kvp.Key);
                }
            }

            while (queue.Count > 0)
            {
                var current = queue.Dequeue();
                result.Add(current);

                foreach (var neighbor in adjList[current])
                {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] == 0)
                    {
                        queue.Enqueue(neighbor);
                    }
                }
            }

            // Check for cycles
            if (result.Count != graph.Count)
            {
                return (false, new List<string>());
            }

            return (true, result);
        }

        private DateTime CalculateStartDate(
            ScheduleTaskInput task, 
            Dictionary<string, DateTime> taskSchedule, 
            DateTime earliestStart)
        {
            var startDate = earliestStart;

            // Consider dependency completion times
            foreach (var dependency in task.Dependencies)
            {
                if (taskSchedule.ContainsKey(dependency))
                {
                    var dependencyEndDate = taskSchedule[dependency];
                    if (dependencyEndDate > startDate)
                    {
                        startDate = dependencyEndDate;
                    }
                }
            }

            return startDate;
        }

        private int CalculatePriority(ScheduleTaskInput task, Dictionary<string, ScheduleTaskInput> taskMap)
        {
            // Calculate priority based on due date urgency and dependency count
            var daysUntilDue = (task.DueDate - DateTime.UtcNow).Days;
            var dependencyCount = CountAllDependencies(task.Title, taskMap, new HashSet<string>());
            
            // Lower number = higher priority
            var priority = Math.Max(1, daysUntilDue - dependencyCount);
            return priority;
        }

        private int CountAllDependencies(string taskTitle, Dictionary<string, ScheduleTaskInput> taskMap, HashSet<string> visited)
        {
            if (visited.Contains(taskTitle) || !taskMap.ContainsKey(taskTitle))
            {
                return 0;
            }

            visited.Add(taskTitle);
            var count = 0;

            foreach (var dependency in taskMap[taskTitle].Dependencies)
            {
                count += 1 + CountAllDependencies(dependency, taskMap, visited);
            }

            return count;
        }
    }
}

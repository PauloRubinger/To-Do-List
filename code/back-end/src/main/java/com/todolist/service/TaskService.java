package com.todolist.service;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.todolist.entity.Task;
import com.todolist.enums.TaskStatus;
import com.todolist.enums.TaskType;
import com.todolist.repository.TaskRepository;

import org.springframework.http.HttpStatus;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> listAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getAllTasksByTaskListId(Long taskListId) {
        return taskRepository.findByTaskListId(taskListId);
    }

    public Task get(Long id) {
        return taskRepository.findById(id).get();
    }

    public Task addTask(Task task) {
        validateTask(task);
        task.setStatus(calculateStatus(task));
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task) {
        Task existentTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        existentTask.setName(task.getName());
        existentTask.setCompleted(task.getCompleted());
        existentTask.setType(task.getType());
        existentTask.setPriority(task.getPriority());
        existentTask.setDueDate(task.getDueDate());

        validateTask(existentTask);
        existentTask.setStatus(calculateStatus(existentTask));

        return taskRepository.save(existentTask);
    }

    public Task updateTaskCompletion(Long id, boolean completed) {
        Task existentTask = taskRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        
        existentTask.setCompleted(completed);
        existentTask.setStatus(calculateStatus(existentTask));

        return taskRepository.save(existentTask);
    }

    private void validateTask(Task task) {
        
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date now = calendar.getTime();
    
        // For tasks of type FREE, set dueDate to null
        if (task.getType() == TaskType.FREE) {
            task.setDueDate(null);
        }
        // For tasks of type DATE or DEADLINE, ensure dueDate is not before today
        else if (task.getType() == TaskType.DATE || task.getType() == TaskType.DEADLINE) {
            if (task.getDueDate() == null || task.getDueDate().before(now)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The due date must be equal to or after today");
            }
        }
    }

    private TaskStatus calculateStatus(Task task) {
        if (task.getCompleted()) {
            return TaskStatus.COMPLETED;
        }

        Date now = new Date();
        if (task.getType() == TaskType.DATE || task.getType() == TaskType.DEADLINE) {
            if (task.getDueDate().before(now)) {
                return TaskStatus.OVERDUE;
            } else {
                return TaskStatus.SCHEDULED;
            }
        } else {
            return TaskStatus.SCHEDULED;
        }
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        taskRepository.delete(task);
    }
}

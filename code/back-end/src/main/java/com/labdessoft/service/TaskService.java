package com.labdessoft.service;

import com.labdessoft.entity.Task;
import com.labdessoft.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

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

    public Task get(Long id) {
        return taskRepository.findById(id).get();
    }

    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        existingTask.setName(task.getName());
        existingTask.setCompleted(task.getCompleted());
        existingTask.setType(task.getType());
        existingTask.setPriority(task.getPriority());
        existingTask.setDueDate(task.getDueDate());

        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        taskRepository.delete(task);
    }
}

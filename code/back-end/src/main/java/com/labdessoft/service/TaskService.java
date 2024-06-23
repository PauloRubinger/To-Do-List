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
        Task existentTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
        System.out.println("Date service " + task.getDueDate());
        existentTask.setName(task.getName());
        existentTask.setCompleted(task.getCompleted());
        existentTask.setType(task.getType());
        existentTask.setPriority(task.getPriority());
        existentTask.setDueDate(task.getDueDate());

        return taskRepository.save(existentTask);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        taskRepository.delete(task);
    }
}

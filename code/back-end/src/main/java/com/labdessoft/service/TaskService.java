package com.labdessoft.service;

import com.labdessoft.entity.Task;
import com.labdessoft.enums.TaskStatus;
import com.labdessoft.enums.TaskType;
import com.labdessoft.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
        existentTask.setName(task.getName());
        existentTask.setCompleted(task.getCompleted());
        existentTask.setType(task.getType());
        existentTask.setPriority(task.getPriority());
        existentTask.setDueDate(task.getDueDate());

        validateTask(existentTask);
        existentTask.setStatus(calculateStatus(existentTask));

        return taskRepository.save(existentTask);
    }

    private void validateTask(Task task) {
        Date now = new Date();

        // For tasks of type LIVRE, set dueDate to null
        if (task.getType() == TaskType.LIVRE) {
            task.setDueDate(null);
        }
        // For tasks of type DATA or PRAZO, ensure dueDate is not before today
        else if (task.getType() == TaskType.DATA || task.getType() == TaskType.PRAZO) {
            if (task.getDueDate() == null || task.getDueDate().before(now)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data prevista deve ser igual ou superior à data atual");
            }
        }
    }

    private TaskStatus calculateStatus(Task task) {
        if (task.getCompleted()) {
            return TaskStatus.CONCLUIDA;
        }

        Date now = new Date();
        if (task.getType() == TaskType.DATA || task.getType() == TaskType.PRAZO) {
            if (task.getDueDate().before(now)) {
                return TaskStatus.ATRASADA;
            } else {
                return TaskStatus.PREVISTA;
            }
        } else {
            return TaskStatus.PREVISTA;
        }
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        taskRepository.delete(task);
    }
}

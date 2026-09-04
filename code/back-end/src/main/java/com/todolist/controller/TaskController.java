package com.todolist.controller;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.todolist.entity.Task;
import com.todolist.entity.TaskList;
import com.todolist.repository.TaskRepository;
import com.todolist.service.TaskListService;
import com.todolist.service.TaskService;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskService taskService;
    private final TaskListService taskListService;

    @Autowired
    TaskRepository taskRepository;
    
    public TaskController(TaskService taskService, TaskListService taskListService) {
        this.taskService = taskService;
        this.taskListService = taskListService;
    }

    @Operation(summary = "List all tasks from the list")
    @GetMapping("/listAll")
    public ResponseEntity<List<Task>> listAllTasks() {
        try {
            List<Task> tasks = taskService.listAllTasks();
            if (tasks.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Returns all tasks for a task list")
    @GetMapping("/listAllByTaskList")
    public ResponseEntity<List<Task>> getAllTasksByTaskListId(@RequestParam Long taskListId) {
        try {
            List<Task> tasks = taskService.getAllTasksByTaskListId(taskListId);
            if (tasks.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Gets the task by id")
    @GetMapping("/get/{id}")
    public ResponseEntity<Task> get(@PathVariable Long id) {
        try {
            Task task = taskService.get(id);
            return new ResponseEntity<>(task, HttpStatus.OK);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Adds the task to the list")
    @PostMapping("/add")
    public ResponseEntity<Task> addTask(@RequestParam Long taskListId, @RequestBody Task task) {
        try {
            TaskList taskList = taskListService.get(taskListId);
            if (taskList == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            task.setTaskList(taskList);
            Task newTask = taskService.addTask(task);
            return new ResponseEntity<>(newTask, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Updates the task in the list")
    @PutMapping("/edit/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        try {
            Task updatedTask = taskService.updateTask(id, task);
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    @Operation(summary = "Updates the task completion status")
    @PatchMapping("/{id}")
    public ResponseEntity<Task> updateTaskCompletion(@PathVariable Long id, @RequestParam boolean completed) {
        try {
            Task updatedTask = taskService.updateTaskCompletion(id, completed);
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Deletes the task from the list")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}

package com.todolist.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.todolist.entity.TaskList;
import com.todolist.service.TaskListService;

import java.util.List;

@RestController
@RequestMapping("taskList")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @Operation(summary = "List all task lists")
    @GetMapping("/listAll")
    public ResponseEntity<List<TaskList>> listAllTaskLists() {
        try {
            List<TaskList> taskLists = taskListService.listAllTaskLists();
            if (taskLists.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(taskLists, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Gets the task list by id")
    @GetMapping("/get/{id}")
    public ResponseEntity<TaskList> get(@PathVariable Long id) {
        try {
            TaskList tasklist = taskListService.get(id);
            return new ResponseEntity<>(tasklist, HttpStatus.OK);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Adds the task list")
    @PostMapping("/add")
    public ResponseEntity<TaskList> addTaskList(@RequestBody TaskList taskList) {
        try {
            TaskList newTaskList = taskListService.addTaskList(taskList);
            return new ResponseEntity<>(newTaskList, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Updates the task list")
    @PutMapping("/edit/{id}")
    public ResponseEntity<TaskList> updateTaskList(@PathVariable Long id, @RequestBody TaskList taskList) {
        try {
            TaskList updatedTaskList = taskListService.updateTaskList(id, taskList);
            return new ResponseEntity<>(updatedTaskList, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Deletes the task list")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteTaskList(@PathVariable Long id) {
        try {
            taskListService.deleteTaskList(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}

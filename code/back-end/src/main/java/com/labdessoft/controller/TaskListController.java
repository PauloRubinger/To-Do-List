package com.labdessoft.controller;

import com.labdessoft.entity.TaskList;
import com.labdessoft.service.TaskListService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("taskList")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @Operation(summary = "Lista todas as listas de tarefas")
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

    @Operation(summary = "Obtém a lista de tarefas pelo id")
    @GetMapping("/get")
    public ResponseEntity<TaskList> get(@RequestBody Long id) {
        try {
            TaskList tasklist = taskListService.get(id);
            return new ResponseEntity<>(tasklist, HttpStatus.OK);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Adiciona a lista de tarefas")
    @PostMapping("/add")
    public ResponseEntity<TaskList> addTaskList(@RequestBody TaskList taskList) {
        try {
            TaskList newTaskList = taskListService.addTaskList(taskList);
            return new ResponseEntity<>(newTaskList, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Atualiza a lista de tarefas")
    @PutMapping("/edit/{id}")
    public ResponseEntity<TaskList> updateTaskList(@PathVariable Long id, @RequestBody TaskList taskList) {
        try {
            TaskList updatedTaskList = taskListService.updateTaskList(id, taskList);
            return new ResponseEntity<>(updatedTaskList, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Deleta a lista de tarefas")
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

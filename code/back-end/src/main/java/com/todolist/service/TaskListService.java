package com.todolist.service;

import org.springframework.stereotype.Service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.todolist.entity.*;
import com.todolist.repository.TaskListRepository;

import java.util.List;;

@Service
public class TaskListService {
    private final TaskListRepository taskListRepository;

    public TaskListService(TaskListRepository taskListRepository) {
        this.taskListRepository = taskListRepository;
    }

    public List<TaskList> listAllTaskLists() {
        return taskListRepository.findAll();
    }

    public TaskList get(Long id) {
        return taskListRepository.findById(id).get();
    }

    public TaskList addTaskList(TaskList taskList) {
        return taskListRepository.save(taskList);
    }

    public TaskList updateTaskList(Long id, TaskList taskList) {
        TaskList existentTaskList = taskListRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lista de tarefas não encontrada"));
        existentTaskList.setName(taskList.getName());
        existentTaskList.setDescription(taskList.getDescription());

        return taskListRepository.save(existentTaskList);
    }

    public void deleteTaskList(Long id) {
        TaskList taskList = taskListRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lista de tarefas não encontrada"));

        taskListRepository.delete(taskList);
    }
}

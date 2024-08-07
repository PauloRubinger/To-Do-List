package com.todolist.unit.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todolist.controller.TaskController;
import com.todolist.entity.Task;
import com.todolist.entity.TaskList;
import com.todolist.enums.TaskPriority;
import com.todolist.enums.TaskType;
import com.todolist.repository.TaskRepository;
import com.todolist.service.TaskService;
import com.todolist.service.TaskListService;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
@Import({ TaskService.class, TaskListService.class })
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @MockBean
    private TaskListService taskListService;

    @MockBean
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void listAllTasks_ReturnsTasks() throws Exception {
        Task task = new Task("tarefa 2", TaskType.DATA, TaskPriority.ALTA, new Date());
        Mockito.when(taskService.listAllTasks()).thenReturn(Arrays.asList(task));

        mockMvc.perform(get("/task/listAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(task.getName()));
    }

    @Test
    public void listAllTasks_ReturnsNoContent() throws Exception {
        Mockito.when(taskService.listAllTasks()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/task/listAll"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void addTask_ReturnsCreatedTask() throws Exception {
        TaskList taskList = new TaskList();
        taskList.setId(1L);

        Task task = new Task("TestTask", TaskType.LIVRE, TaskPriority.ALTA, null);
        task.setTaskList(taskList);

        Mockito.when(taskListService.get(1L)).thenReturn(taskList);
        Mockito.when(taskService.addTask(Mockito.any(Task.class))).thenReturn(task);

        String taskJson = objectMapper.writeValueAsString(task);

        mockMvc.perform(post("/task/add")
                .param("taskListId", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(taskJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value(task.getName()));
    }

    // TODO More tests for update and delete
}

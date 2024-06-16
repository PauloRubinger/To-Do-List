package com.labdessoft.roteiro01.unit.controller;

import com.labdessoft.roteiro01.controller.TaskController;
import com.labdessoft.roteiro01.entity.Task;
import com.labdessoft.roteiro01.service.TaskService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Test
    public void listAllTasks_ReturnsTasks() throws Exception {
        Task task = new Task("tarefa 2", false);
        Mockito.when(taskService.listAllTasks()).thenReturn(Arrays.asList(task));

        mockMvc.perform(get("/api/task"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(task.getId()))
                .andExpect(jsonPath("$[0].name").value(task.getName()));
    }

    @Test
    public void listAllTasks_ReturnsNoContent() throws Exception {
        Mockito.when(taskService.listAllTasks()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/task"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void addTask_ReturnsCreatedTask() throws Exception {
        Task task = new Task("tarefa 1", false);
        Mockito.when(taskService.addTask(Mockito.any(Task.class))).thenReturn(task);

        mockMvc.perform(post("/api/task")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"Test Task\", \"completed\": false}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(task.getId()))
                .andExpect(jsonPath("$.name").value(task.getName()));
    }

    // TODO More tests for update and delete
}

package com.labdessoft.unit.controller;

import com.labdessoft.roteiro01.controller.TaskListController;
import com.labdessoft.roteiro01.entity.TaskList;
import com.labdessoft.roteiro01.service.TaskListService;
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

@WebMvcTest(TaskListController.class)
public class TaskListControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskListService taskListService;

    @Test
    public void listAllTaskLists_ReturnsTaskLists() throws Exception {
        TaskList taskList = new TaskList("lista 1", "Test Task List");
        Mockito.when(taskListService.listAllTaskLists()).thenReturn(Arrays.asList(taskList));

        mockMvc.perform(get("/api/taskLists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(taskList.getId()))
                .andExpect(jsonPath("$[0].name").value(taskList.getName()));
    }

    @Test
    public void listAllTaskLists_ReturnsNoContent() throws Exception {
        Mockito.when(taskListService.listAllTaskLists()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/taskLists"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void addTaskList_ReturnsCreatedTaskList() throws Exception {
        TaskList taskList = new TaskList("lista 2", "Test Task List");
        Mockito.when(taskListService.addTaskList(Mockito.any(TaskList.class))).thenReturn(taskList);

        mockMvc.perform(post("/api/taskLists")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"Test Task List\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(taskList.getId()))
                .andExpect(jsonPath("$.name").value(taskList.getName()));
    }

    // More tests for update and delete...
}

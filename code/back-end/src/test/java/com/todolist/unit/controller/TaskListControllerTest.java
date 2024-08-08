package com.todolist.unit.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.todolist.controller.TaskListController;
import com.todolist.entity.TaskList;
import com.todolist.service.TaskListService;

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
        TaskList taskList = new TaskList("Lista 1", "Test Task List");
        Mockito.when(taskListService.listAllTaskLists()).thenReturn(Arrays.asList(taskList));

        mockMvc.perform(get("/taskList/listAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(taskList.getId()))
                .andExpect(jsonPath("$[0].name").value(taskList.getName()));
    }

    @Test
    public void listAllTaskLists_ReturnsNoContent() throws Exception {
        Mockito.when(taskListService.listAllTaskLists()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/taskList/listAll"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void addTaskList_ReturnsCreatedTaskList() throws Exception {
        TaskList taskList = new TaskList("Lista 2", "Test Task List");
        Mockito.when(taskListService.addTaskList(Mockito.any(TaskList.class))).thenReturn(taskList);

        mockMvc.perform(post("/taskList/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"Test Task List\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(taskList.getId()))
                .andExpect(jsonPath("$.name").value(taskList.getName()));
    }

    @Test
    public void updateTaskList_ReturnsUpdatedTaskList() throws Exception {
        TaskList updatedTaskList = new TaskList("Lista 3", "Updated Test Task List");
        updatedTaskList.setId(1L);

        Mockito.when(taskListService.updateTaskList(Mockito.eq(1L), Mockito.any(TaskList.class))).thenReturn(updatedTaskList);

        mockMvc.perform(put("/taskList/edit/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"Updated Test Task List\", \"description\": \"Updated description\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(updatedTaskList.getId()))
                .andExpect(jsonPath("$.name").value(updatedTaskList.getName()));
    }

    @Test
    public void deleteTaskList_ReturnsNoContent() throws Exception {
        Mockito.doNothing().when(taskListService).deleteTaskList(1L);

        mockMvc.perform(delete("/taskList/delete/1"))
                .andExpect(status().isNoContent());
    }

}

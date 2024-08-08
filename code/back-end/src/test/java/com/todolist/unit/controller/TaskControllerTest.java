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

    @Test
    public void getAllTasksByTaskListId_ReturnsTasks() throws Exception {
        Task task = new Task("tarefa 2", TaskType.DATA, TaskPriority.ALTA, new Date());
        Mockito.when(taskService.getAllTasksByTaskListId(1L)).thenReturn(Arrays.asList(task));

        mockMvc.perform(get("/task/listAllByTaskList")
                .param("taskListId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(task.getName()));
    }

    @Test
    public void getAllTasksByTaskListId_ReturnsNoContent() throws Exception {
        Mockito.when(taskService.getAllTasksByTaskListId(1L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/task/listAllByTaskList")
                .param("taskListId", "1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void get_ReturnsTask() throws Exception {
        Task task = new Task("tarefa 2", TaskType.DATA, TaskPriority.ALTA, new Date());
        Mockito.when(taskService.get(1L)).thenReturn(task);

        mockMvc.perform(get("/task/get/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(task.getName()));
    }

    @Test
    public void get_ReturnsBadRequest() throws Exception {
        Mockito.when(taskService.get(1L)).thenThrow(new RuntimeException("Task not found"));

        mockMvc.perform(get("/task/get/1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateTask_ReturnsUpdatedTask() throws Exception {
        Task task = new Task("tarefa 2", TaskType.DATA, TaskPriority.ALTA, new Date());
        Mockito.when(taskService.updateTask(Mockito.eq(1L), Mockito.any(Task.class))).thenReturn(task);

        String taskJson = objectMapper.writeValueAsString(task);

        mockMvc.perform(put("/task/edit/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(taskJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(task.getName()));
    }

    @Test
    public void updateTask_ReturnsBadRequest() throws Exception {
        Mockito.when(taskService.updateTask(Mockito.eq(1L), Mockito.any(Task.class)))
                .thenThrow(new RuntimeException("Task update failed"));

        Task task = new Task("tarefa 2", TaskType.DATA, TaskPriority.ALTA, new Date());
        String taskJson = objectMapper.writeValueAsString(task);

        mockMvc.perform(put("/task/edit/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(taskJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void updateTaskCompletion_ReturnsUpdatedTask() throws Exception {
        Task task = new Task("tarefa 2", TaskType.DATA, TaskPriority.ALTA, new Date());
        task.setCompleted(true);
        Mockito.when(taskService.updateTaskCompletion(1L, true)).thenReturn(task);

        mockMvc.perform(patch("/task/1")
                .param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    public void updateTaskCompletion_ReturnsBadRequest() throws Exception {
        Mockito.when(taskService.updateTaskCompletion(1L, true))
                .thenThrow(new RuntimeException("Task completion update failed"));

        mockMvc.perform(patch("/task/1")
                .param("completed", "true"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void deleteTask_ReturnsNoContent() throws Exception {
        Mockito.doNothing().when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/task/delete/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void deleteTask_ReturnsBadRequest() throws Exception {
        Mockito.doThrow(new RuntimeException("Task deletion failed")).when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/task/delete/1"))
                .andExpect(status().isBadRequest());
    }

}

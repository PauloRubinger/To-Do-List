package com.labdessoft.roteiro01.unit.service;

import com.labdessoft.roteiro01.entity.Task;
import com.labdessoft.roteiro01.repository.TaskRepository;
import com.labdessoft.roteiro01.service.TaskService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

public class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testListAllTasks() {
        Task task1 = new Task("Test Task 1", false);
        Task task2 = new Task("Test Task 2", false);
        when(taskRepository.findAll()).thenReturn(Arrays.asList(task1, task2));

        List<Task> tasks = taskService.listAllTasks();

        assertThat(tasks).hasSize(2);
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    public void testAddTask() {
        Task task = new Task("Test Task", false);
        when(taskRepository.save(task)).thenReturn(task);

        Task newTask = taskService.addTask(task);

        assertThat(newTask).isNotNull();
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    public void testUpdateTask() {
        Task task = new Task("Test Task", false);
        Task updatedTask = new Task("Updated Task", true);
        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(updatedTask);

        Task result = taskService.updateTask(task.getId(), updatedTask);

        assertThat(result.getName()).isEqualTo(updatedTask.getName());
        verify(taskRepository, times(1)).findById(task.getId());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    public void testUpdateTaskNotFound() {
        Long taskId = 1L;
        Task updatedTask = new Task("Updated Task", true);
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(taskId, updatedTask))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");
    }

    @Test
    public void testDeleteTask() {
        Task task = new Task("Test Task", false);
        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));

        taskService.deleteTask(task.getId());

        verify(taskRepository, times(1)).findById(task.getId());
        verify(taskRepository, times(1)).delete(task);
    }

    @Test
    public void testDeleteTaskNotFound() {
        Long taskId = 1L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask(taskId))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");
    }
}

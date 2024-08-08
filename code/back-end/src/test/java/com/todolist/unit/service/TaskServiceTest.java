package com.todolist.unit.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import com.todolist.entity.Task;
import com.todolist.enums.TaskPriority;
import com.todolist.enums.TaskStatus;
import com.todolist.enums.TaskType;
import com.todolist.repository.TaskRepository;
import com.todolist.service.TaskService;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
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
        Task task1 = new Task("Test Task 1", TaskType.LIVRE, TaskPriority.MEDIA, new Date());
        Task task2 = new Task("Test Task 2", TaskType.PRAZO, TaskPriority.ALTA, new Date());
        when(taskRepository.findAll()).thenReturn(Arrays.asList(task1, task2));

        List<Task> tasks = taskService.listAllTasks();

        assertThat(tasks).hasSize(2);
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    public void testAddTask() {
        Task task = new Task("Test Task", TaskType.LIVRE, TaskPriority.ALTA, new Date());
        when(taskRepository.save(task)).thenReturn(task);

        Task newTask = taskService.addTask(task);

        assertThat(newTask).isNotNull();
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    public void testUpdateTask() {
        Task task = new Task("Test Task", TaskType.DATA, TaskPriority.ALTA, new Date());
        task.setId(1L);
        Task updatedTask = new Task("Updated Task", TaskType.LIVRE, TaskPriority.ALTA, null);
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
        Task updatedTask = new Task("Updated Task", TaskType.PRAZO, TaskPriority.BAIXA, new Date());
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(taskId, updatedTask))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");
    }

    @Test
    public void testDeleteTask() {
        Task task = new Task("Test Task", TaskType.LIVRE, TaskPriority.MEDIA, new Date());
        task.setId(1L);
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

    @Test
    public void testValidateTask_ThrowsExceptionForInvalidDueDate() {
        Task task = new Task("Test Task", TaskType.DATA, TaskPriority.ALTA, new Date());
        task.setDueDate(getPastDate());

        assertThatThrownBy(() -> taskService.addTask(task))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("A data prevista deve ser igual ou superior à data atual");
    }

    @Test
    public void testUpdateTaskCompletion() {
        Task task = new Task("Test Task", TaskType.LIVRE, TaskPriority.MEDIA, new Date());
        task.setId(1L);
        task.setCompleted(false);
        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        Task updatedTask = taskService.updateTaskCompletion(task.getId(), true);

        assertThat(updatedTask.getCompleted()).isTrue();
        assertThat(updatedTask.getStatus()).isEqualTo(TaskStatus.CONCLUIDA);
        verify(taskRepository, times(1)).findById(task.getId());
        verify(taskRepository, times(1)).save(task);
    }

    private Date getPastDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -1);
        return calendar.getTime();
    }
}

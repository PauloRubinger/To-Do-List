package com.labdessoft.unit.repository;

import com.labdessoft.roteiro01.entity.Task;
import com.labdessoft.roteiro01.repository.TaskRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Test
    public void testSaveTask() {
        Task task = new Task("Test Task", false);
        Task savedTask = taskRepository.save(task);
        
        assertThat(savedTask).isNotNull();
        assertThat(savedTask.getId()).isNotNull();
    }

    @Test
    public void testFindById() {
        Task task = new Task("Test Task", false);
        Task savedTask = taskRepository.save(task);
        
        Optional<Task> foundTask = taskRepository.findById(savedTask.getId());
        
        assertThat(foundTask).isPresent();
        assertThat(foundTask.get().getName()).isEqualTo(task.getName());
    }

    @Test
    public void testFindAll() {
        Task task1 = new Task("Test Task 1", false);
        Task task2 = new Task("Test Task 2", false);
        taskRepository.save(task1);
        taskRepository.save(task2);
        
        List<Task> tasks = taskRepository.findAll();
        
        assertThat(tasks).hasSize(2);
    }

    @Test
    public void testDeleteById() {
        Task task = new Task("Test Task", false);
        Task savedTask = taskRepository.save(task);
        
        taskRepository.deleteById(savedTask.getId());
        
        Optional<Task> foundTask = taskRepository.findById(savedTask.getId());
        
        assertThat(foundTask).isNotPresent();
    }
}


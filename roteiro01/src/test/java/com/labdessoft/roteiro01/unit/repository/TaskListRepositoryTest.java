// package com.labdessoft.roteiro01.unit.repository;

// import com.labdessoft.roteiro01.entity.TaskList;
// import com.labdessoft.roteiro01.repository.TaskListRepository;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

// import java.util.List;
// import java.util.Optional;

// import static org.assertj.core.api.Assertions.assertThat;

// @DataJpaTest
// public class TaskListRepositoryTest {
//      @Autowired
//     private TaskListRepository taskListRepository;

//     @Test
//     public void testSaveTaskList() {
//         TaskList taskList = new TaskList("Test TaskList", "Description");
//         TaskList savedTaskList = taskListRepository.save(taskList);
        
//         assertThat(savedTaskList).isNotNull();
//         assertThat(savedTaskList.getId()).isNotNull();
//     }

//     @Test
//     public void testFindById() {
//         TaskList taskList = new TaskList("Test TaskList", "Description");
//         TaskList savedTaskList = taskListRepository.save(taskList);
        
//         Optional<TaskList> foundTaskList = taskListRepository.findById(savedTaskList.getId());
        
//         assertThat(foundTaskList).isPresent();
//         assertThat(foundTaskList.get().getName()).isEqualTo(taskList.getName());
//     }

//     @Test
//     public void testFindAll() {
//         TaskList taskList1 = new TaskList("Test TaskList 1", "Description 1");
//         TaskList taskList2 = new TaskList("Test TaskList 2", "Description 2");
//         taskListRepository.save(taskList1);
//         taskListRepository.save(taskList2);
        
//         List<TaskList> taskLists = taskListRepository.findAll();
        
//         assertThat(taskLists).hasSize(2);
//     }

//     @Test
//     public void testDeleteById() {
//         TaskList taskList = new TaskList("Test TaskList", "Description");
//         TaskList savedTaskList = taskListRepository.save(taskList);
        
//         taskListRepository.deleteById(savedTaskList.getId());
        
//         Optional<TaskList> foundTaskList = taskListRepository.findById(savedTaskList.getId());
        
//         assertThat(foundTaskList).isNotPresent();
//     }
// }

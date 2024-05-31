// package com.labdessoft.roteiro01.unit.service;

// import com.labdessoft.roteiro01.entity.TaskList;
// import com.labdessoft.roteiro01.repository.TaskListRepository;
// import com.labdessoft.roteiro01.service.TaskListService;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.web.server.ResponseStatusException;

// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.assertj.core.api.Assertions.assertThatThrownBy;
// import static org.mockito.Mockito.*;

// public class TaskListServiceTest {
//     @Mock
//     private TaskListRepository taskListRepository;

//     @InjectMocks
//     private TaskListService taskListService;

//     @BeforeEach
//     public void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void testListAllTaskLists() {
//         TaskList taskList1 = new TaskList("Test TaskList 1", "Description 1");
//         TaskList taskList2 = new TaskList("Test TaskList 2", "Description 2");
//         when(taskListRepository.findAll()).thenReturn(Arrays.asList(taskList1, taskList2));

//         List<TaskList> taskLists = taskListService.listAllTaskLists();

//         assertThat(taskLists).hasSize(2);
//         verify(taskListRepository, times(1)).findAll();
//     }

//     @Test
//     public void testAddTaskList() {
//         TaskList taskList = new TaskList("Test TaskList", "Description");
//         when(taskListRepository.save(taskList)).thenReturn(taskList);

//         TaskList newTaskList = taskListService.addTaskList(taskList);

//         assertThat(newTaskList).isNotNull();
//         verify(taskListRepository, times(1)).save(taskList);
//     }

//     @Test
//     public void testUpdateTaskList() {
//         TaskList taskList = new TaskList("Test TaskList", "Description");
//         TaskList updatedTaskList = new TaskList("Updated TaskList", "Updated Description");
//         when(taskListRepository.findById(taskList.getId())).thenReturn(Optional.of(taskList));
//         when(taskListRepository.save(taskList)).thenReturn(updatedTaskList);

//         TaskList result = taskListService.updateTaskList(taskList.getId(), updatedTaskList);

//         assertThat(result.getName()).isEqualTo(updatedTaskList.getName());
//         verify(taskListRepository, times(1)).findById(taskList.getId());
//         verify(taskListRepository, times(1)).save(taskList);
//     }

//     @Test
//     public void testUpdateTaskListNotFound() {
//         Long taskListId = 1L;
//         TaskList updatedTaskList = new TaskList("Updated TaskList", "Updated Description");
//         when(taskListRepository.findById(taskListId)).thenReturn(Optional.empty());

//         assertThatThrownBy(() -> taskListService.updateTaskList(taskListId, updatedTaskList))
//                 .isInstanceOf(ResponseStatusException.class)
//                 .hasMessageContaining("404 NOT_FOUND");
//     }

//     @Test
//     public void testDeleteTaskList() {
//         TaskList taskList = new TaskList("Test TaskList", "Description");
//         when(taskListRepository.findById(taskList.getId())).thenReturn(Optional.of(taskList));

//         taskListService.deleteTaskList(taskList.getId());

//         verify(taskListRepository, times(1)).findById(taskList.getId());
//         verify(taskListRepository, times(1)).delete(taskList);
//     }

//     @Test
//     public void testDeleteTaskListNotFound() {
//         Long taskListId = 1L;
//         when(taskListRepository.findById(taskListId)).thenReturn(Optional.empty());

//         assertThatThrownBy(() -> taskListService.deleteTaskList(taskListId))
//                 .isInstanceOf(ResponseStatusException.class)
//                 .hasMessageContaining("404 NOT_FOUND");
//     }
// }

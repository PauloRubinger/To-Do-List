package com.todolist.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todolist.entity.TaskList;
import java.util.List;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Long>{
    List<TaskList> findByNameIgnoreCaseContaining(String name);
}

package com.labdessoft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.labdessoft.entity.TaskList;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Long>{
    
}

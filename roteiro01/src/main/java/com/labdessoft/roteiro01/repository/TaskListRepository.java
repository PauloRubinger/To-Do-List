package com.labdessoft.roteiro01.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.labdessoft.roteiro01.entity.TaskList;

public interface TaskListRepository extends JpaRepository<TaskList, Long>{
    
}

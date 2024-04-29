package com.labdessoft.roteiro01.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.labdessoft.roteiro01.entity.TaskList;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Long>{
    
}

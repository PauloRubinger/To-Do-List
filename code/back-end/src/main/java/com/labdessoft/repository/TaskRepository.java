package com.labdessoft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.labdessoft.entity.Task;
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
}

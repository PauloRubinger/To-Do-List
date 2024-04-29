package com.labdessoft.roteiro01.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.labdessoft.roteiro01.entity.Task;
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
}

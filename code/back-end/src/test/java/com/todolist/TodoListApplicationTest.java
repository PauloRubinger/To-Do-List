package com.todolist;

import org.springframework.boot.SpringApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(basePackages = "com.todolist.repository")
class TodoListApplicationTest {
public static void main(String[] args) {
        SpringApplication.run(TodoListApplicationTest.class, args);
    }

}

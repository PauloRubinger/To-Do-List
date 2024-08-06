package com.todolist.integration;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.todolist.TodoListApplication;

import org.aspectj.lang.annotation.Before;

@ExtendWith(MockitoExtension.class)
@RunWith(JUnitPlatform.class)
@SpringBootTest(classes = {TodoListApplication.class}, webEnvironment
= SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")

public class TaskControllerIntegrationTest {
    @Before(value = "")
    public void setup() {
        RestAssured.baseURI = "http://localhost:8080";
        RestAssured.port = 8080;
    }

}

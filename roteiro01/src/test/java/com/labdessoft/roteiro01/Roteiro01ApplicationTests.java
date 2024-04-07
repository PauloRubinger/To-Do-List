package com.labdessoft.roteiro01;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.labdessoft.roteiro01.repository")
class Roteiro01ApplicationTests {
public static void main(String[] args) {
        SpringApplication.run(Roteiro01ApplicationTests.class, args);
    }

}

/*
 * Application Flow: main() starts Spring Boot -> components are scanned -> REST APIs and Hibernate become active.
 * Run this class to start the service.
 */
// Short flow: Start Spring Boot service and load application context.
package com.healthclub.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin
public class HealthClubApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthClubApiApplication.class, args);
    }
}

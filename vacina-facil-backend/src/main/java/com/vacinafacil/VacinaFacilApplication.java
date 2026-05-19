package com.vacinafacil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VacinaFacilApplication {
    public static void main(String[] args) {
        SpringApplication.run(VacinaFacilApplication.class, args);
    }
}
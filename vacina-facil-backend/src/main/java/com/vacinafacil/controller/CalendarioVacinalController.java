package com.vacinafacil.controller;

import com.vacinafacil.model.CalendarioVacinal;
import com.vacinafacil.repository.CalendarioVacinalRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendario-vacinal")
@CrossOrigin(origins = "*")
public class CalendarioVacinalController {

    private final CalendarioVacinalRepository repository;

    public CalendarioVacinalController(CalendarioVacinalRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CalendarioVacinal> listar() {
        return repository.findAll();
    }
}

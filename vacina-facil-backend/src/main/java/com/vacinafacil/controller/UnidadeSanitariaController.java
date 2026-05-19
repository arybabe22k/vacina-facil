package com.vacinafacil.controller;

import com.vacinafacil.model.UnidadeSanitaria;
import com.vacinafacil.repository.UnidadeSanitariaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades-sanitarias")
@CrossOrigin(origins = "*")
public class UnidadeSanitariaController {

    private final UnidadeSanitariaRepository repository;

    public UnidadeSanitariaController(UnidadeSanitariaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<UnidadeSanitaria>> listar(
            @RequestParam(required = false) String provincia,
            @RequestParam(required = false) String distrito) {

        if (provincia != null && distrito != null) {
            return ResponseEntity.ok(repository.findByProvinciaAndDistrito(provincia, distrito));
        }
        if (provincia != null) {
            return ResponseEntity.ok(repository.findByProvincia(provincia));
        }
        return ResponseEntity.ok(repository.findAll());
    }
}

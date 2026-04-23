package com.vacinafacil.controller;

import com.vacinafacil.model.Vacina;
import com.vacinafacil.repository.VacinaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacinas")
@CrossOrigin(origins = "*")
public class VacinaController {

    private final VacinaRepository vacinaRepository;

    public VacinaController(VacinaRepository vacinaRepository) {
        this.vacinaRepository = vacinaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Vacina>> listar() {
        return ResponseEntity.ok(vacinaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Vacina> criar(@RequestBody Vacina vacina) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vacinaRepository.save(vacina));
    }
}

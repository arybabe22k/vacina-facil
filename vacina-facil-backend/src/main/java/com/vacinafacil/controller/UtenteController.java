package com.vacinafacil.controller;

import com.vacinafacil.dto.UtenteRequestDTO;
import com.vacinafacil.dto.UtenteResponseDTO;
import com.vacinafacil.service.UtenteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utentes")
@CrossOrigin(origins = "*")
public class UtenteController {

    private final UtenteService utenteService;

    public UtenteController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }

    @PostMapping
    public ResponseEntity<UtenteResponseDTO> registar(@Valid @RequestBody UtenteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(utenteService.registar(dto));
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<UtenteResponseDTO> buscarPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(utenteService.buscarPorCodigo(codigo));
    }

    @GetMapping
    public ResponseEntity<List<UtenteResponseDTO>> listarTodos() {
        return ResponseEntity.ok(utenteService.listarTodos());
    }
}

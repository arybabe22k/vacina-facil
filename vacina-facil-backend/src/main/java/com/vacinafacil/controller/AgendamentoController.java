package com.vacinafacil.controller;

import com.vacinafacil.dto.AgendamentoRequestDTO;
import com.vacinafacil.dto.AgendamentoResponseDTO;
import com.vacinafacil.model.Agendamento.Status;
import com.vacinafacil.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criar(@Valid @RequestBody AgendamentoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agendamentoService.criar(dto));
    }

    @GetMapping("/historico/{codigoUtente}")
    public ResponseEntity<List<AgendamentoResponseDTO>> historico(@PathVariable String codigoUtente) {
        return ResponseEntity.ok(agendamentoService.historicoPorCodigo(codigoUtente));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendamentoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        return ResponseEntity.ok(agendamentoService.atualizarStatus(id, status));
    }
}

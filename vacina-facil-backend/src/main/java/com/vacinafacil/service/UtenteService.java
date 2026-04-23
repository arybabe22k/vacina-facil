package com.vacinafacil.service;

import com.vacinafacil.dto.UtenteRequestDTO;
import com.vacinafacil.dto.UtenteResponseDTO;
import com.vacinafacil.model.Utente;
import com.vacinafacil.repository.UtenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;

    public UtenteService(UtenteRepository utenteRepository) {
        this.utenteRepository = utenteRepository;
    }

    public UtenteResponseDTO registar(UtenteRequestDTO dto) {
        if (dto.getBi() != null && utenteRepository.existsByBi(dto.getBi())) {
            throw new RuntimeException("Já existe um utente com esse BI.");
        }

        Utente utente = new Utente();
        utente.setNome(dto.getNome());
        utente.setDataNascimento(dto.getDataNascimento());
        utente.setTelefone(dto.getTelefone());
        utente.setBi(dto.getBi());
        utente.setCodigoUtente(gerarCodigoUnico());

        return toDTO(utenteRepository.save(utente));
    }

    public UtenteResponseDTO buscarPorCodigo(String codigo) {
        Utente utente = utenteRepository.findByCodigoUtente(codigo)
                .orElseThrow(() -> new RuntimeException("Utente não encontrado com o código: " + codigo));
        return toDTO(utente);
    }

    public List<UtenteResponseDTO> listarTodos() {
        return utenteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private String gerarCodigoUnico() {
        String codigo;
        do {
            codigo = "VF" + String.format("%06d", new Random().nextInt(999999));
        } while (utenteRepository.existsByCodigoUtente(codigo));
        return codigo;
    }

    private UtenteResponseDTO toDTO(Utente u) {
        UtenteResponseDTO dto = new UtenteResponseDTO();
        dto.setId(u.getId());
        dto.setCodigoUtente(u.getCodigoUtente());
        dto.setNome(u.getNome());
        dto.setDataNascimento(u.getDataNascimento());
        dto.setTelefone(u.getTelefone());
        dto.setBi(u.getBi());
        dto.setCriadoEm(u.getCriadoEm());
        return dto;
    }
}

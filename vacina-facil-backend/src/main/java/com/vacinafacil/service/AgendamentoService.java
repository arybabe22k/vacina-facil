package com.vacinafacil.service;

import com.vacinafacil.dto.AgendamentoRequestDTO;
import com.vacinafacil.dto.AgendamentoResponseDTO;
import com.vacinafacil.model.Agendamento;
import com.vacinafacil.model.Agendamento.Status;
import com.vacinafacil.model.Utente;
import com.vacinafacil.model.Vacina;
import com.vacinafacil.repository.AgendamentoRepository;
import com.vacinafacil.repository.UtenteRepository;
import com.vacinafacil.repository.VacinaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final UtenteRepository utenteRepository;
    private final VacinaRepository vacinaRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository,
                              UtenteRepository utenteRepository,
                              VacinaRepository vacinaRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.utenteRepository = utenteRepository;
        this.vacinaRepository = vacinaRepository;
    }

    public AgendamentoResponseDTO criar(AgendamentoRequestDTO dto) {
        Utente utente = utenteRepository.findByCodigoUtente(dto.getCodigoUtente())
                .orElseThrow(() -> new RuntimeException("Utente não encontrado: " + dto.getCodigoUtente()));

        Vacina vacina = vacinaRepository.findById(dto.getVacinaId())
                .orElseThrow(() -> new RuntimeException("Vacina não encontrada: " + dto.getVacinaId()));

        Agendamento agendamento = new Agendamento();
        agendamento.setUtente(utente);
        agendamento.setVacina(vacina);
        agendamento.setDataAgendada(dto.getDataAgendada());
        agendamento.setNumeroDose(dto.getNumeroDose() != null ? dto.getNumeroDose() : 1);

        return toDTO(agendamentoRepository.save(agendamento));
    }

    public List<AgendamentoResponseDTO> historicoPorCodigo(String codigoUtente) {
        return agendamentoRepository.findByUtenteCodigoUtente(codigoUtente)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AgendamentoResponseDTO atualizarStatus(Long id, Status novoStatus) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado: " + id));
        agendamento.setStatus(novoStatus);
        return toDTO(agendamentoRepository.save(agendamento));
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private AgendamentoResponseDTO toDTO(Agendamento a) {
        AgendamentoResponseDTO dto = new AgendamentoResponseDTO();
        dto.setId(a.getId());
        dto.setCodigoUtente(a.getUtente().getCodigoUtente());
        dto.setNomeUtente(a.getUtente().getNome());
        dto.setNomeVacina(a.getVacina().getNome());
        dto.setDataAgendada(a.getDataAgendada());
        dto.setNumeroDose(a.getNumeroDose());
        dto.setStatus(a.getStatus());
        dto.setCriadoEm(a.getCriadoEm());
        return dto;
    }
}

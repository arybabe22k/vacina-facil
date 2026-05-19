package com.vacinafacil.service;

import com.vacinafacil.dto.AgendamentoRequestDTO;
import com.vacinafacil.dto.AgendamentoResponseDTO;
import com.vacinafacil.model.Agendamento;
import com.vacinafacil.model.Agendamento.Status;
import com.vacinafacil.model.CalendarioVacinal;
import com.vacinafacil.model.UnidadeSanitaria;
import com.vacinafacil.model.Utente;
import com.vacinafacil.model.Vacina;
import com.vacinafacil.repository.AgendamentoRepository;
import com.vacinafacil.repository.CalendarioVacinalRepository;
import com.vacinafacil.repository.UnidadeSanitariaRepository;
import com.vacinafacil.repository.UtenteRepository;
import com.vacinafacil.repository.VacinaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final UtenteRepository utenteRepository;
    private final VacinaRepository vacinaRepository;
    private final CalendarioVacinalRepository calendarioVacinalRepository;
    private final UnidadeSanitariaRepository unidadeSanitariaRepository;

    private static final Map<String, Integer> CALENDARIO_DIAS = Map.ofEntries(
            Map.entry("BCG", 0),
            Map.entry("VAPO", 0),
            Map.entry("VAP", 60),
            Map.entry("DTP/HepB/Hib", 60),
            Map.entry("PCV", 60),
            Map.entry("Rotavírus", 60),
            Map.entry("IPV", 120),
            Map.entry("Vitamina A", 180),
            Map.entry("Malária", 180),
            Map.entry("Sarampo e Rubéola", 270),
            Map.entry("Vitamina A e Desparasitação", 365),
            Map.entry("HPV", 9 * 365)
    );

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            UtenteRepository utenteRepository,
            VacinaRepository vacinaRepository,
            CalendarioVacinalRepository calendarioVacinalRepository,
            UnidadeSanitariaRepository unidadeSanitariaRepository
    ) {
        this.agendamentoRepository = agendamentoRepository;
        this.utenteRepository = utenteRepository;
        this.vacinaRepository = vacinaRepository;
        this.calendarioVacinalRepository = calendarioVacinalRepository;
        this.unidadeSanitariaRepository = unidadeSanitariaRepository;
    }

    public AgendamentoResponseDTO criar(AgendamentoRequestDTO dto) {
        Utente utente = utenteRepository.findByCodigoUtente(dto.getCodigoUtente())
                .orElseThrow(() -> new RuntimeException("Utente não encontrado: " + dto.getCodigoUtente()));

        CalendarioVacinal calendario = calendarioVacinalRepository.findById(dto.getVacinaId())
                .orElseThrow(() -> new RuntimeException("Item do calendário vacinal não encontrado: " + dto.getVacinaId()));

        Vacina vacina = vacinaRepository.findAll()
                .stream()
                .filter(v -> v.getNome().equalsIgnoreCase(calendario.getVacina()))
                .findFirst()
                .orElseGet(() -> criarVacinaBase(calendario));

        UnidadeSanitaria unidadeSanitaria = unidadeSanitariaRepository.findById(dto.getUnidadeSanitariaId())
                .orElseThrow(() -> new RuntimeException("Unidade sanitária não encontrada: " + dto.getUnidadeSanitariaId()));

        Agendamento agendamento = new Agendamento();
        agendamento.setUtente(utente);
        agendamento.setVacina(vacina);
        agendamento.setUnidadeSanitaria(unidadeSanitaria);
        agendamento.setDataAgendada(dto.getDataAgendada());
        agendamento.setNumeroDose(dto.getNumeroDose() != null ? dto.getNumeroDose() : extrairNumeroDose(calendario.getDose()));
        agendamento.setStatus(Agendamento.Status.PENDENTE);

        return toDTO(agendamentoRepository.save(agendamento));
    }

    private Vacina criarVacinaBase(CalendarioVacinal calendario) {
        Vacina vacina = new Vacina();
        vacina.setNome(calendario.getVacina());
        vacina.setDescricao(calendario.getObservacao());
        vacina.setNumeroDoses(1);
        vacina.setIntervaloDias(30);
        return vacinaRepository.save(vacina);
    }

    private Integer extrairNumeroDose(String dose) {
        if (dose == null) return 1;

        String texto = dose.toLowerCase();

        if (texto.contains("1")) return 1;
        if (texto.contains("2")) return 2;
        if (texto.contains("3")) return 3;
        if (texto.contains("4")) return 4;

        return 1;
    }

    public void criarAgendamentosAutomaticos(Utente utente) {
        LocalDate nascimento = utente.getDataNascimento();
        List<Vacina> vacinas = vacinaRepository.findAll();

        for (Vacina vacina : vacinas) {
            Integer diasInicio = CALENDARIO_DIAS.get(vacina.getNome());
            if (diasInicio == null) continue;

            int totalDoses = vacina.getNumeroDoses() != null ? vacina.getNumeroDoses() : 1;
            int intervalo = vacina.getIntervaloDias() != null ? vacina.getIntervaloDias() : 30;

            for (int dose = 1; dose <= totalDoses; dose++) {
                int diasOffset = diasInicio + (dose - 1) * intervalo;
                LocalDate dataAgendada = nascimento.plusDays(diasOffset);

                Agendamento agendamento = new Agendamento();
                agendamento.setUtente(utente);
                agendamento.setVacina(vacina);

                // Agendamentos automáticos ainda não têm unidade escolhida pelo utente.
                // Por isso, não estamos a guardar aqui para evitar erro.
                // O agendamento manual é que recebe unidadeSanitaria.

                agendamento.setDataAgendada(dataAgendada);
                agendamento.setNumeroDose(dose);
                agendamento.setStatus(Agendamento.Status.PENDENTE);

                agendamentoRepository.save(agendamento);
            }
        }
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
        AgendamentoResponseDTO resultado = toDTO(agendamentoRepository.save(agendamento));

        if (novoStatus == Status.REALIZADO) {
            agendarProximaDose(agendamento);
        }

        return resultado;
    }

    private void agendarProximaDose(Agendamento atual) {
        Vacina vacina = atual.getVacina();
        int totalDoses = vacina.getNumeroDoses() != null ? vacina.getNumeroDoses() : 1;
        int proximaDose = atual.getNumeroDose() + 1;

        if (proximaDose > totalDoses) return;

        boolean jaExiste = agendamentoRepository
                .findByUtenteCodigoUtente(atual.getUtente().getCodigoUtente())
                .stream()
                .anyMatch(a ->
                        a.getVacina().getId().equals(vacina.getId()) &&
                                a.getNumeroDose().equals(proximaDose)
                );

        if (jaExiste) return;

        int intervalo = vacina.getIntervaloDias() != null ? vacina.getIntervaloDias() : 30;
        LocalDate dataProximaDose = atual.getDataAgendada().plusDays(intervalo);

        Agendamento proximoAgendamento = new Agendamento();
        proximoAgendamento.setUtente(atual.getUtente());
        proximoAgendamento.setVacina(vacina);
        proximoAgendamento.setUnidadeSanitaria(atual.getUnidadeSanitaria());
        proximoAgendamento.setDataAgendada(dataProximaDose);
        proximoAgendamento.setNumeroDose(proximaDose);
        proximoAgendamento.setStatus(Agendamento.Status.PENDENTE);

        agendamentoRepository.save(proximoAgendamento);
    }

    private AgendamentoResponseDTO toDTO(Agendamento a) {
        AgendamentoResponseDTO dto = new AgendamentoResponseDTO();

        dto.setId(a.getId());
        dto.setCodigoUtente(a.getUtente().getCodigoUtente());
        dto.setNomeUtente(a.getUtente().getNome());
        dto.setNomeVacina(a.getVacina().getNome());

        if (a.getUnidadeSanitaria() != null) {
            dto.setNomeUnidade(a.getUnidadeSanitaria().getNome());
            dto.setDistrito(a.getUnidadeSanitaria().getDistrito());
            dto.setProvincia(a.getUnidadeSanitaria().getProvincia());
        }

        dto.setDataAgendada(a.getDataAgendada());
        dto.setNumeroDose(a.getNumeroDose());
        dto.setStatus(a.getStatus());
        dto.setCriadoEm(a.getCriadoEm());

        return dto;
    }

    public AgendamentoResponseDTO buscarPorId(Long id) {
        Agendamento a = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado: " + id));
        return toDTO(a);
    }
}
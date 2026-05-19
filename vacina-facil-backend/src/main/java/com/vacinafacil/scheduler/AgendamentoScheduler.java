package com.vacinafacil.scheduler;

import com.vacinafacil.model.Agendamento;
import com.vacinafacil.repository.AgendamentoRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class AgendamentoScheduler {

    private final AgendamentoRepository agendamentoRepository;

    public AgendamentoScheduler(AgendamentoRepository agendamentoRepository) {
        this.agendamentoRepository = agendamentoRepository;
    }

    // corre todos os dias à meia-noite
    @Scheduled(cron = "0 0 0 * * *")
    public void marcarAgendamentosAtrasados() {
        List<Agendamento> atrasados = agendamentoRepository
                .findByStatusAndDataAgendadaBefore(
                        Agendamento.Status.PENDENTE,
                        LocalDate.now()
                );

        for (Agendamento a : atrasados) {
            a.setStatus(Agendamento.Status.ATRASADO);
            agendamentoRepository.save(a);
        }

        System.out.println("[Scheduler] Agendamentos marcados como ATRASADO: " + atrasados.size());
    }
}
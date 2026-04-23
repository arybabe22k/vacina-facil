package com.vacinafacil.repository;

import com.vacinafacil.model.Agendamento;
import com.vacinafacil.model.Agendamento.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByUtenteId(Long utenteId);

    List<Agendamento> findByUtenteCodigoUtente(String codigoUtente);

    List<Agendamento> findByStatus(Status status);

    List<Agendamento> findByDataAgendadaBetween(LocalDate inicio, LocalDate fim);
}

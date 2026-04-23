package com.vacinafacil.dto;

import com.vacinafacil.model.Agendamento.Status;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AgendamentoResponseDTO {

    private Long id;
    private String codigoUtente;
    private String nomeUtente;
    private String nomeVacina;
    private LocalDate dataAgendada;
    private Integer numeroDose;
    private Status status;
    private LocalDateTime criadoEm;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigoUtente() { return codigoUtente; }
    public void setCodigoUtente(String codigoUtente) { this.codigoUtente = codigoUtente; }

    public String getNomeUtente() { return nomeUtente; }
    public void setNomeUtente(String nomeUtente) { this.nomeUtente = nomeUtente; }

    public String getNomeVacina() { return nomeVacina; }
    public void setNomeVacina(String nomeVacina) { this.nomeVacina = nomeVacina; }

    public LocalDate getDataAgendada() { return dataAgendada; }
    public void setDataAgendada(LocalDate dataAgendada) { this.dataAgendada = dataAgendada; }

    public Integer getNumeroDose() { return numeroDose; }
    public void setNumeroDose(Integer numeroDose) { this.numeroDose = numeroDose; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}

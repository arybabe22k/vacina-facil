package com.vacinafacil.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AgendamentoRequestDTO {

    @NotBlank(message = "O código do utente é obrigatório")
    private String codigoUtente;

    @NotNull(message = "O ID da vacina é obrigatório")
    private Long vacinaId;

    @NotNull(message = "A data agendada é obrigatória")
    private LocalDate dataAgendada;

    private Integer numeroDose;

    public String getCodigoUtente() { return codigoUtente; }
    public void setCodigoUtente(String codigoUtente) { this.codigoUtente = codigoUtente; }

    public Long getVacinaId() { return vacinaId; }
    public void setVacinaId(Long vacinaId) { this.vacinaId = vacinaId; }

    public LocalDate getDataAgendada() { return dataAgendada; }
    public void setDataAgendada(LocalDate dataAgendada) { this.dataAgendada = dataAgendada; }

    public Integer getNumeroDose() { return numeroDose; }
    public void setNumeroDose(Integer numeroDose) { this.numeroDose = numeroDose; }
}

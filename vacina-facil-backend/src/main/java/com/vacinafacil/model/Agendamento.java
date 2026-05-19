package com.vacinafacil.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacina_id", nullable = false)
    private Vacina vacina;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unidade_sanitaria_id")
    private UnidadeSanitaria unidadeSanitaria;

    @Column(name = "data_agendada", nullable = false)
    private LocalDate dataAgendada;

    @Column(name = "numero_dose", nullable = false)
    private Integer numeroDose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    public enum Status {
        PENDENTE,
        REALIZADO,
        ATRASADO,
        CANCELADO
    }

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();

        if (this.status == null) {
            this.status = Status.PENDENTE;
        }

        if (this.numeroDose == null) {
            this.numeroDose = 1;
        }
    }

    public Long getId() {
        return id;
    }

    public Utente getUtente() {
        return utente;
    }

    public Vacina getVacina() {
        return vacina;
    }

    public UnidadeSanitaria getUnidadeSanitaria() {
        return unidadeSanitaria;
    }

    public LocalDate getDataAgendada() {
        return dataAgendada;
    }

    public Integer getNumeroDose() {
        return numeroDose;
    }

    public Status getStatus() {
        return status;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public void setVacina(Vacina vacina) {
        this.vacina = vacina;
    }

    public void setUnidadeSanitaria(UnidadeSanitaria unidadeSanitaria) {
        this.unidadeSanitaria = unidadeSanitaria;
    }

    public void setDataAgendada(LocalDate dataAgendada) {
        this.dataAgendada = dataAgendada;
    }

    public void setNumeroDose(Integer numeroDose) {
        this.numeroDose = numeroDose;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
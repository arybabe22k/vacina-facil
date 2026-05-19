package com.vacinafacil.model;

import jakarta.persistence.*;

@Entity
@Table(name = "calendario_vacinal")
public class CalendarioVacinal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String idadeRecomendada;
    private String vacina;
    private String dose;
    private String observacao;
    private String grupo;

    public CalendarioVacinal() {}

    public CalendarioVacinal(String idadeRecomendada, String vacina, String dose, String observacao, String grupo) {
        this.idadeRecomendada = idadeRecomendada;
        this.vacina = vacina;
        this.dose = dose;
        this.observacao = observacao;
        this.grupo = grupo;
    }

    public Long getId() { return id; }
    public String getIdadeRecomendada() { return idadeRecomendada; }
    public String getVacina() { return vacina; }
    public String getDose() { return dose; }
    public String getObservacao() { return observacao; }
    public String getGrupo() { return grupo; }

    public void setId(Long id) { this.id = id; }
    public void setIdadeRecomendada(String idadeRecomendada) { this.idadeRecomendada = idadeRecomendada; }
    public void setVacina(String vacina) { this.vacina = vacina; }
    public void setDose(String dose) { this.dose = dose; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public void setGrupo(String grupo) { this.grupo = grupo; }
}
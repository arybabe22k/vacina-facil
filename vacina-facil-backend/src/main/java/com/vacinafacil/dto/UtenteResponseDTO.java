package com.vacinafacil.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UtenteResponseDTO {

    private Long id;
    private String codigoUtente;
    private String nome;
    private LocalDate dataNascimento;
    private String telefone;
    private String bi;
    private LocalDateTime criadoEm;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigoUtente() { return codigoUtente; }
    public void setCodigoUtente(String codigoUtente) { this.codigoUtente = codigoUtente; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getBi() { return bi; }
    public void setBi(String bi) { this.bi = bi; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}

package com.vacinafacil.model;

import jakarta.persistence.*;

@Entity
@Table(name = "unidades_sanitarias")
public class UnidadeSanitaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, length = 100)
    private String provincia;

    @Column(nullable = false, length = 100)
    private String distrito;

    @Column(length = 255)
    private String endereco;

    @Column(length = 20)
    private String telefone;

    @Column(length = 100)
    private String horario;

    private Double latitude;
    private Double longitude;

    public UnidadeSanitaria() {}

    public UnidadeSanitaria(String nome, String provincia, String distrito,
                            String endereco, String telefone, String horario,
                            Double latitude, Double longitude) {
        this.nome = nome;
        this.provincia = provincia;
        this.distrito = distrito;
        this.endereco = endereco;
        this.telefone = telefone;
        this.horario = horario;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getProvincia() { return provincia; }
    public String getDistrito() { return distrito; }
    public String getEndereco() { return endereco; }
    public String getTelefone() { return telefone; }
    public String getHorario() { return horario; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }

    public void setId(Long id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setProvincia(String provincia) { this.provincia = provincia; }
    public void setDistrito(String distrito) { this.distrito = distrito; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setHorario(String horario) { this.horario = horario; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
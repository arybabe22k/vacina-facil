package com.vacinafacil.repository;

import com.vacinafacil.model.Vacina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VacinaRepository extends JpaRepository<Vacina, Long> {
    Optional<Vacina> findByNome(String nome);
}
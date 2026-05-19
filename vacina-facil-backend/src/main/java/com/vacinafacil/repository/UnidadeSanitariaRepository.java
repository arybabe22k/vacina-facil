package com.vacinafacil.repository;

import com.vacinafacil.model.UnidadeSanitaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnidadeSanitariaRepository extends JpaRepository<UnidadeSanitaria, Long> {
    List<UnidadeSanitaria> findByProvincia(String provincia);
    List<UnidadeSanitaria> findByProvinciaAndDistrito(String provincia, String distrito);
}

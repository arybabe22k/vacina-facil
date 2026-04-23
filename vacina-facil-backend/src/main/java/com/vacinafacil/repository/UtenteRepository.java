package com.vacinafacil.repository;

import com.vacinafacil.model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtenteRepository extends JpaRepository<Utente, Long> {

    Optional<Utente> findByCodigoUtente(String codigoUtente);

    Optional<Utente> findByBi(String bi);

    Optional<Utente> findByTelefone(String telefone);

    boolean existsByCodigoUtente(String codigoUtente);

    boolean existsByBi(String bi);
}

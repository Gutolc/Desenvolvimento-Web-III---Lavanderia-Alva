package com.walkers.alva.repository;

import com.walkers.alva.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByWhatsapp(String whatsapp);
}

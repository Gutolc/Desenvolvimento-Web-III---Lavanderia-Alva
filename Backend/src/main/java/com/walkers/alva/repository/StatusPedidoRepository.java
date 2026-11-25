package com.walkers.alva.repository;

import com.walkers.alva.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StatusPedidoRepository extends JpaRepository<StatusPedido, Long> {
    Optional<StatusPedido> findByNomeStatus(String nomeStatus);
}
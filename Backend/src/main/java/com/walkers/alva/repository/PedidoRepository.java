package com.walkers.alva.repository;

import com.walkers.alva.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByCodigo(String codigo);
}
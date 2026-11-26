package com.alva.backend.repository;

import com.alva.backend.model.Pedido;
import com.alva.backend.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByStatus(StatusPedido status);

    List<Pedido> findAllByOrderByCriadoEmDesc();

    List<Pedido> findByClienteContainingIgnoreCase(String cliente);

    long countByStatus(StatusPedido status);

    @Query("SELECT p FROM Pedido p WHERE p.status = :status ORDER BY p.criadoEm ASC")
    List<Pedido> buscarFilaPorStatusOrdenadaPorEntrada(@Param("status") StatusPedido status);
}

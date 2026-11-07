package com.alva.backend.repository;

import com.alva.backend.model.Pedido;
import com.alva.backend.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByStatus(StatusPedido status);

    List<Pedido> findAllByOrderByCriadoEmDesc();
}

package com.alva.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * Entidade que representa um pedido na esteira de operação (Kanban) da lavanderia.
 * Estende BaseEntity para herdar id + criadoEm + atualizadoEm já mapeados.
 */
@Entity
@Table(name = "pedidos")
public class Pedido extends BaseEntity {

    @Column(nullable = false)
    private String cliente;

    @Column(nullable = false)
    private String servico;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusPedido status;

    public Pedido() {
    }

    public Pedido(String cliente, String servico, StatusPedido status) {
        this.cliente = cliente;
        this.servico = servico;
        this.status = status;
    }

    @PrePersist
    protected void aplicarStatusPadrao() {
        if (this.status == null) {
            this.status = StatusPedido.PENDENTE;
        }
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getServico() {
        return servico;
    }

    public void setServico(String servico) {
        this.servico = servico;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }
}

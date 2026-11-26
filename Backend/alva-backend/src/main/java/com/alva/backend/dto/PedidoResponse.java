package com.alva.backend.dto;

import com.alva.backend.model.Pedido;
import com.alva.backend.model.StatusPedido;

import java.time.LocalDateTime;

/**
 * Formato de resposta enviado ao frontend.
 * Os campos "id", "cliente", "servico" e "status" espelham exatamente
 * o que o pedidoService.js (mock) já usa, então a troca do mock pela API
 * real é transparente para o KanbanView.jsx.
 */
public class PedidoResponse {

    private Long id;
    private String cliente;
    private String servico;
    private StatusPedido status;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public PedidoResponse() {
    }

    public static PedidoResponse fromEntity(Pedido pedido) {
        PedidoResponse response = new PedidoResponse();
        response.setId(pedido.getId());
        response.setCliente(pedido.getCliente());
        response.setServico(pedido.getServico());
        response.setStatus(pedido.getStatus());
        response.setCriadoEm(pedido.getCriadoEm());
        response.setAtualizadoEm(pedido.getAtualizadoEm());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}

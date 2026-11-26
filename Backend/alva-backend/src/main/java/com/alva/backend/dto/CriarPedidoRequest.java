package com.alva.backend.dto;

import com.alva.backend.model.StatusPedido;
import jakarta.validation.constraints.NotBlank;

/**
 * Payload recebido no POST /api/pedidos
 */
public class CriarPedidoRequest {

    @NotBlank(message = "cliente é obrigatório")
    private String cliente;

    @NotBlank(message = "servico é obrigatório")
    private String servico;

    private StatusPedido status; // opcional, default PENDENTE no backend

    public CriarPedidoRequest() {
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

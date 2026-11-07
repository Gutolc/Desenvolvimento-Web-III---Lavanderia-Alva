package com.alva.backend.dto;

import com.alva.backend.model.StatusPedido;
import jakarta.validation.constraints.NotNull;

/**
 * Payload recebido no PATCH /api/pedidos/{id}/status
 * Corresponde ao body enviado pelo pedidoService.js do frontend:
 * { "status": "TRIAGEM" }
 */
public class AtualizarStatusRequest {

    @NotNull(message = "status é obrigatório")
    private StatusPedido status;

    public AtualizarStatusRequest() {
    }

    public AtualizarStatusRequest(StatusPedido status) {
        this.status = status;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }
}

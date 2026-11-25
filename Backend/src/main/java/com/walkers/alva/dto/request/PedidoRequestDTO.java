package com.walkers.alva.dto.request;

import java.util.List;

public record PedidoRequestDTO(
    String nome,
    String whatsapp,
    String email,
    String cpf,
    String coleta,
    String endereco,
    String pagamento,
    List<ItemRequestDTO> itens
) {
    public record ItemRequestDTO(Long idServico, Integer quantidade) {}
}
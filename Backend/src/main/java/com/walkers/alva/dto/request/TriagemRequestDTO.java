package com.walkers.alva.dto.request;

import java.util.List;

public record TriagemRequestDTO(Long versionPedido, List<ItemTriagemDTO> itens) {
    public record ItemTriagemDTO(Long idServico, Integer quantidade) {}
}
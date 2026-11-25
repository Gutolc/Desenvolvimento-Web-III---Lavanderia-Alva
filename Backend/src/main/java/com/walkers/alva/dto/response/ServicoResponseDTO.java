package com.walkers.alva.dto.response;

import com.walkers.alva.model.Servico;
import java.math.BigDecimal;

public record ServicoResponseDTO(
    Long id,
    Long idCategoria,
    String nomeCategoria,
    String nomePeca,
    String tipoServico,
    String unidadeCobranca,
    BigDecimal precoUnitario,
    String observacoes
) {
    public ServicoResponseDTO(Servico servico) {
        this(
            servico.getId(),
            servico.getCategoria().getId(),
            servico.getCategoria().getNomeCategoria(),
            servico.getNomePeca(),
            servico.getTipoServico(),
            servico.getUnidadeCobranca(),
            servico.getPrecoUnitario(),
            servico.getObservacoes()
        );
    }
}
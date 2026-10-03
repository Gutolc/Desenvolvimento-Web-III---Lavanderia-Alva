package com.walkers.alva.dto.response;

public record ClienteAuthResponseDTO(
        String token,
        Long clienteId,
        String nome
) {
}

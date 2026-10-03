package com.walkers.alva.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ClienteSolicitarCodigoRequestDTO(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "WhatsApp é obrigatório")
        @Pattern(regexp = "\\d{10,13}", message = "WhatsApp deve conter apenas números, com DDD (10 a 13 dígitos)")
        String whatsapp
) {
}

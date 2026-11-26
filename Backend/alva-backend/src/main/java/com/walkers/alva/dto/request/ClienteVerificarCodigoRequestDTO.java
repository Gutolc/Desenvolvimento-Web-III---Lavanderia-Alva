package com.walkers.alva.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ClienteVerificarCodigoRequestDTO(
        @NotBlank(message = "WhatsApp é obrigatório")
        @Pattern(regexp = "\\d{10,13}", message = "WhatsApp deve conter apenas números, com DDD (10 a 13 dígitos)")
        String whatsapp,

        @NotBlank(message = "Código é obrigatório")
        @Pattern(regexp = "\\d{6}", message = "Código deve conter 6 dígitos")
        String codigo
) {
}

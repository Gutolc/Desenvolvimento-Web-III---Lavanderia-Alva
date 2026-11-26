package com.walkers.alva.dto.response;

import com.walkers.alva.model.Usuario;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String perfil
) {
    public static UsuarioResponseDTO fromEntity(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil().name()
        );
    }
}

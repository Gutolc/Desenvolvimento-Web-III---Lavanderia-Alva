package com.walkers.alva.dto.response;

import com.walkers.alva.model.Funcionario;

public record FuncionarioResponseDTO(Long id, String nome, String email, String perfil) {
    public FuncionarioResponseDTO(Funcionario f) {
        this(f.getId(), f.getNome(), f.getEmail(), f.getPerfil().name());
    }
}
package com.alva.backend.model;

/**
 * Papel/cargo do colaborador dentro do sistema ALVA.
 * Usado tanto para controle de acesso (autenticação/autorização) quanto
 * para classificação do colaborador no cadastro de funcionários.
 */
public enum Role {
    ADMIN,
    GERENTE,
    SUPERVISOR,
    ATENDENTE,
    OPERADOR_LAVANDERIA
}

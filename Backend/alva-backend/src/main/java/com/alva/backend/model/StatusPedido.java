package com.alva.backend.model;

/**
 * Status possíveis de um pedido na esteira de operação (Kanban).
 * Mantido em sincronia com as colunas do frontend (kanbanConfig.js):
 * PENDENTE -> TRIAGEM -> LAVANDO -> PRONTO
 */
public enum StatusPedido {
    PENDENTE,
    TRIAGEM,
    LAVANDO,
    PRONTO
}

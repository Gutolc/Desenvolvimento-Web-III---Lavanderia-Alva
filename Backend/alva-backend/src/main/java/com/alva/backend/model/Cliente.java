package com.alva.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Entidade que representa o cliente da lavanderia (quem faz os pedidos).
 * Mapeada via JPA para a tabela "clientes".
 *
 * NOTA DE ARQUITETURA: esta entidade é independente da entidade Pedido.
 * Hoje, Pedido.cliente é um campo String simples (nome do cliente),
 * mantido assim de propósito para não quebrar o contrato já existente
 * com o frontend (pedidoService.js / KanbanView.jsx). Uma evolução
 * futura poderia substituir esse campo String por um relacionamento
 * @ManyToOne para esta entidade Cliente - isso deve ser tratado como
 * uma tarefa de refactor separada, com ajuste correspondente no DTO
 * PedidoResponse e no frontend.
 */
@Entity
@Table(name = "clientes")
public class Cliente extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @Email
    @Column(unique = true)
    private String email;

    @Column(nullable = false, length = 20)
    private String telefone;

    @Column(unique = true, length = 14)
    private String cpf;

    public Cliente() {
    }

    public Cliente(String nome, String email, String telefone, String cpf) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cpf = cpf;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
}

package com.alva.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Entidade que representa um colaborador (funcionário) da lavanderia.
 * Corresponde ao cadastro feito pela tela "Novo Colaborador" do frontend
 * (botão presente em KanbanView.jsx -> rota /cadastro-funcionario).
 *
 * Estende BaseEntity para herdar id + criadoEm + atualizadoEm.
 */
@Entity
@Table(name = "funcionarios")
public class Funcionario extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role cargo;

    @Column(nullable = false)
    private boolean ativo = true;

    public Funcionario() {
    }

    public Funcionario(String nome, String email, String senhaHash, Role cargo) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.cargo = cargo;
        this.ativo = true;
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

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public Role getCargo() {
        return cargo;
    }

    public void setCargo(Role cargo) {
        this.cargo = cargo;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}

package com.walkers.alva.model;

import jakarta.persistence.*;

@Entity
@Table(name = "status_pedido")
public class StatusPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_status")
    private Long id;

    @Column(name = "nome_status")
    private String nomeStatus;

    @Column(nullable = false)
    private Integer ordem;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeStatus() { return nomeStatus; }
    public void setNomeStatus(String nomeStatus) { this.nomeStatus = nomeStatus; }
    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
}
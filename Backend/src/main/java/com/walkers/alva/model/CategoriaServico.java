package com.walkers.alva.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria_servico")
public class CategoriaServico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long id;

    @Column(name = "nome_categoria", nullable = false, length = 50)
    private String nomeCategoria;

    @Column(name = "ordem")
    private Integer ordem;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeCategoria() { return nomeCategoria; }
    public void setNomeCategoria(String nomeCategoria) { this.nomeCategoria = nomeCategoria; }
    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
}
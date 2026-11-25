package com.walkers.alva.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "servico")
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servico")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaServico categoria;

    @Column(name = "nome_peca", nullable = false, length = 100)
    private String nomePeca;

    @Column(name = "tipo_servico", nullable = false, length = 100)
    private String tipoServico;

    @Column(name = "unidade_cobranca", nullable = false, length = 30)
    private String unidadeCobranca;

    @Column(name = "preco_unitario", nullable = false, precision = 18, scale = 2)
    private BigDecimal precoUnitario;

    @Column(name = "observacoes", length = 255)
    private String observacoes;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public CategoriaServico getCategoria() { return categoria; }
    public void setCategoria(CategoriaServico categoria) { this.categoria = categoria; }
    public String getNomePeca() { return nomePeca; }
    public void setNomePeca(String nomePeca) { this.nomePeca = nomePeca; }
    public String getTipoServico() { return tipoServico; }
    public void setTipoServico(String tipoServico) { this.tipoServico = tipoServico; }
    public String getUnidadeCobranca() { return unidadeCobranca; }
    public void setUnidadeCobranca(String unidadeCobranca) { this.unidadeCobranca = unidadeCobranca; }
    public BigDecimal getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
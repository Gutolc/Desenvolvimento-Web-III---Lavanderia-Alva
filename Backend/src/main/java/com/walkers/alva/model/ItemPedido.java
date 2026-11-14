package com.walkers.alva.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "item_pedido")
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_servico", nullable = false)
    private Servico servico;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "valor_cobrado", nullable = false)
    private BigDecimal valorCobrado;

    @Column(nullable = false)
    private BigDecimal subtotal;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    public Servico getServico() { return servico; }
    public void setServico(Servico servico) { this.servico = servico; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public BigDecimal getValorCobrado() { return valorCobrado; }
    public void setValorCobrado(BigDecimal valorCobrado) { this.valorCobrado = valorCobrado; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
package com.walkers.alva.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_funcionario_triagem", nullable = false)
    private Funcionario funcionarioTriagem;

    @ManyToOne
    @JoinColumn(name = "id_status_atual", nullable = false)
    private StatusPedido statusAtual;

    @Column(nullable = false)
    private String pagamento;

    @Column(name = "data_abertura", nullable = false)
    private LocalDateTime dataAbertura = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public Funcionario getFuncionarioTriagem() { return funcionarioTriagem; }
    public void setFuncionarioTriagem(Funcionario funcionarioTriagem) { this.funcionarioTriagem = funcionarioTriagem; }
    public StatusPedido getStatusAtual() { return statusAtual; }
    public void setStatusAtual(StatusPedido statusAtual) { this.statusAtual = statusAtual; }
    public String getPagamento() { return pagamento; }
    public void setPagamento(String pagamento) { this.pagamento = pagamento; }
    public LocalDateTime getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDateTime dataAbertura) { this.dataAbertura = dataAbertura; }
    public List<ItemPedido> getItens() { return itens; }
    public void setItens(List<ItemPedido> itens) { this.itens = itens; }
}
package com.walkers.alva.dto.response;

import com.walkers.alva.model.Pedido;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public record PedidoResponseDTO(
    String codigo,
    String criadoEm,
    String status,
    String pagamento,
    BigDecimal total,
    ClienteDTO cliente,
    List<ItemDTO> itens
) {
    public record ClienteDTO(String nome, String whatsapp, String email, String endereco) {}
    public record ItemDTO(String nome, String modalidade, Integer quantidade, BigDecimal preco) {}

    public PedidoResponseDTO(Pedido p) {
        this(
            p.getCodigo(),
            p.getDataAbertura().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
            p.getStatusAtual().getNomeStatus(),
            p.getPagamento(),
            p.getItens().stream().map(i -> i.getSubtotal()).reduce(BigDecimal.ZERO, BigDecimal::add),
            new ClienteDTO(p.getCliente().getNome(), p.getCliente().getNumero(), p.getCliente().getEmail(), p.getCliente().getEndereco()),
            p.getItens().stream().map(i -> new ItemDTO(
                i.getServico().getNomePeca(), 
                i.getServico().getTipoServico(), 
                i.getQuantidade(), 
                i.getValorCobrado()
            )).collect(Collectors.toList())
        );
    }
}
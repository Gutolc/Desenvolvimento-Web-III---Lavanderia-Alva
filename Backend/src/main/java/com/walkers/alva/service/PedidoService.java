package com.walkers.alva.service;

import com.walkers.alva.dto.request.PedidoRequestDTO;
import com.walkers.alva.dto.request.TriagemRequestDTO;
import com.walkers.alva.dto.response.PedidoResponseDTO;
import com.walkers.alva.model.*;
import com.walkers.alva.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ServicoRepository servicoRepository;
    private final StatusPedidoRepository statusRepository;
    private final FuncionarioRepository funcionarioRepository;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
                         ServicoRepository servicoRepository, StatusPedidoRepository statusRepository,
                         FuncionarioRepository funcionarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.servicoRepository = servicoRepository;
        this.statusRepository = statusRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO dto) {
        // 1. Salvar o Cliente
        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());
        cliente.setNumero(dto.whatsapp());
        cliente.setEmail(dto.email());
        cliente.setCpf(dto.cpf());
        cliente.setEndereco(dto.endereco());
        cliente = clienteRepository.save(cliente);

        Funcionario sistema = funcionarioRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Funcionário Sistema não encontrado"));
        StatusPedido statusInicial = statusRepository.findByNomeStatus("Recebido")
                .orElseGet(() -> {
                    StatusPedido s = new StatusPedido();
                    s.setNomeStatus("Recebido");
                    s.setOrdem(1);
                    return statusRepository.save(s);
                });

        // 3. Criar o Pedido
        Pedido pedido = new Pedido();
        pedido.setCodigo("ALV-" + (1000 + new Random().nextInt(9000))); // Gera ALV-XXXX
        pedido.setCliente(cliente);
        pedido.setFuncionarioTriagem(sistema);
        pedido.setStatusAtual(statusInicial);
        pedido.setPagamento(dto.pagamento());
        pedido.setDataAbertura(LocalDateTime.now());
        
        List<ItemPedido> itens = new ArrayList<>();

        // 4. Processar os Itens
        for (PedidoRequestDTO.ItemRequestDTO itemDto : dto.itens()) {
            Servico servico = servicoRepository.findById(itemDto.idServico())
                    .orElseThrow(() -> new RuntimeException("Serviço não encontrado: " + itemDto.idServico()));

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setServico(servico);
            item.setQuantidade(itemDto.quantidade());
            item.setValorCobrado(servico.getPrecoUnitario());
            item.setSubtotal(servico.getPrecoUnitario().multiply(BigDecimal.valueOf(itemDto.quantidade())));
            itens.add(item);
        }
        pedido.setItens(itens);

        // 5. Salvar tudo no banco
        pedido = pedidoRepository.save(pedido);
        
        return new PedidoResponseDTO(pedido);
    }

    public PedidoResponseDTO buscarPorCodigo(String codigo) {
        Pedido pedido = pedidoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        return new PedidoResponseDTO(pedido);
    }
        public List<PedidoResponseDTO> listarTodos() {
        // Busca todos os pedidos do banco e converte para DTO
        return pedidoRepository.findAll().stream()
                .map(PedidoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public PedidoResponseDTO atualizarStatus(String codigo, String novoStatus) {
        Pedido pedido = pedidoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        StatusPedido status = statusRepository.findByNomeStatus(novoStatus)
                .orElseGet(() -> {
                    StatusPedido novo = new StatusPedido();
                    novo.setNomeStatus(novoStatus);
                    novo.setOrdem(1); 
                    return statusRepository.save(novo);
                });

        pedido.setStatusAtual(status);
        
        if (pedido.getItens() != null) {
            pedido.getItens().forEach(item -> item.getServico().getNomePeca());
        }

        pedido = pedidoRepository.save(pedido);
        
        return new PedidoResponseDTO(pedido);
    }

       public PedidoResponseDTO realizarTriagem(String codigo, TriagemRequestDTO dto) {
        Pedido pedido = pedidoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (!java.util.Objects.equals(pedido.getVersion(), dto.versionPedido())) {
            throw new org.springframework.dao.OptimisticLockingFailureException("Conflito de edição simultânea.");
        }

        pedido.getItens().clear();

        for (TriagemRequestDTO.ItemTriagemDTO itemDto : dto.itens()) {
            com.walkers.alva.model.Servico servico = servicoRepository.findById(itemDto.idServico())
                    .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

            com.walkers.alva.model.ItemPedido novoItem = new com.walkers.alva.model.ItemPedido();
            novoItem.setPedido(pedido);
            novoItem.setServico(servico);
            novoItem.setQuantidade(itemDto.quantidade());
            novoItem.setValorCobrado(servico.getPrecoUnitario());
            novoItem.setSubtotal(servico.getPrecoUnitario().multiply(java.math.BigDecimal.valueOf(itemDto.quantidade())));
            
            pedido.getItens().add(novoItem);
        }

        com.walkers.alva.model.StatusPedido statusAndamento = statusRepository.findByNomeStatus("Em Andamento")
                .orElseThrow(() -> new RuntimeException("Status 'Em Andamento' não cadastrado"));
        pedido.setStatusAtual(statusAndamento);

        pedido = pedidoRepository.save(pedido);
        return new PedidoResponseDTO(pedido);
        }

    @Transactional
    public void excluirPedido(String codigo) {
        Pedido pedido = pedidoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedidoRepository.delete(pedido);
    }
}
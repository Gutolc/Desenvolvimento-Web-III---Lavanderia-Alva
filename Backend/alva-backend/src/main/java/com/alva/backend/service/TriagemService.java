package com.alva.backend.service;

import com.alva.backend.dto.EditarPecasRequest;
import com.alva.backend.event.PedidoAguardandoAprovacaoEvent;
import com.alva.backend.model.Pedido;
import com.alva.backend.model.StatusPedido;
import com.alva.backend.repository.PedidoRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TriagemService {

    private final PedidoService pedidoService;
    private final PedidoRepository pedidoRepository;
    private final ApplicationEventPublisher eventPublisher;

    public TriagemService(PedidoService pedidoService,
                          PedidoRepository pedidoRepository,
                          ApplicationEventPublisher eventPublisher) {
        this.pedidoService = pedidoService;
        this.pedidoRepository = pedidoRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public Pedido editarPecas(Long id, EditarPecasRequest request) {
        if (request.servico() == null || request.servico().isBlank()) {
            throw new IllegalArgumentException("A descricao das pecas nao pode ficar vazia");
        }

        Pedido pedido = pedidoService.buscarPorId(id);
        pedido.setServico(request.servico().trim());
        pedido.setStatus(StatusPedido.AGUARDANDO_APROVACAO);
        Pedido salvo = pedidoRepository.save(pedido);

        eventPublisher.publishEvent(
            new PedidoAguardandoAprovacaoEvent(salvo.getId(), salvo.getCliente()));
        return salvo;
    }
}
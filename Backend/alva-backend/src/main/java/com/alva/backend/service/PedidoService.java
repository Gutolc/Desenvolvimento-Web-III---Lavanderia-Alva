package com.alva.backend.service;

import com.alva.backend.dto.CriarPedidoRequest;
import com.alva.backend.model.Pedido;
import com.alva.backend.model.StatusPedido;
import com.alva.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    @Autowired
    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAllByOrderByCriadoEmDesc();
    }

    public List<Pedido> listarPorStatus(StatusPedido status) {
        return pedidoRepository.findByStatus(status);
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNaoEncontradoException(id));
    }

    public Pedido criar(CriarPedidoRequest request) {
        StatusPedido statusInicial = request.getStatus() != null
                ? request.getStatus()
                : StatusPedido.PENDENTE;

        Pedido pedido = new Pedido(request.getCliente(), request.getServico(), statusInicial);
        return pedidoRepository.save(pedido);
    }

    public Pedido atualizarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = buscarPorId(id);
        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }

    public void deletar(Long id) {
        Pedido pedido = buscarPorId(id);
        pedidoRepository.delete(pedido);
    }
}

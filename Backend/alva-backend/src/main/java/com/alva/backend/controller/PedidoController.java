package com.alva.backend.controller;

import com.alva.backend.dto.AtualizarStatusRequest;
import com.alva.backend.dto.CriarPedidoRequest;
import com.alva.backend.dto.PedidoResponse;
import com.alva.backend.model.Pedido;
import com.alva.backend.model.StatusPedido;
import com.alva.backend.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Endpoints consumidos pelo frontend em
 * Frontend/alva-frontend/src/services/pedidoService.js
 *
 * GET    /api/pedidos                  -> listarPedidos()
 * PATCH  /api/pedidos/{id}/status      -> atualizarStatusPedido(id, status)
 * POST   /api/pedidos                  -> criação de pedido (uso futuro/admin)
 * GET    /api/pedidos/{id}             -> detalhe de um pedido
 * DELETE /api/pedidos/{id}             -> remoção (uso futuro/admin)
 */
@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*") // ajustar para o domínio do frontend em produção
public class PedidoController {

    private final PedidoService pedidoService;

    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar(
            @RequestParam(required = false) StatusPedido status) {

        List<Pedido> pedidos = status != null
                ? pedidoService.listarPorStatus(status)
                : pedidoService.listarTodos();

        List<PedidoResponse> response = pedidos.stream()
                .map(PedidoResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscarPorId(@PathVariable Long id) {
        Pedido pedido = pedidoService.buscarPorId(id);
        return ResponseEntity.ok(PedidoResponse.fromEntity(pedido));
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> criar(@Valid @RequestBody CriarPedidoRequest request) {
        Pedido pedido = pedidoService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(PedidoResponse.fromEntity(pedido));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoResponse> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarStatusRequest request) {

        Pedido pedido = pedidoService.atualizarStatus(id, request.getStatus());
        return ResponseEntity.ok(PedidoResponse.fromEntity(pedido));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pedidoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

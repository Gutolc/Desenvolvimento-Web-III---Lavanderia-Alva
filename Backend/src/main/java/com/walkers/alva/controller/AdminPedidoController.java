package com.walkers.alva.controller;

import com.walkers.alva.dto.request.AtualizarStatusDTO;
import com.walkers.alva.dto.request.TriagemRequestDTO;
import com.walkers.alva.dto.response.PedidoResponseDTO;
import com.walkers.alva.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pedidos")
public class AdminPedidoController {

    private final PedidoService pedidoService;

    public AdminPedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // Rota para listar todos os pedidos no Kanban
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    // Rota para mover o card e atualizar o status
    @PutMapping("/{codigo}/status")
    public ResponseEntity<PedidoResponseDTO> atualizarStatus(
            @PathVariable String codigo,
            @RequestBody AtualizarStatusDTO dto) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(codigo, dto.status()));
    }
    // Rota para triagem
        @PutMapping("/{codigo}/triagem")
    public ResponseEntity<PedidoResponseDTO> realizarTriagem(
            @PathVariable String codigo,
            @RequestBody TriagemRequestDTO dto) {
        return ResponseEntity.ok(pedidoService.realizarTriagem(codigo, dto));
    }
    //rota para delete
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> excluir(@PathVariable String codigo) {
        pedidoService.excluirPedido(codigo);
        return ResponseEntity.noContent().build();
    }
}
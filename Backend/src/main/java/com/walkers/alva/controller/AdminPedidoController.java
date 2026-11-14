package com.walkers.alva.controller;

import com.walkers.alva.dto.request.AtualizarStatusDTO;
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
}
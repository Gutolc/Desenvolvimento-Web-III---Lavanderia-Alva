package com.walkers.alva.controller;

import com.walkers.alva.dto.request.PedidoRequestDTO;
import com.walkers.alva.dto.response.PedidoResponseDTO;
import com.walkers.alva.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criar(@RequestBody PedidoRequestDTO dto) {
        return ResponseEntity.ok(pedidoService.criarPedido(dto));
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<PedidoResponseDTO> buscar(@PathVariable String codigo) {
        return ResponseEntity.ok(pedidoService.buscarPorCodigo(codigo));
    }
}
package com.walkers.alva.controller;

import com.walkers.alva.dto.response.ServicoResponseDTO;
import com.walkers.alva.model.CategoriaServico;
import com.walkers.alva.repository.CategoriaServicoRepository;
import com.walkers.alva.repository.ServicoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogoController {

    private final CategoriaServicoRepository categoriaRepository;
    private final ServicoRepository servicoRepository;

    public CatalogoController(CategoriaServicoRepository categoriaRepository, ServicoRepository servicoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.servicoRepository = servicoRepository;
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaServico>> listarCategorias() {
        return ResponseEntity.ok(categoriaRepository.findAllByOrderByOrdemAsc());
    }

    @GetMapping("/servicos")
    public ResponseEntity<List<ServicoResponseDTO>> listarServicos() {
        List<ServicoResponseDTO> servicos = servicoRepository.findByAtivoTrue()
                .stream()
                .map(ServicoResponseDTO::new)
                .toList();
        return ResponseEntity.ok(servicos);
    }
}
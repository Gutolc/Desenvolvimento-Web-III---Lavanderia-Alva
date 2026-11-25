package com.walkers.alva.controller;

import com.walkers.alva.dto.request.FuncionarioRequestDTO;
import com.walkers.alva.dto.response.FuncionarioResponseDTO;
import com.walkers.alva.model.Funcionario;
import com.walkers.alva.model.PerfilEnum;
import com.walkers.alva.repository.FuncionarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/funcionarios")
public class AdminFuncionarioController {

    private final FuncionarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdminFuncionarioController(FuncionarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResponseDTO>> listar() {
        List<FuncionarioResponseDTO> lista = repository.findAll().stream()
                .map(FuncionarioResponseDTO::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponseDTO> criar(@RequestBody FuncionarioRequestDTO dto) {
        if (repository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado no sistema.");
        }
        Funcionario novo = new Funcionario();
        novo.setNome(dto.nome());
        novo.setEmail(dto.email());
        novo.setSenhaHash(passwordEncoder.encode(dto.senha()));
        novo.setPerfil(PerfilEnum.valueOf(dto.perfil()));
        
        novo = repository.save(novo);
        return ResponseEntity.ok(new FuncionarioResponseDTO(novo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (id == 1L || id == 2L) { // Protege o Sistema (1) e Admin Master (2)
            throw new RuntimeException("Não é possível excluir o usuário administrador principal.");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
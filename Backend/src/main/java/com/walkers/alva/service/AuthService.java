package com.walkers.alva.service;

import com.walkers.alva.dto.request.LoginRequestDTO;
import com.walkers.alva.dto.response.AuthResponseDTO;
import com.walkers.alva.model.Funcionario;
import com.walkers.alva.repository.FuncionarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final FuncionarioRepository funcionarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            FuncionarioRepository funcionarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.funcionarioRepository = funcionarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO autenticar(LoginRequestDTO loginRequestDTO) {
        // Busca na tabela funcionario (e não mais usuarios)
        Funcionario funcionario = funcionarioRepository.findByEmail(loginRequestDTO.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(loginRequestDTO.senha(), funcionario.getSenhaHash())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = jwtService.gerarToken(funcionario);
        return new AuthResponseDTO(token, funcionario.getPerfil().name());
    }
}
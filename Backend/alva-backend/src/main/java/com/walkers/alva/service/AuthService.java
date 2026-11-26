package com.walkers.alva.service;

import com.walkers.alva.dto.request.LoginRequestDTO;
import com.walkers.alva.dto.response.AuthResponseDTO;
import com.walkers.alva.model.Usuario;
import com.walkers.alva.repository.UsuarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

private final UsuarioRepository usuarioRepository;
private final PasswordEncoder passwordEncoder;
private final JwtService jwtService;

public AuthService(
        UsuarioRepository usuarioRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

    public AuthResponseDTO autenticar(LoginRequestDTO loginRequestDTO) {
        // 1. Verificando o que está chegando do Postman/CMD
        System.out.println("--- INICIANDO LOGIN ---");
        System.out.println("Email recebido: [" + loginRequestDTO.email() + "]");
        System.out.println("Senha recebida: [" + loginRequestDTO.senha() + "]");

        // 2. Verificando se acha no banco
        Usuario usuario = usuarioRepository.findByEmail(loginRequestDTO.email())
                .orElseThrow(() -> {
                    System.out.println("ERRO: E-mail não encontrado no banco de dados!");
                    return new BadCredentialsException("Credenciais inválidas");
                });

        // 3. Verificando se as senhas batem
        System.out.println("Usuario encontrado! ID: " + usuario.getId());
        System.out.println("Hash salvo no banco: [" + usuario.getSenhaHash() + "]");

        boolean senhaBate = passwordEncoder.matches(loginRequestDTO.senha(), usuario.getSenhaHash());
        System.out.println("A criptografia bateu? " + senhaBate);

        if (!senhaBate) {
            System.out.println("ERRO: A senha não bate com o hash!");
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = jwtService.gerarToken(usuario);
        System.out.println("--- LOGIN BEM SUCEDIDO ---");
        return new AuthResponseDTO(token, usuario.getPerfil().name());
}
}

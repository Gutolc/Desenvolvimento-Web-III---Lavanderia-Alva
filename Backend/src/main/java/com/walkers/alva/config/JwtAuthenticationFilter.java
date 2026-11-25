package com.walkers.alva.config;

import com.walkers.alva.model.Funcionario;
import com.walkers.alva.repository.FuncionarioRepository;
import com.walkers.alva.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final FuncionarioRepository funcionarioRepository;

    public JwtAuthenticationFilter(JwtService jwtService, FuncionarioRepository funcionarioRepository) {
        this.jwtService = jwtService;
        this.funcionarioRepository = funcionarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtService.validarToken(token)) {
                String email = jwtService.extrairEmail(token);
                Funcionario funcionario = funcionarioRepository.findByEmail(email).orElse(null);

                if (funcionario != null) {
                    // Autentica o usuário no contexto do Spring
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            funcionario, null, funcionario.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        filterChain.doFilter(request, response); // Continua a requisição
    }
}
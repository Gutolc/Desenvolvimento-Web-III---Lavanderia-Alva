package com.walkers.alva.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ClienteJwtService {

    @Value("${alva.cliente.jwt.secret}")
    private String secret;

    @Value("${alva.cliente.jwt.expiration-ms}")
    private long expirationMs;

    private Algorithm algorithm() {
        return Algorithm.HMAC256(secret);
    }

    public String gerarToken(Long clienteId, String nome, String whatsapp) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expirationMs);

        return JWT.create()
                .withSubject(whatsapp)
                .withClaim("clienteId", clienteId)
                .withClaim("nome", nome)
                .withIssuedAt(agora)
                .withExpiresAt(expiracao)
                .sign(algorithm());
    }

    public DecodedJWT validarToken(String token) {
        try {
            return JWT.require(algorithm())
                    .build()
                    .verify(token);
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public Long extrairClienteId(String token) {
        DecodedJWT jwt = validarToken(token);
        return jwt != null ? jwt.getClaim("clienteId").asLong() : null;
    }
}

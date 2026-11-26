package com.walkers.alva.controller;

import com.walkers.alva.dto.request.ClienteSolicitarCodigoRequestDTO;
import com.walkers.alva.dto.request.ClienteVerificarCodigoRequestDTO;
import com.walkers.alva.dto.response.ClienteAuthResponseDTO;
import com.walkers.alva.service.ClienteAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/clientes/auth")
public class ClienteAuthController {

    private final ClienteAuthService clienteAuthService;

    public ClienteAuthController(ClienteAuthService clienteAuthService) {
        this.clienteAuthService = clienteAuthService;
    }

    /**
     * Passo 1 — gera o código e envia pelo canal configurado (WhatsApp/SMS/console).
     * Resposta genérica de propósito: não confirma nem nega se o número já
     * tem cadastro, para não vazar essa informação.
     */
    @PostMapping("/solicitar-codigo")
    public ResponseEntity<Map<String, String>> solicitarCodigo(@Valid @RequestBody ClienteSolicitarCodigoRequestDTO dto) {
        clienteAuthService.solicitarCodigo(dto);
        return ResponseEntity.ok(Map.of(
                "mensagem", "Enviamos um código de acesso para o WhatsApp informado."
        ));
    }

    /**
     * Passo 2 — confirma o código e devolve o token de acesso do cliente.
     */
    @PostMapping("/verificar-codigo")
    public ResponseEntity<ClienteAuthResponseDTO> verificarCodigo(@Valid @RequestBody ClienteVerificarCodigoRequestDTO dto) {
        return ResponseEntity.ok(clienteAuthService.verificarCodigo(dto));
    }
}

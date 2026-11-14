package com.walkers.alva.controller;

import com.walkers.alva.service.WebhookWhatsappService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhook/whatsapp")
public class WebhookWhatsappController {

    private final WebhookWhatsappService service;

    public WebhookWhatsappController(WebhookWhatsappService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<String> verificar(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String token,
            @RequestParam(name = "hub.challenge", required = false) String challenge) {

        if (challenge != null && service.tokenValido(mode, token)) {
            return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(challenge);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PostMapping
    public ResponseEntity<Void> receber(
            @RequestBody byte[] corpo,
            @RequestHeader(name = "X-Hub-Signature-256", required = false) String assinatura) {

        if (!service.assinaturaValida(corpo, assinatura)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        service.processar(corpo);
        return ResponseEntity.ok().build();
    }
}
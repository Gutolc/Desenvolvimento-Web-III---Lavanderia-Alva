package com.walkers.alva.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.walkers.alva.event.MensagemWhatsappRecebidaEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

@Service
public class WebhookWhatsappService {

    private static final Logger log = LoggerFactory.getLogger(WebhookWhatsappService.class);

    private final ApplicationEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;
    private final String verifyToken;
    private final String appSecret;

    public WebhookWhatsappService(ApplicationEventPublisher eventPublisher,
                                  ObjectMapper objectMapper,
                                  @Value("${alva.meta.verify-token:}") String verifyToken,
                                  @Value("${alva.meta.app-secret:}") String appSecret) {
        this.eventPublisher = eventPublisher;
        this.objectMapper = objectMapper;
        this.verifyToken = verifyToken;
        this.appSecret = appSecret;
    }

    public boolean tokenValido(String mode, String token) {
        return "subscribe".equals(mode)
                && !verifyToken.isBlank()
                && token != null
                && MessageDigest.isEqual(
                        verifyToken.getBytes(StandardCharsets.UTF_8),
                        token.getBytes(StandardCharsets.UTF_8));
    }

    public boolean assinaturaValida(byte[] corpo, String cabecalho) {
        if (appSecret.isBlank() || cabecalho == null || !cabecalho.startsWith("sha256=")) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(appSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String esperado = "sha256=" + HexFormat.of().formatHex(mac.doFinal(corpo));
            return MessageDigest.isEqual(
                    esperado.getBytes(StandardCharsets.UTF_8),
                    cabecalho.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Falha ao validar assinatura do webhook", e);
            return false;
        }
    }

    public void processar(byte[] corpo) {
        try {
            JsonNode raiz = objectMapper.readTree(corpo);
            for (JsonNode entry : raiz.path("entry")) {
                for (JsonNode change : entry.path("changes")) {
                    for (JsonNode msg : change.path("value").path("messages")) {
                        eventPublisher.publishEvent(new MensagemWhatsappRecebidaEvent(
                                msg.path("from").asText(),
                                msg.path("id").asText(),
                                msg.path("type").asText(),
                                msg.path("text").path("body").asText("")));
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Payload do webhook invalido: {}", e.getMessage());
        }
    }
}
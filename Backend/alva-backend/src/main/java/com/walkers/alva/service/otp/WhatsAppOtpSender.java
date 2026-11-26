package com.walkers.alva.service.otp;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Envia o código de acesso via WhatsApp Cloud API (Meta), conforme definido
 * na arquitetura do projeto (Camada de Integração — Mensageria e Webhooks).
 *
 * Ativado com alva.otp.canal=whatsapp. Exige as credenciais reais da Meta
 * em alva.whatsapp.phone-number-id e alva.whatsapp.token (ou as variáveis
 * de ambiente WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_TOKEN).
 */
@Service
@ConditionalOnProperty(name = "alva.otp.canal", havingValue = "whatsapp")
public class WhatsAppOtpSender implements OtpSender {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppOtpSender.class);

    @Value("${alva.whatsapp.api-url}")
    private String apiUrl;

    @Value("${alva.whatsapp.phone-number-id}")
    private String phoneNumberId;

    @Value("${alva.whatsapp.token}")
    private String token;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void enviar(String whatsapp, String codigo) {
        if (token == null || token.isBlank() || phoneNumberId == null || phoneNumberId.isBlank()) {
            throw new IllegalStateException(
                    "alva.otp.canal está como 'whatsapp', mas as credenciais da WhatsApp Cloud API " +
                    "(alva.whatsapp.token / alva.whatsapp.phone-number-id) não foram configuradas.");
        }

        try {
            String corpoMensagem = "Seu código de acesso Alva é: " + codigo
                    + ". Ele expira em alguns minutos. Não compartilhe esse código.";

            Map<String, Object> texto = new LinkedHashMap<>();
            texto.put("body", corpoMensagem);

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("messaging_product", "whatsapp");
            payload.put("to", whatsapp);
            payload.put("type", "text");
            payload.put("text", texto);

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl + "/" + phoneNumberId + "/messages"))
                    .timeout(Duration.ofSeconds(10))
                    .header("Authorization", "Bearer " + token)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                log.error("Falha ao enviar código via WhatsApp Cloud API. Status={} Corpo={}",
                        response.statusCode(), response.body());
                throw new RuntimeException("Não foi possível enviar o código via WhatsApp no momento.");
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erro inesperado ao chamar a WhatsApp Cloud API", e);
            throw new RuntimeException("Não foi possível enviar o código via WhatsApp no momento.", e);
        }
    }
}

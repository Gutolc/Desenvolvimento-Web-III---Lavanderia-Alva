package com.walkers.alva.service.otp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * Canal usado em desenvolvimento/testes, quando ainda não há credenciais da
 * WhatsApp Cloud API configuradas. Em vez de enviar de verdade, imprime o
 * código no log da aplicação — assim dá pra testar o fluxo completo de
 * login sem depender de nenhum serviço externo.
 *
 * É o canal padrão (alva.otp.canal=console). NÃO deve ser usado em produção.
 */
@Service
@ConditionalOnProperty(name = "alva.otp.canal", havingValue = "console", matchIfMissing = true)
public class ConsoleOtpSender implements OtpSender {

    private static final Logger log = LoggerFactory.getLogger(ConsoleOtpSender.class);

    @Override
    public void enviar(String whatsapp, String codigo) {
        log.info("[OTP-DEV] Código de acesso para {}: {} (válido pelos próximos minutos configurados em alva.otp.expiracao-minutos)",
                whatsapp, codigo);
    }
}

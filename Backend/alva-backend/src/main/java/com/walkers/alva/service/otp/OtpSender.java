package com.walkers.alva.service.otp;

/**
 * Abstração do canal usado para entregar o código de acesso ao cliente.
 * A lógica de autenticação (ClienteAuthService) não sabe e não precisa saber
 * se o código foi enviado por WhatsApp, SMS ou impresso no console — ela só
 * depende desta interface. Novos canais (ex: um provedor de SMS) são
 * adicionados implementando-a, sem tocar no restante do fluxo.
 */
public interface OtpSender {
    void enviar(String whatsapp, String codigo);
}

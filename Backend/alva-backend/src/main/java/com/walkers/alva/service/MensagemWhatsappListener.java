package com.walkers.alva.service;

import com.walkers.alva.event.MensagemWhatsappRecebidaEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class MensagemWhatsappListener {

    private static final Logger log = LoggerFactory.getLogger(MensagemWhatsappListener.class);

    @EventListener
    public void aoReceberMensagem(MensagemWhatsappRecebidaEvent evento) {
        log.info("Mensagem WhatsApp recebida: id={} tipo={}", evento.idMensagem(), evento.tipo());
    }
}
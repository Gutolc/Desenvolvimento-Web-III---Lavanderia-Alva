package com.alva.backend.service;

import com.alva.backend.event.PedidoAguardandoAprovacaoEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class PedidoMensageriaListener {

    private static final Logger log = LoggerFactory.getLogger(PedidoMensageriaListener.class);

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void aoAguardarAprovacao(PedidoAguardandoAprovacaoEvent evento) {
        log.info("Pedido {} de {} aguardando aprovacao do cliente",
                evento.pedidoId(), evento.cliente());
    }
}
package com.walkers.alva.event;

public record MensagemWhatsappRecebidaEvent(String de, String idMensagem, String tipo, String texto) {}
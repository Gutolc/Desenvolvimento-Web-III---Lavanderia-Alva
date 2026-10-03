package com.walkers.alva.exception;

public class MuitasTentativasException extends RuntimeException {
    public MuitasTentativasException() {
        super("Número máximo de tentativas excedido. Solicite um novo código.");
    }
}

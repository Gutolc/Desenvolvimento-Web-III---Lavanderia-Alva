package com.walkers.alva.exception;

public class CodigoInvalidoException extends RuntimeException {
    public CodigoInvalidoException() {
        super("Código inválido. Verifique o número recebido e tente novamente.");
    }
}

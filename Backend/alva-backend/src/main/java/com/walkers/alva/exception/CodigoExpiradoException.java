package com.walkers.alva.exception;

public class CodigoExpiradoException extends RuntimeException {
    public CodigoExpiradoException() {
        super("Esse código expirou. Solicite um novo.");
    }
}

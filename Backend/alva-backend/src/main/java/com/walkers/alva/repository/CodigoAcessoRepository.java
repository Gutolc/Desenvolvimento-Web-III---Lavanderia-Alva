package com.walkers.alva.repository;

import com.walkers.alva.model.CodigoAcesso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CodigoAcessoRepository extends JpaRepository<CodigoAcesso, Long> {
    Optional<CodigoAcesso> findFirstByWhatsappAndUsadoFalseOrderByCriadoEmDesc(String whatsapp);
}

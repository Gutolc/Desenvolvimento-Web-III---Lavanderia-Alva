package com.walkers.alva.repository;

import com.walkers.alva.model.CategoriaServico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoriaServicoRepository extends JpaRepository<CategoriaServico, Long> {
    List<CategoriaServico> findAllByOrderByOrdemAsc();
}
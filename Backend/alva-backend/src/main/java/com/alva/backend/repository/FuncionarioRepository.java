package com.alva.backend.repository;

import com.alva.backend.model.Funcionario;
import com.alva.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Optional<Funcionario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Funcionario> findByAtivoTrue();

    List<Funcionario> findByCargo(Role cargo);
}

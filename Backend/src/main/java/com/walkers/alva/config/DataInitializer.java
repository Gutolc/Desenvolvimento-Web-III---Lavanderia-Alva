package com.walkers.alva.config;

import com.walkers.alva.model.Funcionario;
import com.walkers.alva.model.PerfilEnum;
import com.walkers.alva.repository.FuncionarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final FuncionarioRepository funcionarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(FuncionarioRepository funcionarioRepository, PasswordEncoder passwordEncoder) {
        this.funcionarioRepository = funcionarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println(">>> INICIANDO DATA INITIALIZER <<<");
        
        // Busca o admin ou cria um novo se não existir
        Funcionario admin = funcionarioRepository.findByEmail("admin@alva.com.br").orElse(new Funcionario());
        
        admin.setNome("Administrador");
        admin.setEmail("admin@alva.com.br");
        admin.setSenhaHash(passwordEncoder.encode("Alva@2026")); // Força o hash correto
        admin.setPerfil(PerfilEnum.ADMIN);
        
        funcionarioRepository.save(admin);
        log.info("Admin criado/atualizado com sucesso: admin@alva.com.br");
    }
}
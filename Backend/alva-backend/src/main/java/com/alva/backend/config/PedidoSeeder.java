package com.alva.backend.config;

import com.alva.backend.model.Pedido;
import com.alva.backend.model.StatusPedido;
import com.alva.backend.repository.PedidoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Popula a tabela de pedidos com dados de exemplo (apenas se estiver vazia).
 * Útil para desenvolvimento/demonstração do Kanban sem precisar cadastrar
 * pedidos manualmente. Ativo nos perfis "dev" e "default" (ver application.properties).
 * Em produção, remova a anotação @Profile ou ajuste para não executar.
 */
@Configuration
public class PedidoSeeder {

    @Bean
    @Profile({"dev", "default"})
    public CommandLineRunner seedPedidos(PedidoRepository pedidoRepository) {
        return args -> {
            if (pedidoRepository.count() > 0) {
                return;
            }

            pedidoRepository.save(new Pedido("Maria Souza", "Lavagem + Secagem", StatusPedido.PENDENTE));
            pedidoRepository.save(new Pedido("João Pereira", "Lavagem a seco", StatusPedido.PENDENTE));
            pedidoRepository.save(new Pedido("Ana Lima", "Passadoria", StatusPedido.TRIAGEM));
            pedidoRepository.save(new Pedido("Carlos Dias", "Lavagem + Secagem", StatusPedido.LAVANDO));
            pedidoRepository.save(new Pedido("Beatriz Alves", "Edredom", StatusPedido.LAVANDO));
            pedidoRepository.save(new Pedido("Rafael Nunes", "Lavagem a seco", StatusPedido.PRONTO));
        };
    }
}

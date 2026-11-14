USE alva;

-- 1. Remover todas as FKs
ALTER TABLE historico_status DROP FOREIGN KEY fk_id_funcionario;
ALTER TABLE historico_status DROP FOREIGN KEY fk_id_pedidoh;
ALTER TABLE historico_status DROP FOREIGN KEY fk_id_status;
ALTER TABLE item_pedido DROP FOREIGN KEY fk_id_pedido;
ALTER TABLE item_pedido DROP FOREIGN KEY fk_id_servico;
ALTER TABLE notificacao DROP FOREIGN KEY fk_notificacao_pedido;
ALTER TABLE notificacao DROP FOREIGN KEY fk_notificacao_cliente;
ALTER TABLE pedido DROP FOREIGN KEY FK_cliente;
ALTER TABLE pedido DROP FOREIGN KEY FK_funcionario_triagem;
ALTER TABLE pedido DROP FOREIGN KEY FK_id_funcionario_bloqueio;
ALTER TABLE pedido DROP FOREIGN KEY FK_id_status_atual;
ALTER TABLE servico DROP FOREIGN KEY fk_servico_categoria;

-- 2. Alterar TODAS as chaves primárias e estrangeiras para BIGINT
ALTER TABLE categoria_servico MODIFY COLUMN id_categoria BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE servico MODIFY COLUMN id_servico BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE servico MODIFY COLUMN id_categoria BIGINT NOT NULL;

ALTER TABLE cliente MODIFY COLUMN id_cliente BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE pedido MODIFY COLUMN id_pedido BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE pedido MODIFY COLUMN id_cliente BIGINT NOT NULL;
ALTER TABLE pedido MODIFY COLUMN id_funcionario_triagem BIGINT NOT NULL;
ALTER TABLE pedido MODIFY COLUMN id_funcionario_bloqueio BIGINT NULL;
ALTER TABLE pedido MODIFY COLUMN id_status_atual BIGINT NOT NULL;

ALTER TABLE item_pedido MODIFY COLUMN id_item BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE item_pedido MODIFY COLUMN id_pedido BIGINT NOT NULL;
ALTER TABLE item_pedido MODIFY COLUMN id_servico BIGINT NOT NULL;

ALTER TABLE historico_status MODIFY COLUMN id_historico BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE historico_status MODIFY COLUMN id_pedido BIGINT NULL;
ALTER TABLE historico_status MODIFY COLUMN id_status BIGINT NULL;
ALTER TABLE historico_status MODIFY COLUMN id_funcionario BIGINT NULL;

ALTER TABLE notificacao MODIFY COLUMN id_notificacao BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE notificacao MODIFY COLUMN id_cliente BIGINT NULL;
ALTER TABLE notificacao MODIFY COLUMN id_pedido BIGINT NULL;

ALTER TABLE status_pedido MODIFY COLUMN id_status BIGINT NOT NULL AUTO_INCREMENT;

-- 3. Recriar todas as FKs
ALTER TABLE servico ADD CONSTRAINT fk_servico_categoria FOREIGN KEY (id_categoria) REFERENCES categoria_servico (id_categoria);

ALTER TABLE pedido ADD CONSTRAINT FK_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente);
ALTER TABLE pedido ADD CONSTRAINT FK_funcionario_triagem FOREIGN KEY (id_funcionario_triagem) REFERENCES funcionario (id_funcionario);
ALTER TABLE pedido ADD CONSTRAINT FK_id_funcionario_bloqueio FOREIGN KEY (id_funcionario_bloqueio) REFERENCES funcionario (id_funcionario);
ALTER TABLE pedido ADD CONSTRAINT FK_id_status_atual FOREIGN KEY (id_status_atual) REFERENCES status_pedido (id_status);

ALTER TABLE item_pedido ADD CONSTRAINT fk_id_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido);
ALTER TABLE item_pedido ADD CONSTRAINT fk_id_servico FOREIGN KEY (id_servico) REFERENCES servico (id_servico);

ALTER TABLE historico_status ADD CONSTRAINT fk_id_funcionario FOREIGN KEY (id_funcionario) REFERENCES funcionario (id_funcionario);
ALTER TABLE historico_status ADD CONSTRAINT fk_id_pedidoh FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido);
ALTER TABLE historico_status ADD CONSTRAINT fk_id_status FOREIGN KEY (id_status) REFERENCES status_pedido (id_status);

ALTER TABLE notificacao ADD CONSTRAINT fk_notificacao_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido);
ALTER TABLE notificacao ADD CONSTRAINT fk_notificacao_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente);
DROP DATABASE IF EXISTS alva;
CREATE DATABASE alva DEFAULT CHARACTER SET utf8mb4;
USE alva;

-- Tabelas
CREATE TABLE cliente (
  id_cliente BIGINT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL,
  numero VARCHAR(20) NULL,
  data_cadastro DATETIME NULL,
  PRIMARY KEY (id_cliente)
) ENGINE=InnoDB;

CREATE TABLE funcionario (
  id_funcionario BIGINT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_funcionario),
  UNIQUE KEY uq_funcionario_email (email)
) ENGINE=InnoDB;

CREATE TABLE status_pedido (
  id_status BIGINT NOT NULL AUTO_INCREMENT,
  nome_status VARCHAR(50) NULL,
  ordem INT NOT NULL,
  PRIMARY KEY (id_status)
) ENGINE=InnoDB;

CREATE TABLE categoria_servico (
  id_categoria BIGINT NOT NULL AUTO_INCREMENT,
  nome_categoria VARCHAR(50) NOT NULL,
  ordem INT NULL,
  PRIMARY KEY (id_categoria),
  UNIQUE KEY uq_categoria_nome (nome_categoria)
) ENGINE=InnoDB;

CREATE TABLE servico (
  id_servico BIGINT NOT NULL AUTO_INCREMENT,
  id_categoria BIGINT NOT NULL,
  nome_peca VARCHAR(100) NOT NULL,
  tipo_servico VARCHAR(100) NOT NULL,
  unidade_cobranca VARCHAR(30) NOT NULL,
  preco_unitario DECIMAL(18,2) NOT NULL,
  observacoes VARCHAR(255) NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id_servico),
  UNIQUE KEY uq_servico_item_tipo (id_categoria, nome_peca, tipo_servico)
) ENGINE=InnoDB;

CREATE TABLE pedido (
  id_pedido BIGINT NOT NULL AUTO_INCREMENT,
  id_cliente BIGINT NOT NULL,
  id_funcionario_triagem BIGINT NOT NULL,
  id_status_atual BIGINT NOT NULL,
  id_funcionario_bloqueio BIGINT NULL,
  data_abertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_conclusao DATETIME NULL,
  PRIMARY KEY (id_pedido)
) ENGINE=InnoDB;

CREATE TABLE item_pedido (
  id_item BIGINT NOT NULL AUTO_INCREMENT,
  id_pedido BIGINT NOT NULL,
  id_servico BIGINT NOT NULL,
  quantidade INT NULL,
  valor_cobrado DECIMAL(10,2) NULL,
  subtotal DECIMAL(10,2) NULL,
  PRIMARY KEY (id_item)
) ENGINE=InnoDB;

CREATE TABLE historico_status (
  id_historico BIGINT NOT NULL AUTO_INCREMENT,
  id_pedido BIGINT NULL,
  id_status BIGINT NULL,
  id_funcionario BIGINT NULL,
  data_hora DATETIME NULL,
  PRIMARY KEY (id_historico)
) ENGINE=InnoDB;

CREATE TABLE notificacao (
  id_notificacao BIGINT NOT NULL AUTO_INCREMENT,
  id_cliente BIGINT NULL,
  id_pedido BIGINT NULL,
  tipo VARCHAR(50) NULL,
  token_acesso VARCHAR(300) NULL,
  mensagem VARCHAR(500) NULL,
  data_envio DATETIME NULL,
  data_expiracao DATETIME NOT NULL,
  status_envio VARCHAR(100) NULL,
  PRIMARY KEY (id_notificacao),
  UNIQUE KEY uq_notificacao_token_acesso (token_acesso)
) ENGINE=InnoDB;

-- Chaves Estrangeiras
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

-- Inserir Funcionário "Sistema" (id 1) para os pedidos sem login
INSERT INTO funcionario (id_funcionario, nome, email, senha, perfil) VALUES 
(1, 'Sistema (Triagem Automática)', 'sistema@alva.com.br', 'senha-inutilizavel', 'ATENDENTE');

-- Inserir Categorias
INSERT INTO categoria_servico (id_categoria, nome_categoria, ordem) VALUES
(1, 'Volumosos & Decoração', 1),
(2, 'Cama, Mesa e Banho', 2),
(3, 'Dia a Dia (Básicas)', 3),
(4, 'Alfaiataria e Peças Finas', 4),
(5, 'Inverno e Peças Especiais', 5);

-- Inserir Serviços (Apenas alguns de exemplo para testar, você pode adicionar o resto depois ou usar o SQL completo que eu já te passei)
INSERT INTO servico (id_categoria, nome_peca, tipo_servico, unidade_cobranca, preco_unitario, observacoes) VALUES
(1, 'Edredom Solteiro', 'Lavar', 'Unidade', 45.00, 'Secagem em câmara térmica antiácaro'),
(1, 'Edredom Solteiro', 'Lavar + Passar', 'Unidade', 45.00, 'Secagem em câmara térmica antiácaro'),
(1, 'Edredom Casal / Queen', 'Lavar', 'Unidade', 55.00, 'Enchimento uniforme sem deformação'),
(1, 'Edredom Casal / Queen', 'Lavar + Passar', 'Unidade', 55.00, 'Enchimento uniforme sem deformação'),
(2, 'Lençol Avulso (Solteiro/Casal)', 'Lavar', 'Unidade', 10.00, 'Dobra com acabamento a vapor'),
(2, 'Lençol Avulso (Solteiro/Casal)', 'Passar', 'Unidade', 8.00, 'Dobra com acabamento a vapor'),
(2, 'Lençol Avulso (Solteiro/Casal)', 'Lavar + Passar', 'Unidade', 15.00, 'Dobra com acabamento a vapor'),
(3, 'Camiseta / Polo', 'Lavar', 'Unidade', 7.00, 'Passadoria no cabide ou dobrada'),
(3, 'Camiseta / Polo', 'Passar', 'Unidade', 6.00, 'Passadoria no cabide ou dobrada'),
(3, 'Camiseta / Polo', 'Lavar + Passar', 'Unidade', 11.50, 'Passadoria no cabide ou dobrada');
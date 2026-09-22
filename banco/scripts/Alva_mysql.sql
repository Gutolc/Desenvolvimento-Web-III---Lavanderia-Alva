-- ============================================================
-- Alva.sql — versão convertida de SQL Server (T-SQL) para MySQL
-- Convertido a partir do script original de 18/09/2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS `alva` DEFAULT CHARACTER SET utf8mb4;
USE `alva`;

-- ------------------------------------------------------------
-- Tabela: cliente
-- ------------------------------------------------------------
CREATE TABLE `cliente` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL,
  `numero` VARCHAR(12) NULL,
  `data_cadastro` DATETIME NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: funcionario
-- ------------------------------------------------------------
CREATE TABLE `funcionario` (
  `id_funcionario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `perfil` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_funcionario`),
  UNIQUE KEY `uq_funcionario_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: historico_status
-- ------------------------------------------------------------
CREATE TABLE `historico_status` (
  `id_historico` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` INT NULL,
  `id_status` INT NULL,
  `id_funcionario` INT NULL,
  `data_hora` DATETIME NULL,
  PRIMARY KEY (`id_historico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: item_pedido
-- ------------------------------------------------------------
CREATE TABLE `item_pedido` (
  `id_item` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` INT NOT NULL,
  `id_servico` INT NOT NULL,
  `quantidade` INT NULL,
  `valor_cobrado` DECIMAL(10,2) NULL,
  `subtotal` DECIMAL(10,2) NULL,
  PRIMARY KEY (`id_item`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: notificacao
-- ------------------------------------------------------------
CREATE TABLE `notificacao` (
  `id_notificacao` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NULL,
  `id_pedido` INT NULL,
  `tipo` VARCHAR(50) NULL,
  `token_acesso` VARCHAR(300) NULL,
  `mensagem` VARCHAR(500) NULL,
  `data_envio` DATETIME NULL,
  `data_expiracao` DATETIME NOT NULL,
  `status_envio` VARCHAR(100) NULL,
  PRIMARY KEY (`id_notificacao`),
  UNIQUE KEY `uq_notificacao_token_acesso` (`token_acesso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: pedido
-- ------------------------------------------------------------
CREATE TABLE `pedido` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NOT NULL,
  `id_funcionario_triagem` INT NOT NULL,
  `id_status_atual` INT NOT NULL,
  `id_funcionario_bloqueio` INT NULL,
  `data_abertura` DATETIME NOT NULL,
  `data_conclusao` DATETIME NULL,
  PRIMARY KEY (`id_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: servico
-- ------------------------------------------------------------
CREATE TABLE `servico` (
  `id_servico` INT NOT NULL AUTO_INCREMENT,
  `nome_peca` VARCHAR(50) NOT NULL,
  `tipo_servico` VARCHAR(100) NOT NULL,
  `preco_unitario` DECIMAL(18,2) NOT NULL,
  `ativo` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id_servico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: status_pedido
-- ------------------------------------------------------------
CREATE TABLE `status_pedido` (
  `id_status` INT NOT NULL AUTO_INCREMENT,
  `nome_status` VARCHAR(50) NULL,
  `ordem` INT NOT NULL,
  CONSTRAINT `pk_status_pedido` PRIMARY KEY (`id_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Defaults (equivalentes aos ALTER TABLE ... ADD DEFAULT do T-SQL)
-- ------------------------------------------------------------
ALTER TABLE `pedido`
  MODIFY COLUMN `data_abertura` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `servico`
  MODIFY COLUMN `ativo` TINYINT(1) NOT NULL DEFAULT 1;

-- ------------------------------------------------------------
-- Chaves estrangeiras (equivalentes aos ALTER TABLE ... ADD CONSTRAINT do T-SQL)
-- No MySQL/InnoDB a FK já nasce ativa: não existe equivalente ao
-- "ALTER TABLE ... CHECK CONSTRAINT" do SQL Server, por isso essas
-- linhas foram omitidas na conversão.
-- ------------------------------------------------------------
ALTER TABLE `historico_status`
  ADD CONSTRAINT `fk_id_funcionario` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id_funcionario`);

ALTER TABLE `historico_status`
  ADD CONSTRAINT `fk_id_pedidoh` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`);

ALTER TABLE `historico_status`
  ADD CONSTRAINT `fk_id_status` FOREIGN KEY (`id_status`) REFERENCES `status_pedido` (`id_status`);

ALTER TABLE `item_pedido`
  ADD CONSTRAINT `fk_id_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`);

ALTER TABLE `item_pedido`
  ADD CONSTRAINT `fk_id_servico` FOREIGN KEY (`id_servico`) REFERENCES `servico` (`id_servico`);

ALTER TABLE `notificacao`
  ADD CONSTRAINT `fk_notificacao_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`);

ALTER TABLE `notificacao`
  ADD CONSTRAINT `fk_notificacao_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);

ALTER TABLE `pedido`
  ADD CONSTRAINT `FK_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);

ALTER TABLE `pedido`
  ADD CONSTRAINT `FK_funcionario_triagem` FOREIGN KEY (`id_funcionario_triagem`) REFERENCES `funcionario` (`id_funcionario`);

ALTER TABLE `pedido`
  ADD CONSTRAINT `FK_id_funcionario_bloqueio` FOREIGN KEY (`id_funcionario_bloqueio`) REFERENCES `funcionario` (`id_funcionario`);

ALTER TABLE `pedido`
  ADD CONSTRAINT `FK_id_status_atual` FOREIGN KEY (`id_status_atual`) REFERENCES `status_pedido` (`id_status`);

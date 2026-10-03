use alva;

INSERT INTO funcionario (nome, email, senha, perfil) VALUES
('Carlos Mendes', 'carlos.mendes@alva.com', 'hashsenha1', 'adm'),
('Ana Julia', 'ana.julia@alva.com', 'hashsenha2', 'atendente'),
('Roberto Carlos', 'roberto.carlos@alva.com', 'hashsenha3', 'operador_lavagem'),
('Mariana Silva', 'mariana.silva@alva.com', 'hashsenha4', 'operador_passadoria'),
('Fernando Costa', 'fernando.costa@alva.com', 'hashsenha5', 'entregador');

INSERT INTO cliente (nome, numero, data_cadastro) VALUES
('João da Silva', '11999991111', NOW()),
('Maria Souza', '11999992222', NOW()),
('Pedro Almeida', '11999993333', NOW()),
('Luciana Santos', '11999994444', NOW()),
('Ricardo Gomes', '11999995555', NOW()),
('Camila Rodrigues', '11999996666', NOW()),
('Bruno Martins', '11999997777', NOW()),
('Patricia Alves', '11999998888', NOW()),
('Thiago Pereira', '11999999999', NOW()),
('Beatriz Lima', '11999990000', NOW());

INSERT INTO status_pedido (nome_status, ordem) VALUES
('Recebido', 1),
('Em Triagem', 2),
('Aguardando Pagamento', 3),
('Lavagem', 4),
('Secagem', 5),
('Passadoria', 6),
('Pronto para Retirada', 7),
('Em Rota de Entrega', 8),
('Entregue', 9),
('Cancelado', 10);

INSERT INTO servico (nome_peca, tipo_servico, preco_unitario, ativo) VALUES
('Camisa Social', 'Lavagem e Passadoria', 15.00, 1),
('Calça Jeans', 'Lavagem Simples', 12.50, 1),
('Terno Completo', 'Lavagem a Seco', 45.00, 1),
('Vestido Longo', 'Lavagem Delicada', 35.00, 1),
('Jaqueta de Couro', 'Limpeza Especializada', 60.00, 1),
('Edredom Casal', 'Lavagem Pesada', 50.00, 1),
('Toalha de Banho', 'Lavagem Simples', 8.00, 1),
('Saia', 'Lavagem e Passadoria', 14.00, 1),
('Camiseta', 'Lavagem Simples', 7.50, 1),
('Tapete Médio', 'Lavagem Pesada', 80.00, 1);

INSERT INTO pedido (id_cliente, id_funcionario_triagem, id_status_atual, id_funcionario_bloqueio, data_abertura, data_conclusao) VALUES
(1, 2, 1, NULL, NOW(), NULL),
(2, 3, 2, NULL, NOW(), NULL),
(3, 2, 4, NULL, NOW(), NULL),
(4, 3, 7, NULL, '2026-09-10 09:00:00', NULL),
(5, 2, 9, NULL, '2026-09-15 10:30:00', '2026-09-17 14:00:00'),
(6, 3, 10, 1, '2026-09-16 11:15:00', '2026-09-16 15:00:00'),
(7, 2, 5, NULL, NOW(), NULL),
(8, 3, 6, NULL, NOW(), NULL),
(9, 2, 8, NULL, NOW(), NULL),
(10, 3, 3, NULL, NOW(), NULL);

INSERT INTO item_pedido (id_pedido, id_servico, quantidade, valor_cobrado, subtotal) VALUES
(1, 1, 3, 15.00, 45.00),
(2, 3, 1, 45.00, 45.00),
(3, 6, 2, 50.00, 100.00),
(4, 2, 4, 12.50, 50.00),
(5, 5, 1, 60.00, 60.00),
(6, 10, 1, 80.00, 80.00),
(7, 4, 2, 35.00, 70.00),
(8, 7, 5, 8.00, 40.00),
(9, 8, 3, 14.00, 42.00),
(10, 9, 6, 7.50, 45.00);

INSERT INTO historico_status (id_pedido, id_status, id_funcionario, data_hora) VALUES
(1, 1, 2, NOW()),
(2, 2, 3, NOW()),
(3, 4, 4, NOW()),
(4, 7, 5, NOW()),
(5, 9, 5, NOW()),
(6, 10, 1, NOW()),
(7, 5, 3, NOW()),
(8, 6, 4, NOW()),
(9, 8, 5, NOW()),
(10, 3, 2, NOW());

INSERT INTO notificacao (id_cliente, id_pedido, tipo, token_acesso, mensagem, data_envio, data_expiracao, status_envio) VALUES
(1, 1, 'Email', 'TOK-12345-ABC01', 'Seu pedido foi recebido.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Enviado'),
(2, 2, 'SMS', 'TOK-12345-ABC02', 'Seu pedido está em triagem.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Enviado'),
(3, 3, 'Email', 'TOK-12345-ABC03', 'Seu pedido está em lavagem.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Pendente'),
(4, 4, 'WhatsApp', 'TOK-12345-ABC04', 'Seu pedido está pronto para retirada.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Enviado'),
(5, 5, 'Email', 'TOK-12345-ABC05', 'Seu pedido foi entregue com sucesso.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Enviado'),
(6, 6, 'SMS', 'TOK-12345-ABC06', 'Seu pedido foi cancelado.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Enviado'),
(7, 7, 'WhatsApp', 'TOK-12345-ABC07', 'Seu pedido está na secagem.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Pendente'),
(8, 8, 'Email', 'TOK-12345-ABC08', 'Suas roupas estão sendo passadas.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Pendente'),
(9, 9, 'SMS', 'TOK-12345-ABC09', 'Seu pedido saiu para entrega.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Enviado'),
(10, 10, 'Email', 'TOK-12345-ABC10', 'Aguardando confirmação de pagamento.', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Enviado');

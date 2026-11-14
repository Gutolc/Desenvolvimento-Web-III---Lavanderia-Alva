USE alva;

-- Limpa os serviços antigos (mantém o admin e o funcionário sistema)
DELETE FROM servico;
DELETE FROM categoria_servico;

-- Inserir Categorias
INSERT INTO categoria_servico (id_categoria, nome_categoria, ordem) VALUES
(1, 'Volumosos & Decoração', 1),
(2, 'Cama, Mesa e Banho', 2),
(3, 'Dia a Dia (Básicas)', 3),
(4, 'Alfaiataria e Peças Finas', 4),
(5, 'Inverno e Peças Especiais', 5);

-- Inserir Serviços (Cat 1)
INSERT INTO servico (id_categoria, nome_peca, tipo_servico, unidade_cobranca, preco_unitario, observacoes) VALUES
(1, 'Edredom Solteiro', 'Lavar', 'Unidade', 45.00, 'Secagem em câmara térmica antiácaro'),
(1, 'Edredom Solteiro', 'Lavar + Passar', 'Unidade', 45.00, 'Secagem em câmara térmica antiácaro'),
(1, 'Edredom Casal / Queen', 'Lavar', 'Unidade', 55.00, 'Enchimento uniforme sem deformação'),
(1, 'Edredom Casal / Queen', 'Lavar + Passar', 'Unidade', 55.00, 'Enchimento uniforme sem deformação'),
(1, 'Edredom King', 'Lavar', 'Unidade', 68.00, 'Exige tambor de grande capacidade'),
(1, 'Edredom King', 'Lavar + Passar', 'Unidade', 68.00, 'Exige tambor de grande capacidade'),
(1, 'Edredom de Plumas', 'Lavar', 'Unidade', 85.00, 'Processo suave com secagem especial'),
(1, 'Edredom de Plumas', 'Lavar + Passar', 'Unidade', 85.00, 'Processo suave com secagem especial'),
(1, 'Cobertor Solteiro', 'Lavar', 'Unidade', 38.00, 'Tratamento antialérgico'),
(1, 'Cobertor Solteiro', 'Lavar + Passar', 'Unidade', 38.00, 'Tratamento antialérgico'),
(1, 'Cobertor Casal / King', 'Lavar', 'Unidade', 48.00, 'Higienização profunda de fibras'),
(1, 'Cobertor Casal / King', 'Lavar + Passar', 'Unidade', 48.00, 'Higienização profunda de fibras'),
(1, 'Manta Microfibra', 'Lavar', 'Unidade', 28.00, 'Revitalização do toque macio'),
(1, 'Manta Microfibra', 'Lavar + Passar', 'Unidade', 28.00, 'Revitalização do toque macio'),
(1, 'Tapete Sintético / Pelo Curto', 'Lavar', 'Metro quadrado (m²)', 38.00, 'Extração profunda de sujeira e ácaros'),
(1, 'Tapete Sintético / Pelo Curto', 'Lavar + Passar', 'Metro quadrado (m²)', 38.00, 'Extração profunda de sujeira e ácaros'),
(1, 'Tapete Shaggy (Pelo Alto)', 'Lavar', 'Metro quadrado (m²)', 48.00, 'Secagem suspensa e escovação'),
(1, 'Tapete Shaggy (Pelo Alto)', 'Lavar + Passar', 'Metro quadrado (m²)', 48.00, 'Secagem suspensa e escovação'),
(1, 'Tapete Persa / Tear Artesanal', 'Lavar', 'Metro quadrado (m²)', 65.00, 'Limpeza manual com pH neutro'),
(1, 'Tapete Persa / Tear Artesanal', 'Lavar + Passar', 'Metro quadrado (m²)', 65.00, 'Limpeza manual com pH neutro');

-- Inserir Serviços (Cat 2)
INSERT INTO servico (id_categoria, nome_peca, tipo_servico, unidade_cobranca, preco_unitario, observacoes) VALUES
(2, 'Lençol Avulso (Solteiro/Casal)', 'Lavar', 'Unidade', 10.00, 'Dobra com acabamento a vapor'),
(2, 'Lençol Avulso (Solteiro/Casal)', 'Passar', 'Unidade', 8.00, 'Dobra com acabamento a vapor'),
(2, 'Lençol Avulso (Solteiro/Casal)', 'Lavar + Passar', 'Unidade', 15.00, 'Dobra com acabamento a vapor'),
(2, 'Jogo de Cama Completo (4 pçs)', 'Lavar', 'Jogo', 28.00, 'Lençol cima, elástico e 2 fronhas'),
(2, 'Jogo de Cama Completo (4 pçs)', 'Passar', 'Jogo', 22.00, 'Lençol cima, elástico e 2 fronhas'),
(2, 'Jogo de Cama Completo (4 pçs)', 'Lavar + Passar', 'Jogo', 44.00, 'Lençol cima, elástico e 2 fronhas'),
(2, 'Fronha Avulsa', 'Lavar', 'Unidade', 4.00, 'Passadoria lisa'),
(2, 'Fronha Avulsa', 'Passar', 'Unidade', 3.50, 'Passadoria lisa'),
(2, 'Fronha Avulsa', 'Lavar + Passar', 'Unidade', 6.50, 'Passadoria lisa'),
(2, 'Toalha de Banho', 'Lavar', 'Unidade', 8.00, 'Toalhas não requerem passadoria'),
(2, 'Toalha de Banho', 'Lavar + Passar', 'Unidade', 8.00, 'Toalhas não requerem passadoria'),
(2, 'Toalha de Rosto / Piso', 'Lavar', 'Unidade', 5.00, 'Higienização antibacteriana'),
(2, 'Toalha de Rosto / Piso', 'Lavar + Passar', 'Unidade', 5.00, 'Higienização antibacteriana'),
(2, 'Toalha de Mesa Simples', 'Lavar', 'Unidade', 12.00, 'Até 6 lugares'),
(2, 'Toalha de Mesa Simples', 'Passar', 'Unidade', 10.00, 'Até 6 lugares'),
(2, 'Toalha de Mesa Simples', 'Lavar + Passar', 'Unidade', 19.00, 'Até 6 lugares'),
(2, 'Toalha de Mesa Festas/Renda', 'Lavar', 'Unidade', 20.00, 'Cuidado com bordados e rendas'),
(2, 'Toalha de Mesa Festas/Renda', 'Passar', 'Unidade', 18.00, 'Cuidado com bordados e rendas'),
(2, 'Toalha de Mesa Festas/Renda', 'Lavar + Passar', 'Unidade', 34.00, 'Cuidado com bordados e rendas'),
(2, 'Cortina Leve (Voil / Microfibra)', 'Lavar', 'Metro linear (m)', 16.00, 'Lavagem sem danificar ilhós'),
(2, 'Cortina Leve (Voil / Microfibra)', 'Passar', 'Metro linear (m)', 12.00, 'Lavagem sem danificar ilhós'),
(2, 'Cortina Leve (Voil / Microfibra)', 'Lavar + Passar', 'Metro linear (m)', 25.00, 'Lavagem sem danificar ilhós'),
(2, 'Cortina Blackout / Pesada', 'Lavar', 'Metro linear (m)', 24.00, 'Higienização a vapor sem calor direto'),
(2, 'Cortina Blackout / Pesada', 'Lavar + Passar', 'Metro linear (m)', 24.00, 'Higienização a vapor sem calor direto');

-- Inserir Serviços (Cat 3)
INSERT INTO servico (id_categoria, nome_peca, tipo_servico, unidade_cobranca, preco_unitario, observacoes) VALUES
(3, 'Camiseta / Polo', 'Lavar', 'Unidade', 7.00, 'Passadoria no cabide ou dobrada'),
(3, 'Camiseta / Polo', 'Passar', 'Unidade', 6.00, 'Passadoria no cabide ou dobrada'),
(3, 'Camiseta / Polo', 'Lavar + Passar', 'Unidade', 11.50, 'Passadoria no cabide ou dobrada'),
(3, 'Camisa Polo', 'Lavar', 'Unidade', 8.00, 'Colarinho alinhado'),
(3, 'Camisa Polo', 'Passar', 'Unidade', 7.00, 'Colarinho alinhado'),
(3, 'Camisa Polo', 'Lavar + Passar', 'Unidade', 13.00, 'Colarinho alinhado'),
(3, 'Bermuda / Shorts', 'Lavar', 'Unidade', 7.50, 'Dobra simples'),
(3, 'Bermuda / Shorts', 'Passar', 'Unidade', 6.00, 'Dobra simples'),
(3, 'Bermuda / Shorts', 'Lavar + Passar', 'Unidade', 12.00, 'Dobra simples'),
(3, 'Calça Jeans / Sarja', 'Lavar', 'Unidade', 10.00, 'Fixação de vincos (opcional)'),
(3, 'Calça Jeans / Sarja', 'Passar', 'Unidade', 8.00, 'Fixação de vincos (opcional)'),
(3, 'Calça Jeans / Sarja', 'Lavar + Passar', 'Unidade', 16.00, 'Fixação de vincos (opcional)'),
(3, 'Moletom (Blusa)', 'Lavar', 'Unidade', 12.00, 'Tratamento antifelpas'),
(3, 'Moletom (Blusa)', 'Passar', 'Unidade', 8.00, 'Tratamento antifelpas'),
(3, 'Moletom (Blusa)', 'Lavar + Passar', 'Unidade', 18.00, 'Tratamento antifelpas'),
(3, 'Moletom (Calça)', 'Lavar', 'Unidade', 10.00, 'Sem deformar o cós'),
(3, 'Moletom (Calça)', 'Passar', 'Unidade', 7.00, 'Sem deformar o cós'),
(3, 'Moletom (Calça)', 'Lavar + Passar', 'Unidade', 15.00, 'Sem deformar o cós'),
(3, 'Cesto Dia a Dia (até 8kg)', 'Lavar', 'Cesto fechado', 55.00, 'Somente lavar, secar e dobrar');

-- Inserir Serviços (Cat 4)
INSERT INTO servico (id_categoria, nome_peca, tipo_servico, unidade_cobranca, preco_unitario, observacoes) VALUES
(4, 'Camisa Social Masculina/Fem.', 'Lavar', 'Unidade', 11.00, 'Colarinho e punhos passados a vapor'),
(4, 'Camisa Social Masculina/Fem.', 'Passar', 'Unidade', 10.00, 'Colarinho e punhos passados a vapor'),
(4, 'Camisa Social Masculina/Fem.', 'Lavar + Passar', 'Unidade', 18.50, 'Colarinho e punhos passados a vapor'),
(4, 'Calça Social', 'Lavar', 'Unidade', 12.00, 'Vinco alinhado'),
(4, 'Calça Social', 'Passar', 'Unidade', 10.00, 'Vinco alinhado'),
(4, 'Calça Social', 'Lavar + Passar', 'Unidade', 19.00, 'Vinco alinhado'),
(4, 'Blazer / Paletó', 'Lavar', 'Unidade', 28.00, 'Lavagem a seco ou suave especializada'),
(4, 'Blazer / Paletó', 'Passar', 'Unidade', 18.00, 'Lavagem a seco ou suave especializada'),
(4, 'Blazer / Paletó', 'Lavar + Passar', 'Unidade', 40.00, 'Lavagem a seco ou suave especializada'),
(4, 'Terno Completo (2 peças)', 'Lavar', 'Conjunto', 38.00, 'Acompanha capa protetora no cabide'),
(4, 'Terno Completo (2 peças)', 'Passar', 'Conjunto', 26.00, 'Acompanha capa protetora no cabide'),
(4, 'Terno Completo (2 peças)', 'Lavar + Passar', 'Conjunto', 56.00, 'Acompanha capa protetora no cabide'),
(4, 'Vestido Curto Simples', 'Lavar', 'Unidade', 16.00, 'Tecidos mistos'),
(4, 'Vestido Curto Simples', 'Passar', 'Unidade', 12.00, 'Tecidos mistos'),
(4, 'Vestido Curto Simples', 'Lavar + Passar', 'Unidade', 25.00, 'Tecidos mistos'),
(4, 'Vestido Longo / Festa', 'Lavar', 'Unidade', 45.00, 'Seda, cetim, pedrarias ou pregas'),
(4, 'Vestido Longo / Festa', 'Passar', 'Unidade', 35.00, 'Seda, cetim, pedrarias ou pregas'),
(4, 'Vestido Longo / Festa', 'Lavar + Passar', 'Unidade', 72.00, 'Seda, cetim, pedrarias ou pregas'),
(4, 'Saia Social / Plissada', 'Lavar', 'Unidade', 14.00, 'Recomposição de plissado sob consulta'),
(4, 'Saia Social / Plissada', 'Passar', 'Unidade', 12.00, 'Recomposição de plissado sob consulta'),
(4, 'Saia Social / Plissada', 'Lavar + Passar', 'Unidade', 23.00, 'Recomposição de plissado sob consulta');

-- Inserir Serviços (Cat 5)
INSERT INTO servico (id_categoria, nome_peca, tipo_servico, unidade_cobranca, preco_unitario, observacoes) VALUES
(5, 'Sobretudo / Casaco Pesado', 'Lavar', 'Unidade', 35.00, 'Secagem controlada sem amassar o forro'),
(5, 'Sobretudo / Casaco Pesado', 'Passar', 'Unidade', 20.00, 'Secagem controlada sem amassar o forro'),
(5, 'Sobretudo / Casaco Pesado', 'Lavar + Passar', 'Unidade', 48.00, 'Secagem controlada sem amassar o forro'),
(5, 'Jaqueta de Nylon / Puffer', 'Lavar', 'Unidade', 28.00, 'Redistribuição das câmaras de fibra'),
(5, 'Jaqueta de Nylon / Puffer', 'Lavar + Passar', 'Unidade', 28.00, 'Redistribuição das câmaras de fibra'),
(5, 'Jaqueta de Couro Natural', 'Lavar', 'Unidade', 85.00, 'Higienização e hidratação do couro'),
(5, 'Jaqueta de Couro Natural', 'Lavar + Passar', 'Unidade', 85.00, 'Higienização e hidratação do couro');
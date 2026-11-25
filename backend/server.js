require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Servico = require('./models/Servico');
const Cliente = require('./models/Cliente');
const Pedido = require('./models/Pedido');

const app = express();
app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos do Front-End direto em http://localhost:3000
app.use(express.static(path.join(__dirname, '..', 'Front Alva')));

// 1. Conexão com o MongoDB Atlas e limpeza de índices antigos conflitantes
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Conectado ao MongoDB Atlas (AlvaLavanderia)!');
    // Remove índices antigos que possam bloquear o cadastro de clientes no MongoDB Atlas
    try {
      await Cliente.collection.dropIndexes();
    } catch (e) {}
  })
  .catch((err) => console.error('⚠️ Aviso de conexão MongoDB Atlas (verifique seu arquivo .env):', err.message));

/* ==========================================================
   ROTAS DE SERVIÇOS / CATÁLOGO (Admin e Página de Preços)
   ========================================================== */

app.get('/api/produtos', async (req, res) => {
  try {
    const servicos = await Servico.find().sort({ id: 1 });
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/produtos/seed', async (req, res) => {
  try {
    const count = await Servico.countDocuments();
    if (count === 0 && Array.isArray(req.body)) {
      await Servico.insertMany(req.body);
      return res.status(201).json({ mensagem: 'Catálogo inicial de 36 itens gravado no MongoDB Atlas!' });
    }
    res.json({ mensagem: 'Catálogo já possui itens cadastrados no banco.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/produtos', async (req, res) => {
  try {
    const ultimo = await Servico.findOne().sort({ id: -1 });
    const novoId = req.body.id || (ultimo ? ultimo.id + 1 : 1);
    const novoServico = await Servico.create({ ...req.body, id: novoId });
    res.status(201).json(novoServico);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.put('/api/produtos/:id', async (req, res) => {
  try {
    const atualizado = await Servico.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true, upsert: true }
    );
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.patch('/api/produtos/:id/status', async (req, res) => {
  try {
    const atualizado = await Servico.findOneAndUpdate(
      { id: Number(req.params.id) },
      { ativo: req.body.ativo },
      { new: true }
    );
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.delete('/api/produtos/:id', async (req, res) => {
  try {
    await Servico.findOneAndDelete({ id: Number(req.params.id) });
    res.json({ mensagem: 'Serviço removido com sucesso.' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

/* ==========================================================
   ROTAS DE PEDIDOS E CLIENTES (Checkout, Rastreio e Kanban)
   ========================================================== */

// Função auxiliar para cadastrar ou atualizar cliente de forma à prova de falhas
async function salvarOuAtualizarCliente(dadosCli) {
  if (!dadosCli || !dadosCli.nome) return null;

  const cpfLimpo = (dadosCli.cpf || '').trim();
  const whatsLimpo = (dadosCli.whatsapp || '').trim();
  const nomeLimpo = dadosCli.nome.trim();

  const filtro = cpfLimpo
    ? { cpf: cpfLimpo }
    : (whatsLimpo ? { whatsapp: whatsLimpo } : { nome: nomeLimpo });

  const payloadCliente = {
    nome: nomeLimpo,
    whatsapp: whatsLimpo || 'Não informado',
    email: (dadosCli.email || '').trim(),
    cpf: cpfLimpo,
    endereco: (dadosCli.endereco || '').trim(),
    ultimoPedidoEm: new Date()
  };

  try {
    return await Cliente.findOneAndUpdate(filtro, payloadCliente, { upsert: true, new: true });
  } catch (err) {
    // Caso exista índice único antigo no MongoDB Atlas, limpa os índices e grava novamente
    await Cliente.collection.dropIndexes().catch(() => {});
    return await Cliente.findOneAndUpdate({ nome: nomeLimpo }, payloadCliente, { upsert: true, new: true });
  }
}

// Cliente faz pedido -> Salva/Atualiza Cliente na coleção 'clientes' + Cria Pedido na coleção 'pedidos'
app.post('/api/pedidos', async (req, res) => {
  try {
    const dadosPedido = req.body;

    // 1. Salva/Atualiza o cliente automaticamente na coleção 'clientes'
    const clienteSalvo = await salvarOuAtualizarCliente(dadosPedido.cliente);

    // 2. Grava ou atualiza o pedido na coleção 'pedidos'
    const pedidoCriado = await Pedido.findOneAndUpdate(
      { codigo: dadosPedido.codigo },
      dadosPedido,
      { upsert: true, new: true }
    );

    res.status(201).json({ pedido: pedidoCriado, cliente: clienteSalvo });
  } catch (err) {
    console.error('Erro ao salvar pedido/cliente:', err.message);
    res.status(400).json({ erro: err.message });
  }
});

// Rota utilitária: Extrai todos os clientes dos pedidos já existentes no banco e popula a coleção 'clientes'
app.post('/api/clientes/sincronizar', async (req, res) => {
  try {
    await Cliente.collection.dropIndexes().catch(() => {});
    const pedidos = await Pedido.find();
    let totalSincronizados = 0;

    for (const p of pedidos) {
      if (p.cliente && p.cliente.nome) {
        await salvarOuAtualizarCliente(p.cliente);
        totalSincronizados++;
      }
    }
    res.json({ mensagem: `Sucesso! ${totalSincronizados} clientes sincronizados na coleção 'clientes'!` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Listar clientes cadastrados (Admin)
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ updatedAt: -1 });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Visão Geral de todos os pedidos ativos para a Esteira Kanban (Exclusivo Admin)
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find({ status: { $ne: 'cancelado' } }).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Consulta individual do cliente por código (meu-pedido.html)
app.get('/api/pedidos/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo.toUpperCase();
    const pedido = await Pedido.findOne({ codigo });
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Avançar, voltar ou arrastar etapa do pedido no Kanban (Admin)
app.patch('/api/pedidos/:codigo/status', async (req, res) => {
  try {
    const codigo = req.params.codigo.toUpperCase();
    const atualizado = await Pedido.findOneAndUpdate(
      { codigo },
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!atualizado) {
      return res.status(404).json({ erro: `Pedido #${codigo} não encontrado no banco.` });
    }
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Cancelar pedido a pedido do cliente (Exclusivo Admin)
app.delete('/api/pedidos/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo.toUpperCase();
    await Pedido.findOneAndUpdate({ codigo }, { $set: { status: 'cancelado' } });
    res.json({ mensagem: `Pedido #${codigo} cancelado pelo administrador.` });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Full-Stack Lavanderia Alva rodando em http://localhost:${PORT}`);
});

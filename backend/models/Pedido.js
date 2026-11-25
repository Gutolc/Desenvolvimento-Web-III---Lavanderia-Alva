const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  criadoEm: { type: String, required: true },
  status: {
    type: String,
    enum: ['recebido', 'andamento', 'pronto', 'entrega', 'concluido', 'cancelado'],
    default: 'recebido'
  },
  pagamento: { type: String, required: true },
  pago: { type: Boolean, default: true },
  total: { type: Number, required: true },
  cliente: {
    nome: String,
    whatsapp: String,
    email: String,
    cpf: String,
    coleta: String,
    endereco: String
  },
  itens: [
    {
      idProduto: Number,
      nome: String,
      modalidade: String,
      preco: Number,
      unidade: String,
      quantidade: Number
    }
  ]
}, { collection: 'pedidos', timestamps: true });

module.exports = mongoose.model('Pedido', PedidoSchema);

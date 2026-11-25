
const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  whatsapp: { type: String, required: true },
  email: { type: String, default: '' },
  cpf: { type: String, default: '' },
  endereco: { type: String, default: '' },
  ultimoPedidoEm: { type: Date, default: Date.now }
}, { collection: 'clientes', timestamps: true });

module.exports = mongoose.model('Cliente', ClienteSchema);
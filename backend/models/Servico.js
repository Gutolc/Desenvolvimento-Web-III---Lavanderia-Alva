const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  categoria: { type: String, required: true },
  nome: { type: String, required: true },
  unidade: { type: String, required: true },
  lavar: { type: Number, default: null },
  passar: { type: Number, default: null },
  completo: { type: Number, default: null },
  obs: { type: String, default: '' },
  ativo: { type: Boolean, default: true }
}, { collection: 'servicos', timestamps: true });

module.exports = mongoose.model('Servico', ServicoSchema);

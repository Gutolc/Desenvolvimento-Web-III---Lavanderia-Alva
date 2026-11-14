/* ==========================================================
   Meu Pedido - Rastreamento via API
   ========================================================== */

const ETAPAS = [
  { chave: 'Recebido', titulo: 'Recebido / Coleta Agendada', desc: 'Seu pedido foi recebido e a coleta está programada.' },
  { chave: 'Em Andamento', titulo: 'Em Lavagem & Passadoria', desc: 'Suas peças estão em tratamento técnico na nossa unidade.' },
  { chave: 'Pronto', titulo: 'Pronto & Embalado', desc: 'Roupas higienizadas, dobradas e embaladas para envio.' },
  { chave: 'Saiu para Entrega', titulo: 'Saiu para Entrega', desc: 'Nosso motorista está a caminho do seu endereço.' },
  { chave: 'Concluído', titulo: 'Entregue / Concluído', desc: 'Pedido finalizado e entregue com sucesso!' }
];

async function buscarMeuPedido() {
  const codigo = document.getElementById('codigoInput').value.trim().toUpperCase().replace('#', '');
  const div = document.getElementById('resultadoPedido');

  if (!codigo) {
    alert('Digite um código de pedido válido.');
    return;
  }

  try {
    const pedido = await API.get(`/api/pedidos/${codigo}`);

    document.getElementById('resCodigo').textContent = 'Pedido #' + pedido.codigo;
    document.getElementById('resData').textContent = pedido.criadoEm;
    document.getElementById('resCliente').innerHTML = `<strong>Cliente:</strong> ${pedido.cliente.nome} <br><strong>Endereço de Entrega:</strong> ${pedido.cliente.endereco}`;
    document.getElementById('resItens').innerHTML = `<strong>Peças:</strong> ` +
      pedido.itens.map(i => `${i.quantidade}x ${i.nome} (${i.modalidade})`).join(', ') +
      ` • <strong>Total:</strong> R$ ${Number(pedido.total).toFixed(2).replace('.', ',')}`;

    const idxAtual = ETAPAS.findIndex(e => e.chave === pedido.status);
    const timeline = document.getElementById('timelineContainer');

    timeline.innerHTML = ETAPAS.map((etapa, idx) => {
      let classe = '';
      let icone = 'radio_button_unchecked';
      if (idx < idxAtual) {
        classe = 'active';
        icone = 'check';
      } else if (idx === idxAtual) {
        classe = 'active current';
        icone = 'sync';
      }
      return `
        <div class="timeline-step ${classe}">
          <div class="timeline-dot"><span class="material-symbols-outlined" style="font-size:16px;">${icone}</span></div>
          <strong>${etapa.titulo}</strong>
          <p>${etapa.desc}</p>
        </div>
      `;
    }).join('');

    div.style.display = 'block';

  } catch (erro) {
    console.error(erro);
    alert('Pedido não encontrado. Confira o código informado.');
    div.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cod = urlParams.get('codigo');
  if (cod) {
    document.getElementById('codigoInput').value = cod;
    buscarMeuPedido();
  }
});
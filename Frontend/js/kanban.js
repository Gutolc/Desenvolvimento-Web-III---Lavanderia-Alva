
const AUTH_KEY = 'alva_admin_token';
const token = sessionStorage.getItem(AUTH_KEY);

if (!token) {
  alert('Acesso restrito. Faça login no painel administrativo.');
  window.location.href = 'admin.html';
}

const ORDEM_COLUNAS = [
  { chave: 'recebido', db: 'Recebido' },
  { chave: 'andamento', db: 'Em Andamento' },
  { chave: 'pronto', db: 'Pronto' },
  { chave: 'entrega', db: 'Saiu para Entrega' },
  { chave: 'concluido', db: 'Concluído' }
];

const INFO_STATUS = {
  'Recebido': { titulo: 'Recebido / Coleta Agendada', msg: 'Recebemos seu pedido e nossa equipe já programou a coleta no seu endereço.' },
  'Em Andamento': { titulo: 'Em Andamento (Lavagem)', msg: 'Suas peças já estão em processo de higienização e cuidado técnico.' },
  'Pronto': { titulo: 'Pronto & Embalado', msg: 'Suas roupas já estão limpas, cheirosas e embaladas aguardando entrega!' },
  'Saiu para Entrega': { titulo: 'Saiu para Entrega', msg: 'Nosso motorista acabou de sair com o seu pacote! Em breve estaremos aí.' },
  'Concluído': { titulo: 'Pedido Entregue', msg: 'Entrega concluída! Agradecemos por confiar suas peças à Lavanderia Alva.' }
};

let pedidoParaTriagem = null;
let itensTriagem = []; 
let catalogoServicos = [];
let listaPedidosKanban = [];

function formatarBRL(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

async function obterPedidosKanban() {
  try {
    listaPedidosKanban = await API.get('/api/admin/pedidos', token);
    return listaPedidosKanban;
  } catch (error) {
    if (error.message.includes('401')) {
      alert("Sua sessão expirou. Faça login novamente.");
      sessionStorage.removeItem('alva_admin_token');
      window.location.href = 'admin.html';
    } 
    else if (error.message.includes('403')) {
      alert("Você não tem permissão para acessar esta página. Fale com o Administrador.");
      window.location.href = 'admin.html';
    }
    return [];
  }
}

// --- NOTIFICAÇÃO VIA WHATSAPP ---
function dispararNotificacao(codigo, novoStatusDB) {
  const pedido = listaPedidosKanban.find(p => p.codigo === codigo);
  const info = INFO_STATUS[novoStatusDB];
  
  if (!pedido || !info) return;

  const fone = pedido.cliente.whatsapp.startsWith('55') ? pedido.cliente.whatsapp : '55' + pedido.cliente.whatsapp;

  const textoMensagem = `Olá ${pedido.cliente.nome}! Atualização do seu pedido *#${pedido.codigo}* na Lavanderia Alva:\n\n` +
    `📌 *Novo Status:* ${info.titulo}\n` +
    `${info.msg}\n\n` +
    `*Endereço cadastrado:* ${pedido.cliente.endereco}`;

  document.getElementById('notifTitulo').textContent = `Pedido #${pedido.codigo} (${pedido.cliente.nome}) movido para "${info.titulo}"`;
  document.getElementById('notifSubtitulo').textContent = `Dispare o aviso para o WhatsApp do cliente:`;
  
  document.getElementById('notifLinkWhats').href = `https://wa.me/${fone}?text=${encodeURIComponent(textoMensagem)}`;
  document.getElementById('notifLinkEmail').href = `mailto:${pedido.cliente.email}?subject=${encodeURIComponent('Atualização do Pedido #' + pedido.codigo)}&body=${encodeURIComponent(textoMensagem)}`;

  const banner = document.getElementById('notifBanner');
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 10000);
}

// --- ATUALIZAÇÃO DE STATUS ---
async function atualizarStatusPedido(codigo, novoStatusDB) {
  try {
    await API.put(`/api/admin/pedidos/${codigo}/status`, { status: novoStatusDB }, token);
    dispararNotificacao(codigo, novoStatusDB);
    renderizarQuadroKanban(); 
  } catch (error) {
    alert('Erro ao atualizar o status do pedido.');
  }
}

async function excluirPedido(codigo) {
  if (!confirm(`Tem certeza que deseja EXCLUIR permanentemente o pedido #${codigo}?`)) return;
  
  try {
    await API.delete(`/api/admin/pedidos/${codigo}`, token);
    alert('Pedido excluído com sucesso.');
    renderizarQuadroKanban();
  } catch (error) {
    alert('Erro ao excluir o pedido.');
  }
}

function moverStatusPedido(codigo, direcao, statusAtualDB) {
  const idxAtual = ORDEM_COLUNAS.findIndex(c => c.db === statusAtualDB);
  const novoIdx = idxAtual + direcao;
  if (novoIdx >= 0 && novoIdx < ORDEM_COLUNAS.length) {
    atualizarStatusPedido(codigo, ORDEM_COLUNAS[novoIdx].db);
  }
}

// --- DRAG AND DROP ---
let codigoArrastado = null;
let statusArrastado = null;

function iniciarArraste(codigo, status) { 
  codigoArrastado = codigo; 
  statusArrastado = status;
}

function soltarCard(event, novaColunaChave) {
  event.preventDefault();
  if (!codigoArrastado) return;

  const colunaDestino = ORDEM_COLUNAS.find(c => c.chave === novaColunaChave);
  if (colunaDestino && colunaDestino.db !== statusArrastado) {
    atualizarStatusPedido(codigoArrastado, colunaDestino.db);
  }
  codigoArrastado = null;
  statusArrastado = null;
}

// --- RENDERIZAÇÃO ---
async function renderizarQuadroKanban() {
  const pedidos = await obterPedidosKanban();

  ORDEM_COLUNAS.forEach(col => {
    const container = document.getElementById(`col-${col.chave}`);
    const contador = document.getElementById(`count-${col.chave}`);
    if (!container) return;

    const daColuna = pedidos.filter(p => p.status === col.db);
    contador.textContent = daColuna.length;

    container.innerHTML = daColuna.map(p => {
      const idx = ORDEM_COLUNAS.findIndex(c => c.db === p.status);
      const resumoPecas = p.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
      
      return `
        <article class="order-card" draggable="true" ondragstart="iniciarArraste('${p.codigo}', '${p.status}')">
          <div class="order-card-top">
            <span class="order-code">#${p.codigo}</span>
            <span>${p.criadoEm}</span>
          </div>
          <div class="order-client">${p.cliente.nome}</div>
          <div class="order-meta">
            📱 ${p.cliente.whatsapp}
          </div>
          <div class="order-items-pill">
            <strong>Peças:</strong> ${resumoPecas}<br>
            <strong>Total:</strong> ${formatarBRL(p.total)}
          </div>
          <div class="order-actions" style="flex-wrap: wrap; gap: 5px;">
            <button type="button" class="btn-kanban" onclick="abrirModalTriagem('${p.codigo}')" style="background: #F59E0B; color: white; border: none; flex: 1;">
               <span class="material-symbols-outlined" style="font-size:16px;">edit_note</span> Conferir
            </button>
            <button type="button" class="btn-kanban" style="background: #DC2626; color: white; border: none;" onclick="excluirPedido('${p.codigo}')" title="Excluir Pedido">
               <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
            </button>
            <button type="button" class="btn-kanban" ${idx === 0 ? 'disabled' : ''} onclick="moverStatusPedido('${p.codigo}', -1, '${p.status}')">◀</button>
            <button type="button" class="btn-kanban" ${idx === ORDEM_COLUNAS.length - 1 ? 'disabled' : ''} onclick="moverStatusPedido('${p.codigo}', 1, '${p.status}')">▶</button>
          </div>
        </article>
      `;
    }).join('');
  });
}

// --- MODAL DE TRIAGEM ---
async function abrirModalTriagem(codigo) {
  try {
    const [pedido, servicos] = await Promise.all([
      API.get(`/api/pedidos/${codigo}`),
      API.get('/api/servicos')
    ]);
    
    pedidoParaTriagem = pedido;
    catalogoServicos = servicos;
    
    document.getElementById('triagemCodigo').textContent = pedidoParaTriagem.codigo;
    document.getElementById('triagemCliente').textContent = pedidoParaTriagem.cliente.nome;
    
    const select = document.getElementById('selectNovoServico');
    select.innerHTML = '<option value="">Selecione uma peça...</option>' + 
      catalogoServicos.map(s => `<option value="${s.id}">${s.nomePeca} (${s.tipoServico}) - R$ ${s.precoUnitario.toFixed(2)}</option>`).join('');

    itensTriagem = pedidoParaTriagem.itens.map(item => {
       const servico = catalogoServicos.find(s => s.nomePeca === item.nome && s.tipoServico === item.modalidade);
       return {
          idServico: servico ? servico.id : null,
          nome: item.nome,
          modalidade: item.modalidade,
          preco: item.preco,
          quantidade: item.quantidade
       };
    });

    renderizarTabelaTriagem();
    document.getElementById('modalTriagem').style.display = 'flex';

  } catch (error) {
    alert('Erro ao carregar dados para triagem.');
  }
}

function renderizarTabelaTriagem() {
  const tbody = document.getElementById('triagemItensBody');
  tbody.innerHTML = itensTriagem.map((item, index) => `
    <tr>
      <td>${item.nome}</td>
      <td>${item.modalidade}</td>
      <td>${formatarBRL(item.preco)}</td>
      <td>
        <input type="number" min="1" class="inline-price-input" style="width: 60px;" 
               value="${item.quantidade}" onchange="atualizarQtdTriagem(${index}, this.value)">
      </td>
      <td>
        <button type="button" class="btn-kanban" style="background: #DC2626; color: white; border: none;" onclick="removerItemTriagem(${index})">
          <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
        </button>
      </td>
    </tr>
  `).join('');
  recalcularTotalTriagem();
}

function atualizarQtdTriagem(index, novaQtd) {
  itensTriagem[index].quantidade = parseInt(novaQtd) || 1;
  recalcularTotalTriagem();
}

function removerItemTriagem(index) {
  itensTriagem.splice(index, 1);
  renderizarTabelaTriagem();
}

function adicionarItemTriagem() {
  const select = document.getElementById('selectNovoServico');
  const qtdInput = document.getElementById('inputNovaQtd');
  const idServico = parseInt(select.value);
  const quantidade = parseInt(qtdInput.value) || 1;

  if (!idServico) return alert('Selecione uma peça para adicionar.');

  const servico = catalogoServicos.find(s => s.id === idServico);
  
  const itemExistente = itensTriagem.find(i => i.idServico === idServico && i.modalidade === servico.tipoServico);
  if (itemExistente) {
    itemExistente.quantidade += quantidade;
  } else {
    itensTriagem.push({
      idServico: servico.id,
      nome: servico.nomePeca,
      modalidade: servico.tipoServico,
      preco: servico.precoUnitario,
      quantidade: quantidade
    });
  }

  select.value = '';
  qtdInput.value = '1';
  renderizarTabelaTriagem();
}

function recalcularTotalTriagem() {
  let total = 0;
  itensTriagem.forEach(item => {
    total += item.preco * item.quantidade;
  });
  document.getElementById('triagemTotal').textContent = formatarBRL(total);
}

function fecharModalTriagem() {
  document.getElementById('modalTriagem').style.display = 'none';
  pedidoParaTriagem = null;
  itensTriagem = [];
}

async function salvarTriagem() {
  if (itensTriagem.length === 0) return alert('O pedido precisa ter pelo menos um item.');

  const payload = {
    versionPedido: pedidoParaTriagem.version,
    itens: itensTriagem.map(item => ({
      idServico: item.idServico,
      quantidade: item.quantidade
    }))
  };

  try {
    await API.put(`/api/admin/pedidos/${pedidoParaTriagem.codigo}/triagem`, payload, token);
    
    alert('Triagem salva e pedido atualizado!');
    dispararNotificacao(pedidoParaTriagem.codigo, 'Em Andamento');
    
    fecharModalTriagem();
    renderizarQuadroKanban();
  } catch (error) {
    if (error.message.includes('423')) {
      alert('⚠️ Este pedido foi alterado por outro atendente enquanto você editava. Os dados foram atualizados na tela.');
      fecharModalTriagem();
      renderizarQuadroKanban(); 
    } else {
      alert('Erro ao salvar triagem. ' + error.message);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => setTimeout(renderizarQuadroKanban, 100));
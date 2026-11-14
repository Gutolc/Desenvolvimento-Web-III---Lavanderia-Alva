/* ==========================================================
   Kanban - Painel Administrativo de Pedidos (Integrado à API)
   ========================================================== */

const AUTH_KEY = 'alva_admin_token';
const token = sessionStorage.getItem(AUTH_KEY);

if (!token) {
  alert('Acesso restrito ao administrador. Faça login no painel administrativo.');
  window.location.href = 'admin.html';
}

// As colunas visuais do Kanban mapeadas para os nomes exatos no Banco de Dados
const ORDEM_COLUNAS = [
  { chave: 'recebido', db: 'Recebido', titulo: 'Recebido / Coleta Agendada' },
  { chave: 'andamento', db: 'Em Andamento', titulo: 'Em Lavagem & Passadoria' },
  { chave: 'pronto', db: 'Pronto', titulo: 'Pronto & Embalado' },
  { chave: 'entrega', db: 'Saiu para Entrega', titulo: 'Saiu para Entrega' },
  { chave: 'concluido', db: 'Concluído', titulo: 'Entregue / Concluído' }
];

const INFO_STATUS = {
  'Recebido': { titulo: 'Recebido / Coleta Agendada', msg: 'Recebemos seu pedido e nossa equipe já programou a coleta.' },
  'Em Andamento': { titulo: 'Em Andamento (Lavagem)', msg: 'Suas peças já estão em processo de higienização.' },
  'Pronto': { titulo: 'Pronto & Embalado', msg: 'Suas roupas já estão limpas e embaladas aguardando entrega!' },
  'Saiu para Entrega': { titulo: 'Saiu para Entrega', msg: 'Nosso motorista acabou de sair com o seu pacote!' },
  'Concluído': { titulo: 'Pedido Entregue', msg: 'Entrega concluída! Agradecemos pela confiança.' }
};

// Busca os pedidos reais do MySQL
async function obterPedidosKanban() {
  try {
    return await API.get('/api/admin/pedidos', token); // O token JWT é passado no Header
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    if (error.message.includes('401') || error.message.includes('403')) {
      alert("Sessão expirada. Faça login novamente.");
      window.location.href = 'admin.html';
    }
    return [];
  }
}

// Envia a mudança de status para o Backend
async function atualizarStatusPedido(codigo, novoStatusDB) {
  try {
    await API.put(`/api/admin/pedidos/${codigo}/status`, { status: novoStatusDB }, token);
    renderizarQuadroKanban(); // Recarrega o quadro após sucesso
  } catch (error) {
    alert('Erro ao atualizar o status do pedido.');
  }
}

function moverStatusPedido(codigo, direcao, statusAtualDB) {
  const idxAtual = ORDEM_COLUNAS.findIndex(c => c.db === statusAtualDB);
  const novoIdx = idxAtual + direcao;
  
  if (novoIdx >= 0 && novoIdx < ORDEM_COLUNAS.length) {
    const novoStatus = ORDEM_COLUNAS[novoIdx].db;
    atualizarStatusPedido(codigo, novoStatus);
    
    // Para disparar a notificação visual de WhatsApp/E-mail
    prepararDisparoNotificacao(codigo, novoStatus);
  }
}

// Drag and Drop
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
    prepararDisparoNotificacao(codigoArrastado, colunaDestino.db);
  }
  codigoArrastado = null;
  statusArrastado = null;
}

function prepararDisparoNotificacao(codigo, statusDB) {
  const info = INFO_STATUS[statusDB];
  const divBanner = document.getElementById('notifBanner');
  if (!info || !divBanner) return;

  // Como não temos os dados do cliente aqui na função direto, apenas mostramos o aviso genérico
  // Para uma notificação completa, você pode buscar os dados do pedido específico
  document.getElementById('notifTitulo').textContent = `Pedido #${codigo} movido para "${info.titulo}"`;
  document.getElementById('notifSubtitulo').textContent = `O status foi atualizado no banco de dados com sucesso.`;
  
  // Esconde os botões de link (já que não temos o telefone à mão nesta função)
  document.getElementById('notifLinkWhats').style.display = 'none';
  document.getElementById('notifLinkEmail').style.display = 'none';

  divBanner.classList.add('show');
  setTimeout(() => divBanner.classList.remove('show'), 5000);
}

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
            📍 ${p.cliente.endereco}<br>
            📱 ${p.cliente.whatsapp} | ✉️ ${p.cliente.email}
          </div>
          <div class="order-items-pill">
            <strong>Peças:</strong> ${resumoPecas}<br>
            <strong>Total:</strong> R$ ${Number(p.total).toFixed(2).replace('.', ',')} (${p.pagamento})
          </div>
          <div class="order-actions">
            <button type="button" class="btn-kanban" ${idx === 0 ? 'disabled' : ''} onclick="moverStatusPedido('${p.codigo}', -1, '${p.status}')">
              ◀ Voltar
            </button>
            <button type="button" class="btn-kanban notify" onclick="prepararDisparoNotificacao('${p.codigo}', '${p.status}')" title="Notificar cliente">
              <span class="material-symbols-outlined" style="font-size:16px; color:inherit;">notifications_active</span> Avisar
            </button>
            <button type="button" class="btn-kanban" ${idx === ORDEM_COLUNAS.length - 1 ? 'disabled' : ''} onclick="moverStatusPedido('${p.codigo}', 1, '${p.status}')">
              Avançar ▶
            </button>
          </div>
        </article>
      `;
    }).join('');
  });
}

document.addEventListener('DOMContentLoaded', renderizarQuadroCarregamentoInicial);

async function renderizarQuadroCarregamentoInicial() {
    setTimeout(renderizarQuadroKanban, 100);
}
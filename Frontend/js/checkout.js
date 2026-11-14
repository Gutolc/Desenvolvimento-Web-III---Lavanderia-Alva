/* ==========================================================
   Checkout - Envio de Pedido para o Backend
   ========================================================== */

function selecionarPagamento(metodo, elemento) {
  document.getElementById('metodoPagamento').value = metodo;
  document.querySelectorAll('.pay-option').forEach(el => el.classList.remove('active'));
  elemento.classList.add('active');

  const box = document.getElementById('boxSimulacaoPagamento');
  if (metodo === 'PIX Instantâneo') {
    box.innerHTML = `<span class="material-symbols-outlined" style="font-size: 48px;">qr_code_2</span>
      <p style="margin: var(--space-2) 0 0; font-size: var(--text-sm);"><strong>Simulação PIX:</strong> Aprovação imediata ao finalizar.</p>`;
  } else if (metodo === 'Cartão de Crédito') {
    box.innerHTML = `<input type="text" placeholder="Número do Cartão Simulado (4444 5555 6666 7777)" style="width:100%; margin-bottom: 8px;" value="4532 •••• •••• 8891">
      <small style="color: var(--color-text-muted);">Transação simulada aprovada em 1x sem juros.</small>`;
  } else {
    box.innerHTML = `<p style="margin:0; font-size: var(--text-sm);">O pagamento será realizado na entrega das suas roupas limpas.</p>`;
  }
}

function renderizarResumoCheckout() {
  const carrinho = obterCarrinho();
  const lista = document.getElementById('checkoutSummaryList');
  const totalEl = document.getElementById('checkoutTotalValue');

  if (carrinho.length === 0) {
    lista.innerHTML = `<li>Seu cesto está vazio. <a href="precos.html">Clique aqui para escolher os serviços</a>.</li>`;
    totalEl.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  lista.innerHTML = carrinho.map(item => {
    const sub = item.preco * item.quantidade;
    total += sub;
    return `
      <li class="summary-item">
        <span><strong>${item.quantidade}x</strong> ${item.nome} (${item.modalidade})</span>
        <strong>${formatarBRL(sub)}</strong>
      </li>
    `;
  }).join('');

  totalEl.textContent = formatarBRL(total);
}

document.getElementById('orderCheckoutForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const carrinho = obterCarrinho();
  if (carrinho.length === 0) {
    alert('Adicione pelo menos 1 serviço na página de Preços antes de finalizar o pedido.');
    window.location.href = 'precos.html';
    return;
  }

  // Monta o payload para a API
  const payload = {
    nome: document.getElementById('cliNome').value.trim(),
    whatsapp: document.getElementById('cliWhatsapp').value.replace(/\D/g, ''),
    email: document.getElementById('cliEmail').value.trim(),
    cpf: document.getElementById('cliCpf').value.trim(),
    coleta: document.getElementById('cliDataColeta').value,
    endereco: `${document.getElementById('cliRua').value.trim()}, ${document.getElementById('cliBairro').value.trim()} (CEP: ${document.getElementById('cliCep').value.trim()}) ${document.getElementById('cliComp').value.trim()}`,
    pagamento: document.getElementById('metodoPagamento').value,
    itens: carrinho.map(i => ({
      idServico: i.idProduto,
      quantidade: i.quantidade
    }))
  };

  try {
    const resposta = await API.post('/api/pedidos', payload);

    // Limpa o carrinho
    limparCarrinhoTotal();

    // Prepara os links de notificação
    const resumoItens = resposta.itens.map(i => `${i.quantidade}x ${i.nome} (${i.modalidade})`).join(', ');
    const msgTexto = `Olá ${resposta.cliente.nome}! A Lavanderia Alva recebeu seu pedido *#${resposta.codigo}*.\n\n` +
      `*Status atual:* Recebido / Coleta Agendada (${payload.coleta})\n` +
      `*Serviços:* ${resumoItens}\n` +
      `*Total:* ${formatarBRL(resposta.total)} (${resposta.pagamento})\n` +
      `*Endereço:* ${resposta.cliente.endereco}\n\n` +
      `Avisaremos por aqui assim que suas peças entrarem em lavagem e quando saírem para entrega!`;

    const foneLimpo = resposta.cliente.whatsapp.startsWith('55')
      ? resposta.cliente.whatsapp
      : '55' + resposta.cliente.whatsapp;

    document.getElementById('sucessoCodigoPedido').textContent = '#' + resposta.codigo;
    document.getElementById('sucessoResumoNotificacao').textContent =
      `Notificações configuradas para o WhatsApp (${resposta.cliente.whatsapp}) e E-mail (${resposta.cliente.email}).`;

    document.getElementById('btnNotificarWhatsAppCliente').href =
      `https://wa.me/${foneLimpo}?text=${encodeURIComponent(msgTexto)}`;
    document.getElementById('btnNotificarEmailCliente').href =
      `mailto:${resposta.cliente.email}?subject=${encodeURIComponent('Pedido #' + resposta.codigo + ' Confirmado - Lavanderia Alva')}&body=${encodeURIComponent(msgTexto)}`;
    document.getElementById('btnRastrearCliente').href = 'meu-pedido.html?codigo=' + resposta.codigo;

    document.getElementById('checkoutMain').style.display = 'none';
    document.getElementById('orderSuccessCard').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (erro) {
    console.error(erro);
    alert('Erro ao enviar o pedido. Verifique se o servidor está rodando e tente novamente.');
  }
});

document.addEventListener('DOMContentLoaded', renderizarResumoCheckout);
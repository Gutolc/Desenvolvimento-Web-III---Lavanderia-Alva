/* ==========================================================
   Lavanderia Alva: Carrinho Global Persistente
   ========================================================== */

const CART_STORAGE_KEY = 'alva_carrinho_cliente';

function obterCarrinho() {
  const salvo = localStorage.getItem(CART_STORAGE_KEY);
  return salvo ? JSON.parse(salvo) : [];
}

function salvarCarrinho(itens) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itens));
  atualizarInterfaceCarrinho();
}

function adicionarAoCarrinho(idProduto, nome, modalidade, preco, unidade) {
  const carrinho = obterCarrinho();
  const chaveItem = `${idProduto}_${modalidade}`;
  const existente = carrinho.find(i => i.chave === chaveItem);

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({
      chave: chaveItem,
      idProduto,
      nome,
      modalidade,
      preco: Number(preco),
      unidade,
      quantidade: 1
    });
  }

  salvarCarrinho(carrinho);
  abrirGavetaCarrinho();
}

function alterarQuantidadeCarrinho(chaveItem, delta) {
  let carrinho = obterCarrinho();
  const item = carrinho.find(i => i.chave === chaveItem);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(i => i.chave !== chaveItem);
  }
  salvarCarrinho(carrinho);
}

function limparCarrinhoTotal() {
  localStorage.removeItem(CART_STORAGE_KEY);
  atualizarInterfaceCarrinho();
}

function formatarBRL(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function inicializarComponenteCarrinho() {
  // 1. Insere o botão na .nav-links da página
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const li = document.createElement('li');
    li.innerHTML = `
      <button type="button" class="cart-nav-btn" onclick="abrirGavetaCarrinho()" aria-label="Abrir carrinho de pedidos">
        <span class="material-symbols-outlined">shopping_bag</span>
        <span>Cesto</span>
        <span class="cart-badge-count" id="globalCartCount">0</span>
      </button>
    `;
    navLinks.appendChild(li);
  }

  // 2. Cria o HTML da gaveta lateral
  const drawerWrapper = document.createElement('div');
  drawerWrapper.innerHTML = `
    <div class="cart-drawer-backdrop" id="cartBackdrop" onclick="fecharGavetaCarrinho()"></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Cesto de Pedidos">
      <div class="cart-drawer-header">
        <h3><span class="material-symbols-outlined">shopping_bag</span> Seu Pedido</h3>
        <button type="button" class="cart-qty-btn" onclick="fecharGavetaCarrinho()">✕</button>
      </div>
      <div class="cart-drawer-body" id="cartDrawerBody"></div>
      <div class="cart-drawer-footer">
        <div class="cart-total-line">
          <span>Total Estimado:</span>
          <span id="cartDrawerTotal">R$ 0,00</span>
        </div>
        <a href="pedido.html" class="btn btn-primary" style="width: 100%; justify-content: center;">
          <span class="material-symbols-outlined">payments</span>
          Avançar para Pagamento
        </a>
      </div>
    </aside>
  `;
  document.body.appendChild(drawerWrapper);

  atualizarInterfaceCarrinho();
}

function abrirGavetaCarrinho() {
  document.getElementById('cartBackdrop')?.classList.add('open');
  document.getElementById('cartDrawer')?.classList.add('open');
}

function fecharGavetaCarrinho() {
  document.getElementById('cartBackdrop')?.classList.remove('open');
  document.getElementById('cartDrawer')?.classList.remove('open');
}

function atualizarInterfaceCarrinho() {
  const carrinho = obterCarrinho();
  const totalQtd = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
  const valorTotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);

  const badge = document.getElementById('globalCartCount');
  if (badge) badge.textContent = totalQtd;

  const body = document.getElementById('cartDrawerBody');
  const totalEl = document.getElementById('cartDrawerTotal');
  if (!body || !totalEl) return;

  totalEl.textContent = formatarBRL(valorTotal);

  if (carrinho.length === 0) {
    body.innerHTML = `
      <p style="text-align:center; color: var(--color-text-muted); margin-top: var(--space-8);">
        Seu cesto ainda está vazio.<br>Selecione as peças na página de <strong>Preços</strong>.
      </p>
    `;
    return;
  }

  body.innerHTML = carrinho.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <strong>${item.nome}</strong>
        <span>${item.modalidade} • ${formatarBRL(item.preco)}/${item.unidade}</span>
      </div>
      <div class="cart-qty-controls">
        <button type="button" class="cart-qty-btn" onclick="alterarQuantidadeCarrinho('${item.chave}', -1)">-</button>
        <strong>${item.quantidade}</strong>
        <button type="button" class="cart-qty-btn" onclick="alterarQuantidadeCarrinho('${item.chave}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', inicializarComponenteCarrinho);
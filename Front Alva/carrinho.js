/* ==========================================================
   Lavanderia Alva: Carrinho Global Persistente
   Injeta o ícone na navbar e a gaveta lateral em qualquer página
   ========================================================== */

/* ==========================================================================
   1. CAMADA MODEL (Armazenamento Chave-Valor / Hash Map do Cesto de Compras)
   ========================================================================== */
const CART_STORAGE_KEY = 'alva_carrinho_cliente';

function obterCarrinho() {
  const salvo = localStorage.getItem(CART_STORAGE_KEY);
  return salvo ? JSON.parse(salvo) : [];
}

function salvarCarrinho(itens) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itens));
  atualizarInterfaceCarrinho();
}

/* ==========================================================================
   2. CAMADA CONTROLLER (Regras de Negócio: Adicionar, Alterar Qtd e Limpar)
   ========================================================================== */
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

/* ==========================================================================
   3. CAMADA VIEW (Injeção Automática do Badge na Navbar e Gaveta Lateral)
   ========================================================================== */
function inicializarComponenteCarrinho() {
  // 1. Injeta estilos do Drawer e Badge respeitando tokens.css
  const style = document.createElement('style');
  style.textContent = `
    .cart-nav-btn {
      position: relative;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-2) var(--space-3);
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      font-family: var(--font-body);
      font-weight: 600;
      color: var(--color-text);
    }
    .cart-nav-btn:hover { background: var(--color-primary-light); }
    .cart-badge-count {
      background: var(--color-primary-dark);
      color: var(--color-surface);
      font-size: var(--text-xs);
      font-weight: 700;
      min-width: 22px;
      height: 22px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      padding: 0 6px;
    }
    .cart-drawer-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45);
      z-index: 998; display: none;
    }
    .cart-drawer-backdrop.open { display: block; }
    .cart-drawer {
      position: fixed; top: 0; right: -420px; width: min(400px, 92vw); height: 100vh;
      background: var(--color-surface); z-index: 999;
      box-shadow: -8px 0 28px rgba(3, 105, 161, 0.18);
      display: flex; flex-direction: column; justify-content: space-between;
      transition: right 0.25s ease;
    }
    .cart-drawer.open { right: 0; }
    .cart-drawer-header {
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--color-border);
      display: flex; justify-content: space-between; align-items: center;
    }
    .cart-drawer-header h3 { margin: 0; font-size: var(--text-lg); display: flex; align-items: center; gap: var(--space-2); }
    .cart-drawer-body {
      padding: var(--space-4) var(--space-6);
      overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: var(--space-3);
    }
    .cart-item-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: var(--space-3); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); background: var(--color-bg);
    }
    .cart-item-info strong { display: block; font-size: var(--text-sm); }
    .cart-item-info span { font-size: var(--text-xs); color: var(--color-text-muted); }
    .cart-qty-controls { display: flex; align-items: center; gap: var(--space-2); }
    .cart-qty-btn {
      width: 26px; height: 26px; border-radius: var(--radius-sm);
      border: 1px solid var(--color-border); background: var(--color-surface);
      cursor: pointer; font-weight: 700; color: var(--color-primary-dark);
    }
    .cart-drawer-footer {
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
    }
    .cart-total-line {
      display: flex; justify-content: space-between; align-items: center;
      font: 700 var(--text-lg) var(--font-title); margin-bottom: var(--space-4);
    }
    .btn-add-cell {
      background: var(--color-primary-light); color: var(--color-primary-dark);
      border: none; border-radius: var(--radius-sm); padding: 4px 8px;
      margin-left: 6px; cursor: pointer; font-weight: 700; font-size: var(--text-xs);
      transition: background 0.15s;
    }
    .btn-add-cell:hover {
      background: var(--color-primary); color: var(--color-surface);
    }
  `;
  document.head.appendChild(style);

  // 2. Insere o botão na .nav-links da página
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

  // 3. Cria o HTML da gaveta lateral
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
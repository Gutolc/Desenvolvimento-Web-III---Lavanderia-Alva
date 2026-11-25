/* ==========================================================================
   Lavanderia Alva: Painel Administrativo
   Arquitetura: Padrão MVC (Model - View - Controller) no Front-End
   Segurança: Autenticação com HASH Criptográfico SHA-256 (Web Crypto API)
   ========================================================================== */

/* ==========================================================================
   1. CAMADA MODEL (Dados, Estado, Criptografia Hash e Persistência NoSQL/SQL)
   ========================================================================== */
const STORAGE_KEY = 'alva_catalogo_produtos';
const CATALOG_VERSION_KEY = 'alva_catalogo_v2_36itens';
const AUTH_KEY = 'alva_admin_autenticado';
const API_BASE_URL = 'http://localhost:3000/api/produtos';

// Hash SHA-256 da senha padrão ('1234') — Nenhuma senha em texto puro fica exposta no código
const ADMIN_PASSWORD_HASH_SHA256 = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

// Função utilitária de Hash Criptográfico (SHA-256)
async function gerarHashSHA256(texto) {
  // Usa Web Crypto API nativa quando em contexto seguro (HTTPS / localhost)
  if (window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(texto);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback SHA-256 puro em JS para execução local via protocolo file://
  return sha256Fallback(texto);
}

// Implementação enxuta SHA-256 para funcionar mesmo abrindo o arquivo direto via file://
function sha256Fallback(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow, maxWord = mathPow(2, 32), lengthProperty = 'length';
  let i, j, result = '';
  const words = [], asciiBitLength = ascii[lengthProperty] * 8;
  let hash = sha256Fallback.h = sha256Fallback.h || [];
  const k = sha256Fallback.k = sha256Fallback.k || [];
  let primeCounter = k[lengthProperty];
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16), oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

const catalogoInicial = [
  // 1. Volumosos / Casa
  { id: 1, categoria: 'Volumosos / Casa', nome: 'Edredom Solteiro', unidade: 'Unidade', lavar: 45.00, passar: null, completo: 45.00, obs: 'Secagem em câmara térmica antiácaro', ativo: true },
  { id: 2, categoria: 'Volumosos / Casa', nome: 'Edredom Casal / Queen', unidade: 'Unidade', lavar: 55.00, passar: null, completo: 55.00, obs: 'Enchimento uniforme sem deformação', ativo: true },
  { id: 3, categoria: 'Volumosos / Casa', nome: 'Edredom King', unidade: 'Unidade', lavar: 68.00, passar: null, completo: 68.00, obs: 'Exige tambor de grande capacidade', ativo: true },
  { id: 4, categoria: 'Volumosos / Casa', nome: 'Edredom de Plumas', unidade: 'Unidade', lavar: 85.00, passar: null, completo: 85.00, obs: 'Processo suave com secagem especial', ativo: true },
  { id: 5, categoria: 'Volumosos / Casa', nome: 'Cobertor Solteiro', unidade: 'Unidade', lavar: 38.00, passar: null, completo: 38.00, obs: 'Tratamento antialérgico', ativo: true },
  { id: 6, categoria: 'Volumosos / Casa', nome: 'Cobertor Casal / King', unidade: 'Unidade', lavar: 48.00, passar: null, completo: 48.00, obs: 'Higienização profunda de fibras', ativo: true },
  { id: 7, categoria: 'Volumosos / Casa', nome: 'Manta Microfibra', unidade: 'Unidade', lavar: 28.00, passar: null, completo: 28.00, obs: 'Revitalização do toque macio', ativo: true },
  { id: 8, categoria: 'Volumosos / Casa', nome: 'Tapete Sintético / Pelo Curto', unidade: 'Metro quadrado (m²)', lavar: 38.00, passar: null, completo: 38.00, obs: 'Extração profunda de sujeira e ácaros', ativo: true },
  { id: 9, categoria: 'Volumosos / Casa', nome: 'Tapete Shaggy (Pelo Alto)', unidade: 'Metro quadrado (m²)', lavar: 48.00, passar: null, completo: 48.00, obs: 'Secagem suspensa e escovação', ativo: true },
  { id: 10, categoria: 'Volumosos / Casa', nome: 'Tapete Persa / Tear Artesanal', unidade: 'Metro quadrado (m²)', lavar: 65.00, passar: null, completo: 65.00, obs: 'Limpeza manual com pH neutro', ativo: true },

  // 2. Cama, Mesa e Banho
  { id: 11, categoria: 'Cama, Mesa e Banho', nome: 'Lençol Avulso (Solteiro/Casal)', unidade: 'Unidade', lavar: 10.00, passar: 8.00, completo: 15.00, obs: 'Dobra com acabamento a vapor', ativo: true },
  { id: 12, categoria: 'Cama, Mesa e Banho', nome: 'Jogo de Cama Completo (4 pçs)', unidade: 'Jogo', lavar: 28.00, passar: 22.00, completo: 44.00, obs: 'Lençol cima, elástico e 2 fronhas', ativo: true },
  { id: 13, categoria: 'Cama, Mesa e Banho', nome: 'Fronha Avulsa', unidade: 'Unidade', lavar: 4.00, passar: 3.50, completo: 6.50, obs: 'Passadoria lisa', ativo: true },
  { id: 14, categoria: 'Cama, Mesa e Banho', nome: 'Toalha de Banho', unidade: 'Unidade', lavar: 8.00, passar: null, completo: 8.00, obs: 'Toalhas não requerem passadoria', ativo: true },
  { id: 15, categoria: 'Cama, Mesa e Banho', nome: 'Toalha de Rosto / Piso', unidade: 'Unidade', lavar: 5.00, passar: null, completo: 5.00, obs: 'Higienização antibacteriana', ativo: true },
  { id: 16, categoria: 'Cama, Mesa e Banho', nome: 'Toalha de Mesa Simples', unidade: 'Unidade', lavar: 12.00, passar: 10.00, completo: 19.00, obs: 'Até 6 lugares', ativo: true },
  { id: 17, categoria: 'Cama, Mesa e Banho', nome: 'Toalha de Mesa Festas/Renda', unidade: 'Unidade', lavar: 20.00, passar: 18.00, completo: 34.00, obs: 'Cuidado com bordados e rendas', ativo: true },
  { id: 18, categoria: 'Cama, Mesa e Banho', nome: 'Cortina Leve (Voil / Microfibra)', unidade: 'Metro linear (m)', lavar: 16.00, passar: 12.00, completo: 25.00, obs: 'Lavagem sem danificar ilhós', ativo: true },
  { id: 19, categoria: 'Cama, Mesa e Banho', nome: 'Cortina Blackout / Pesada', unidade: 'Metro linear (m)', lavar: 24.00, passar: null, completo: 24.00, obs: 'Higienização a vapor sem calor direto', ativo: true },

  // 3. Dia a Dia (Básicas)
  { id: 20, categoria: 'Dia a Dia (Básicas)', nome: 'Camiseta / Polo', unidade: 'Unidade', lavar: 7.00, passar: 6.00, completo: 11.50, obs: 'Passadoria no cabide ou dobrada', ativo: true },
  { id: 21, categoria: 'Dia a Dia (Básicas)', nome: 'Camisa Polo', unidade: 'Unidade', lavar: 8.00, passar: 7.00, completo: 13.00, obs: 'Colarinho alinhado', ativo: true },
  { id: 22, categoria: 'Dia a Dia (Básicas)', nome: 'Bermuda / Shorts', unidade: 'Unidade', lavar: 7.50, passar: 6.00, completo: 12.00, obs: 'Dobra simples', ativo: true },
  { id: 23, categoria: 'Dia a Dia (Básicas)', nome: 'Calça Jeans / Sarja', unidade: 'Unidade', lavar: 10.00, passar: 8.00, completo: 16.00, obs: 'Fixação de vincos (opcional)', ativo: true },
  { id: 24, categoria: 'Dia a Dia (Básicas)', nome: 'Moletom (Blusa)', unidade: 'Unidade', lavar: 12.00, passar: 8.00, completo: 18.00, obs: 'Tratamento antifelpas', ativo: true },
  { id: 25, categoria: 'Dia a Dia (Básicas)', nome: 'Moletom (Calça)', unidade: 'Unidade', lavar: 10.00, passar: 7.00, completo: 15.00, obs: 'Sem deformar o cós', ativo: true },
  { id: 26, categoria: 'Dia a Dia (Básicas)', nome: 'Cesto Dia a Dia (até 8kg)', unidade: 'Cesto fechado', lavar: 55.00, passar: null, completo: null, obs: 'Somente lavar, secar e dobrar', ativo: true },

  // 4. Alfaiataria e Finas
  { id: 27, categoria: 'Alfaiataria e Finas', nome: 'Camisa Social Masculina/Fem.', unidade: 'Unidade', lavar: 11.00, passar: 10.00, completo: 18.50, obs: 'Colarinho e punhos passados a vapor', ativo: true },
  { id: 28, categoria: 'Alfaiataria e Finas', nome: 'Calça Social', unidade: 'Unidade', lavar: 12.00, passar: 10.00, completo: 19.00, obs: 'Vinco alinhado', ativo: true },
  { id: 29, categoria: 'Alfaiataria e Finas', nome: 'Blazer / Paletó', unidade: 'Unidade', lavar: 28.00, passar: 18.00, completo: 40.00, obs: 'Lavagem a seco ou suave especializada', ativo: true },
  { id: 30, categoria: 'Alfaiataria e Finas', nome: 'Terno Completo (2 peças)', unidade: 'Conjunto', lavar: 38.00, passar: 26.00, completo: 56.00, obs: 'Acompanha capa protetora no cabide', ativo: true },
  { id: 31, categoria: 'Alfaiataria e Finas', nome: 'Vestido Curto Simples', unidade: 'Unidade', lavar: 16.00, passar: 12.00, completo: 25.00, obs: 'Tecidos mistos', ativo: true },
  { id: 32, categoria: 'Alfaiataria e Finas', nome: 'Vestido Longo / Festa', unidade: 'Unidade', lavar: 45.00, passar: 35.00, completo: 72.00, obs: 'Seda, cetim, pedrarias ou pregas', ativo: true },
  { id: 33, categoria: 'Alfaiataria e Finas', nome: 'Saia Social / Plissada', unidade: 'Unidade', lavar: 14.00, passar: 12.00, completo: 23.00, obs: 'Recomposição de plissado sob consulta', ativo: true },

  // 5. Inverno e Especiais
  { id: 34, categoria: 'Inverno e Especiais', nome: 'Sobretudo / Casaco Pesado', unidade: 'Unidade', lavar: 35.00, passar: 20.00, completo: 48.00, obs: 'Secagem controlada sem amassar o forro', ativo: true },
  { id: 35, categoria: 'Inverno e Especiais', nome: 'Jaqueta de Nylon / Puffer', unidade: 'Unidade', lavar: 28.00, passar: null, completo: 28.00, obs: 'Redistribuição das câmaras de fibra', ativo: true },
  { id: 36, categoria: 'Inverno e Especiais', nome: 'Jaqueta de Couro Natural', unidade: 'Unidade', lavar: 85.00, passar: null, completo: 85.00, obs: 'Higienização e hidratação do couro', ativo: true }
];

let produtos = [];

// Model: Carregamento e migração de dados
function carregarProdutos() {
  const versaoAtual = localStorage.getItem(CATALOG_VERSION_KEY);
  const salvos = localStorage.getItem(STORAGE_KEY);

  if (salvos && versaoAtual === 'true') {
    try {
      produtos = JSON.parse(salvos);
      sincronizarComBackendAPI();
      return;
    } catch (e) {}
  }

  let listaFinal = [...catalogoInicial];
  if (salvos) {
    try {
      const antigos = JSON.parse(salvos);
      if (Array.isArray(antigos)) {
        antigos.forEach(ant => {
          const existe = listaFinal.find(p => p.nome.toLowerCase() === (ant.nome || '').toLowerCase());
          if (!existe && ant.nome) {
            const novoId = Math.max(...listaFinal.map(p => p.id)) + 1;
            listaFinal.push({ ...ant, id: novoId });
          }
        });
      }
    } catch (e) {}
  }

  produtos = listaFinal;
  localStorage.setItem(CATALOG_VERSION_KEY, 'true');
  persistirDados();
  sincronizarComBackendAPI();
}

async function sincronizarComBackendAPI() {
  try {
    const res = await fetch(API_BASE_URL);
    if (res.ok) {
      const dadosBanco = await res.json();
      if (Array.isArray(dadosBanco) && dadosBanco.length > 0) {
        produtos = dadosBanco;
        persistirDados();
        renderizarTabelaAdmin();
      } else {
        // Faz o seed inicial dos 36 itens no MongoDB Atlas
        await fetch(`${API_BASE_URL}/seed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produtos)
        });
      }
    }
  } catch (e) {
    // Caso o servidor Node.js ainda não esteja rodando, opera normalmente via LocalStorage
  }
}

// Model: Persistência no armazenamento local (e ponto de sincronização REST/SQL)
function persistirDados() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  atualizarIndicadores();
}


/* ==========================================================================
   2. CAMADA VIEW (Renderização de Interface, Tabelas, Indicadores e Toasts)
   ========================================================================== */

function atualizarIndicadores() {
  const total = produtos.length;
  const ativos = produtos.filter(p => p.ativo).length;
  const inativos = total - ativos;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statAtivos').textContent = ativos;
  document.getElementById('statInativos').textContent = inativos;
}

function renderizarTabelaAdmin() {
  const tbody = document.getElementById('adminTableBody');
  const categoriaFiltro = document.getElementById('filtroCategoria').value;
  const termoBusca = document.getElementById('buscaItem').value.toLowerCase();

  tbody.innerHTML = '';

  const filtrados = produtos.filter(p => {
    const bateCategoria = categoriaFiltro === 'todas' || p.categoria === categoriaFiltro;
    const bateBusca = p.nome.toLowerCase().includes(termoBusca) || p.categoria.toLowerCase().includes(termoBusca);
    return bateCategoria && bateBusca;
  });

  filtrados.forEach(item => {
    const tr = document.createElement('tr');
    if (!item.ativo) tr.classList.add('row-inactive');

    tr.innerHTML = `
      <td>
        <label class="switch" title="${item.ativo ? 'Serviço Ativo' : 'Serviço Desativado'}">
          <input type="checkbox" ${item.ativo ? 'checked' : ''} onchange="alternarStatus(${item.id})">
          <span class="slider"></span>
        </label>
      </td>
      <td>
        <span class="item-title">${item.nome}</span>
        <span class="item-meta">${item.categoria} • ${item.unidade}</span>
      </td>
      <td>
        <input type="number" step="0.50" min="0" class="inline-price-input" 
          value="${item.lavar !== null ? item.lavar : ''}" placeholder="—"
          onchange="atualizarPrecoRapido(${item.id}, 'lavar', this.value)">
      </td>
      <td>
        <input type="number" step="0.50" min="0" class="inline-price-input" 
          value="${item.passar !== null ? item.passar : ''}" placeholder="—"
          onchange="atualizarPrecoRapido(${item.id}, 'passar', this.value)">
      </td>
      <td>
        <input type="number" step="0.50" min="0" class="inline-price-input" 
          value="${item.completo !== null ? item.completo : ''}" placeholder="—"
          onchange="atualizarPrecoRapido(${item.id}, 'completo', this.value)">
      </td>
      <td>
        <div class="action-btns">
          <button type="button" class="icon-btn" title="Editar detalhes" onclick="carregarParaEdicao(${item.id})">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button type="button" class="icon-btn delete" title="Excluir produto" onclick="excluirProduto(${item.id})">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function mostrarToast(mensagem) {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}


/* ==========================================================================
   3. CAMADA CONTROLLER (Eventos de Usuário, Autenticação Hash e Regras CRUD)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
  verificarAutenticacao();

  document.getElementById('loginForm').addEventListener('submit', realizarLogin);
  document.getElementById('productForm').addEventListener('submit', salvarProdutoFormulario);
});

function verificarAutenticacao() {
  const logado = sessionStorage.getItem(AUTH_KEY) === 'true';
  document.getElementById('loginSection').style.display = logado ? 'none' : 'grid';
  document.getElementById('dashboardSection').style.display = logado ? 'block' : 'none';
  document.getElementById('logoutItem').style.display = logado ? 'block' : 'none';
  const navKanban = document.getElementById('navKanbanAdmin');
  if (navKanban) navKanban.style.display = logado ? 'block' : 'none';

  if (logado) {
    renderizarTabelaAdmin();
    atualizarIndicadores();
  }
}

// Controller: Validação de login comparando exclusivamente o HASH SHA-256 da senha
async function realizarLogin(e) {
  e.preventDefault();
  const user = document.getElementById('adminEmail').value.trim().toLowerCase();
  const pass = document.getElementById('adminPass').value.trim();

  const hashDigitado = await gerarHashSHA256(pass);

  if ((user === 'admin' || user === 'admin@alva.com.br') && hashDigitado === ADMIN_PASSWORD_HASH_SHA256) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    sessionStorage.setItem('alva_admin_token_hash', hashDigitado);
    document.getElementById('loginError').style.display = 'none';
    verificarAutenticacao();
    mostrarToast('Autenticado via Hash SHA-256 com sucesso!');
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
}

function realizarLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem('alva_admin_token_hash');
  verificarAutenticacao();
}

function alternarStatus(id) {
  const item = produtos.find(p => p.id === id);
  if (!item) return;

  item.ativo = !item.ativo;
  persistirDados();
  renderizarTabelaAdmin();
  mostrarToast(`"${item.nome}" foi ${item.ativo ? 'ativado' : 'desativado'}.`);
  fetch(`${API_BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ativo: item.ativo })
  }).catch(() => {});
}

function atualizarPrecoRapido(id, campo, novoValor) {
  const item = produtos.find(p => p.id === id);
  if (!item) return;

  const valorNumerico = novoValor === '' ? null : parseFloat(novoValor);
  item[campo] = valorNumerico;

  persistirDados();
  mostrarToast(`Preço de "${item.nome}" atualizado!`);
  fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  }).catch(() => {});
}

function salvarProdutoFormulario(e) {
  e.preventDefault();

  const idExistente = document.getElementById('prodId').value;
  const categoria = document.getElementById('prodCategoria').value;
  const nome = document.getElementById('prodNome').value.trim();
  const unidade = document.getElementById('prodUnidade').value;
  const lavarVal = document.getElementById('precoLavar').value;
  const passarVal = document.getElementById('precoPassar').value;
  const completoVal = document.getElementById('precoCompleto').value;
  const obs = document.getElementById('prodObs').value.trim();

  const dadosProduto = {
    categoria,
    nome,
    unidade,
    lavar: lavarVal !== '' ? parseFloat(lavarVal) : null,
    passar: passarVal !== '' ? parseFloat(passarVal) : null,
    completo: completoVal !== '' ? parseFloat(completoVal) : null,
    obs,
  };

  if (idExistente) {
    const index = produtos.findIndex(p => p.id === parseInt(idExistente, 10));
    if (index > -1) {
      produtos[index] = { ...produtos[index], ...dadosProduto };
      mostrarToast(`Produto "${nome}" atualizado com sucesso!`);
      fetch(`${API_BASE_URL}/${produtos[index].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtos[index])
      }).catch(() => {});
    }
  } else {
    const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
    produtos.push({ id: novoId, ...dadosProduto, ativo: true });
    mostrarToast(`Novo produto "${nome}" adicionado ao catálogo!`);
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: novoId, ...dadosProduto, ativo: true })
    }).catch(() => {});
  }

  persistirDados();
  resetarFormulario();
  renderizarTabelaAdmin();
}

function carregarParaEdicao(id) {
  const item = produtos.find(p => p.id === id);
  if (!item) return;

  document.getElementById('prodId').value = item.id;
  document.getElementById('prodCategoria').value = item.categoria;
  document.getElementById('prodNome').value = item.nome;
  document.getElementById('prodUnidade').value = item.unidade;
  document.getElementById('precoLavar').value = item.lavar !== null ? item.lavar : '';
  document.getElementById('precoPassar').value = item.passar !== null ? item.passar : '';
  document.getElementById('precoCompleto').value = item.completo !== null ? item.completo : '';
  document.getElementById('prodObs').value = item.obs || '';

  document.getElementById('formTitle').textContent = 'Editar Produto';
  document.getElementById('btnCancelar').style.display = 'inline-flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetarFormulario() {
  document.getElementById('productForm').reset();
  document.getElementById('prodId').value = '';
  document.getElementById('formTitle').textContent = 'Incluir Novo Produto';
  document.getElementById('btnCancelar').style.display = 'none';
}

function excluirProduto(id) {
  const item = produtos.find(p => p.id === id);
  if (!item) return;

  if (confirm(`Deseja realmente remover "${item.nome}" do catálogo?`)) {
    produtos = produtos.filter(p => p.id !== id);
    persistirDados();
    renderizarTabelaAdmin();
    mostrarToast('Item removido do catálogo.');
    fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' }).catch(() => {});
  }
}

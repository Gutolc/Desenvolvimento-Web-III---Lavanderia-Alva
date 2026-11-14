/* ==========================================================
   Lavanderia Alva: Painel Administrativo (Integrado à API)
   ========================================================== */

const AUTH_KEY = 'alva_admin_token';

// --- 1. MODEL (Dados e API) ---
let produtos = [];

// Busca o catálogo do banco e agrupa igual ao precos.js
async function carregarProdutos() {
  try {
    const servicosApi = await API.get('/api/servicos');
    const produtosAgrupados = {};

    servicosApi.forEach(s => {
      if (!produtosAgrupados[s.nomePeca]) {
        produtosAgrupados[s.nomePeca] = {
          nome: s.nomePeca,
          categoria: s.nomeCategoria,
          unidade: s.unidadeCobranca,
          obs: s.observacoes,
          lavar: null, idLavar: null,
          passar: null, idPassar: null,
          completo: null, idCompleto: null
        };
      }
      if (s.tipoServico === 'Lavar') { produtosAgrupados[s.nomePeca].lavar = s.precoUnitario; produtosAgrupados[s.nomePeca].idLavar = s.id; }
      else if (s.tipoServico === 'Passar') { produtosAgrupados[s.nomePeca].passar = s.precoUnitario; produtosAgrupados[s.nomePeca].idPassar = s.id; }
      else if (s.tipoServico === 'Lavar + Passar') { produtosAgrupados[s.nomePeca].completo = s.precoUnitario; produtosAgrupados[s.nomePeca].idCompleto = s.id; }
    });

    produtos = Object.values(produtosAgrupados).map((p, index) => ({ ...p, id: index + 1, ativo: true }));
    atualizarIndicadores();
    renderizarTabelaAdmin();
  } catch (error) {
    console.error(error);
    mostrarToast('Erro ao carregar catálogo. O servidor está rodando?');
  }
}

/* ==========================================================================
   2. CAMADA VIEW (Renderização de Interface)
   ========================================================================== */
function atualizarIndicadores() {
  document.getElementById('statTotal').textContent = produtos.length;
  document.getElementById('statAtivos').textContent = produtos.length;
  document.getElementById('statInativos').textContent = 0;
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
    tr.innerHTML = `
      <td><input type="checkbox" checked disabled title="Status (Em breve)"></td>
      <td>
        <span class="item-title">${item.nome}</span>
        <span class="item-meta">${item.categoria} • ${item.unidade}</span>
      </td>
      <td><input type="number" class="inline-price-input" value="${item.lavar !== null ? item.lavar : ''}" placeholder="—" disabled></td>
      <td><input type="number" class="inline-price-input" value="${item.passar !== null ? item.passar : ''}" placeholder="—" disabled></td>
      <td><input type="number" class="inline-price-input" value="${item.completo !== null ? item.completo : ''}" placeholder="—" disabled></td>
      <td>
        <div class="action-btns">
          <button type="button" class="icon-btn" onclick="alert('Rota de edição em construção no Backend!')"><span class="material-symbols-outlined">edit</span></button>
          <button type="button" class="icon-btn delete" onclick="alert('Rota de exclusão em construção no Backend!')"><span class="material-symbols-outlined">delete</span></button>
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
   3. CAMADA CONTROLLER (Login e Eventos)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  verificarAutenticacao();

  document.getElementById('loginForm').addEventListener('submit', realizarLogin);
  // O form de produto está desativado temporariamente até o Backend ter a rota POST
  document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Para adicionar novos produtos, precisamos criar o endpoint POST no Backend (Fase 6).');
  });
});

function verificarAutenticacao() {
  const token = sessionStorage.getItem(AUTH_KEY);
  const logado = !!token;

  document.getElementById('loginSection').style.display = logado ? 'none' : 'grid';
  document.getElementById('dashboardSection').style.display = logado ? 'block' : 'none';
  document.getElementById('logoutItem').style.display = logado ? 'block' : 'none';
  
  const navKanban = document.getElementById('navKanbanAdmin');
  if (navKanban) navKanban.style.display = logado ? 'block' : 'none';

  if (logado) {
    carregarProdutos();
  }
}

// Login Real no Backend via JWT
async function realizarLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value.trim();
  const senha = document.getElementById('adminPass').value;

  try {
    // Envia as credenciais para o Spring Boot
    const resposta = await API.post('/api/auth/login', { email, senha });
    
    // Salva o Token JWT no navegador
    sessionStorage.setItem(AUTH_KEY, resposta.token);
    document.getElementById('loginError').style.display = 'none';
    
    verificarAutenticacao();
    mostrarToast('Login realizado com sucesso!');
  } catch (error) {
    document.getElementById('loginError').style.display = 'block';
  }
}

function realizarLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  verificarAutenticacao();
}
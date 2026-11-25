/* ==========================================================
   Lavanderia Alva: Renderização Dinâmica da Página de Preços
   Sincronizado com o Painel Administrativo (admin.js) e Carrinho (carrinho.js)
   ========================================================== */

/* ==========================================================================
   1. CAMADA MODEL (Estado do Catálogo e Persistência NoSQL Local)
   ========================================================================== */
const STORAGE_KEY = 'alva_catalogo_produtos';
const CATALOG_VERSION_KEY = 'alva_catalogo_v2_36itens';

const catalogoPadraoAlva = [
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

const configCategorias = [
  { chave: 'Volumosos / Casa', titulo: 'Volumosos & Decoração (Casa)', icone: 'hotel' },
  { chave: 'Cama, Mesa e Banho', titulo: 'Cama, Mesa e Banho', icone: 'bathtub' },
  { chave: 'Dia a Dia (Básicas)', titulo: 'Dia a Dia (Básicas)', icone: 'dry_cleaning' },
  { chave: 'Alfaiataria e Finas', titulo: 'Alfaiataria e Peças Finas', icone: 'checkroom' },
  { chave: 'Inverno e Especiais', titulo: 'Inverno e Peças Especiais', icone: 'ac_unit' }
];

/* ==========================================================================
   2. CAMADA VIEW (Renderização das Tabelas Dinâmicas e Cards de Destaque)
   ========================================================================== */
function renderizarCelulaPreco(item, valor, rotuloModalidade) {
  if (valor === null || valor === undefined || valor === '' || isNaN(valor)) {
    return '—';
  }
  const precoFormatado = 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
  const nomeSeguro = item.nome.replace(/'/g, "\\'");
  return `
    ${precoFormatado}
    <button type="button" class="btn-add-cell" title="Adicionar ${rotuloModalidade} ao cesto"
      onclick="if(typeof adicionarAoCarrinho === 'function') { adicionarAoCarrinho(${item.id}, '${nomeSeguro}', '${rotuloModalidade}', ${Number(valor)}, '${item.unidade}'); } else { alert('Carrinho carregando...'); }">
      +
    </button>
  `;
}

function obterCatalogoSincronizado() {
  const versaoAtual = localStorage.getItem(CATALOG_VERSION_KEY);
  const salvos = localStorage.getItem(STORAGE_KEY);

  if (salvos && versaoAtual === 'true') {
    try {
      const parsed = JSON.parse(salvos);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  // Se existia versão antiga de 13 itens, migra preservando itens customizados adicionados pelo admin
  let listaFinal = [...catalogoPadraoAlva];
  if (salvos) {
    try {
      const antigos = JSON.parse(salvos);
      if (Array.isArray(antigos)) {
        antigos.forEach(ant => {
          const existePorNome = listaFinal.find(p => p.nome.toLowerCase() === (ant.nome || '').toLowerCase());
          if (!existePorNome && ant.nome) {
            const novoId = Math.max(...listaFinal.map(p => p.id)) + 1;
            listaFinal.push({ ...ant, id: novoId });
          }
        });
      }
    } catch (e) {}
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(listaFinal));
  localStorage.setItem(CATALOG_VERSION_KEY, 'true');
  return listaFinal;
}

function carregarCatalogoPublico() {
  const container = document.getElementById('tabelasDinamicasContainer');
  if (!container) return;

  const produtos = obterCatalogoSincronizado();
  const produtosAtivos = produtos.filter(p => p.ativo);
  container.innerHTML = '';

  configCategorias.forEach(cat => {
    const itensCategoria = produtosAtivos.filter(p => p.categoria === cat.chave);
    if (itensCategoria.length === 0) return;

    const card = document.createElement('div');
    card.className = 'card table-card';

    const linhasHTML = itensCategoria.map(item => `
      <tr>
        <td><strong>${item.nome}</strong></td>
        <td>${item.unidade}</td>
        <td class="col-val">${renderizarCelulaPreco(item, item.lavar, 'Só Lavar')}</td>
        <td class="col-val">${renderizarCelulaPreco(item, item.passar, 'Só Passar')}</td>
        <td class="col-val">${renderizarCelulaPreco(item, item.completo, 'Lavar + Passar')}</td>
        <td class="col-desc">${item.obs || ''}</td>
      </tr>
    `).join('');

    card.innerHTML = `
      <div class="table-caption">
        <span class="material-symbols-outlined">${cat.icone}</span>
        ${cat.titulo}
      </div>
      <table class="custom-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cobrança</th>
            <th style="text-align: right;">Somente Lavar</th>
            <th style="text-align: right;">Somente Passar</th>
            <th style="text-align: right;">Lavar + Passar</th>
            <th>Observações Técnicas</th>
          </tr>
        </thead>
        <tbody>
          ${linhasHTML}
        </tbody>
      </table>
    `;
    container.appendChild(card);
  });

  atualizarCardsDestaque(produtosAtivos);
}

function atualizarCardsDestaque(produtosAtivos) {
  const menorPreco = (termo) => {
    const itens = produtosAtivos.filter(p => p.nome.toLowerCase().includes(termo) && p.lavar !== null);
    if (itens.length === 0) return null;
    return Math.min(...itens.map(p => Number(p.lavar)));
  };

  const minEdredom = menorPreco('edredom');
  const minTapete = menorPreco('tapete');
  const minCobertor = menorPreco('cobertor') || menorPreco('manta');

  const elEdredom = document.getElementById('destaquePrecoEdredom');
  const elTapete = document.getElementById('destaquePrecoTapete');
  const elCobertor = document.getElementById('destaquePrecoCobertor');

  if (elEdredom && minEdredom !== null) elEdredom.innerHTML = `<small>R$</small> ${minEdredom.toFixed(2).replace('.', ',')}`;
  if (elTapete && minTapete !== null) elTapete.innerHTML = `<small>R$</small> ${minTapete.toFixed(2).replace('.', ',')}`;
  if (elCobertor && minCobertor !== null) elCobertor.innerHTML = `<small>R$</small> ${minCobertor.toFixed(2).replace('.', ',')}`;
}

/* ==========================================================================
   3. CAMADA CONTROLLER (Inicialização e Sincronização de Eventos)
   ========================================================================== */
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) carregarCatalogoPublico();
});

document.addEventListener('DOMContentLoaded', carregarCatalogoPublico);

// Sincronização automática com o Back-end Node.js + MongoDB Atlas (se ativo em localhost:3000)
async function buscarCatalogoMongoDB() {
  try {
    const res = await fetch('http://localhost:3000/api/produtos');
    if (res.ok) {
      const dados = await res.json();
      if (Array.isArray(dados) && dados.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
        carregarCatalogoPublico();
      }
    }
  } catch (e) {}
}
document.addEventListener('DOMContentLoaded', buscarCatalogoMongoDB);

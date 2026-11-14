/* ==========================================================
   Lavanderia Alva: Renderização Dinâmica da Página de Preços
   Consumindo a API do Backend (/api/servicos)
   ========================================================== */

const configCategorias = [
  { chave: 'Volumosos & Decoração', titulo: 'Volumosos & Decoração (Casa)', icone: 'hotel' },
  { chave: 'Cama, Mesa e Banho', titulo: 'Cama, Mesa e Banho', icone: 'bathtub' },
  { chave: 'Dia a Dia (Básicas)', titulo: 'Dia a Dia (Básicas)', icone: 'dry_cleaning' },
  { chave: 'Alfaiataria e Peças Finas', titulo: 'Alfaiataria e Peças Finas', icone: 'checkroom' },
  { chave: 'Inverno e Peças Especiais', titulo: 'Inverno e Peças Especiais', icone: 'ac_unit' }
];

// Função para buscar os dados da API e transformar no formato da tabela
async function carregarCatalogoAPI() {
  const container = document.getElementById('tabelasDinamicasContainer');
  if (!container) return;

  container.innerHTML = `<p style="text-align:center;">Carregando tabela de preços...</p>`;

  try {
    const servicosApi = await API.get('/api/servicos');
    
    // Agrupar os serviços por nome da peça (pois o banco retorna cada modalidade em uma linha)
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

      if (s.tipoServico === 'Lavar') {
        produtosAgrupados[s.nomePeca].lavar = s.precoUnitario;
        produtosAgrupados[s.nomePeca].idLavar = s.id;
      } else if (s.tipoServico === 'Passar') {
        produtosAgrupados[s.nomePeca].passar = s.precoUnitario;
        produtosAgrupados[s.nomePeca].idPassar = s.id;
      } else if (s.tipoServico === 'Lavar + Passar') {
        produtosAgrupados[s.nomePeca].completo = s.precoUnitario;
        produtosAgrupados[s.nomePeca].idCompleto = s.id;
      }
    });

    const produtos = Object.values(produtosAgrupados);
    renderizarTabelas(produtos);
    atualizarCardsDestaque(produtos);

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p style="text-align:center; color: var(--color-error);">Erro ao conectar com o servidor. Verifique se o Backend está rodando.</p>`;
  }
}

// Desenha as células com o botão de adicionar
function renderizarCelulaPreco(item, valor, rotuloModalidade, idServico) {
  if (valor === null || valor === undefined || valor === 0) return '—';
  
  const precoFormatado = 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
  const nomeSeguro = item.nome.replace(/'/g, "\\'");
  
  return `
    ${precoFormatado}
    <button type="button" class="btn-add-cell" title="Adicionar ${rotuloModalidade} ao cesto"
      onclick="if(typeof adicionarAoCarrinho === 'function') { adicionarAoCarrinho(${idServico}, '${nomeSeguro}', '${rotuloModalidade}', ${Number(valor)}, '${item.unidade}'); } else { alert('Carrinho carregando...'); }">
      +
    </button>
  `;
}

// Monta o HTML das tabelas
function renderizarTabelas(produtos) {
  const container = document.getElementById('tabelasDinamicasContainer');
  container.innerHTML = '';

  configCategorias.forEach(cat => {
    const itensCategoria = produtos.filter(p => p.categoria === cat.chave);
    if (itensCategoria.length === 0) return;

    const card = document.createElement('div');
    card.className = 'card table-card';

    const linhasHTML = itensCategoria.map(item => `
      <tr>
        <td><strong>${item.nome}</strong></td>
        <td>${item.unidade}</td>
        <td class="col-val">${renderizarCelulaPreco(item, item.lavar, 'Só Lavar', item.idLavar)}</td>
        <td class="col-val">${renderizarCelulaPreco(item, item.passar, 'Só Passar', item.idPassar)}</td>
        <td class="col-val">${renderizarCelulaPreco(item, item.completo, 'Lavar + Passar', item.idCompleto)}</td>
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
        <tbody>${linhasHTML}</tbody>
      </table>
    `;
    container.appendChild(card);
  });
}

// Atualiza os preços dos cards de destaque (Edredom, Tapete, Cobertor)
function atualizarCardsDestaque(produtos) {
  const menorPreco = (termo) => {
    const itens = produtos.filter(p => p.nome.toLowerCase().includes(termo) && p.lavar !== null);
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

document.addEventListener('DOMContentLoaded', carregarCatalogoAPI);
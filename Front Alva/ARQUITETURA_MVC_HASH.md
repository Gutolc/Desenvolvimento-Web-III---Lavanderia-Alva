# Documentação Arquitetural — Lavanderia Alva

Este projeto contempla os requisitos de **Padrão MVC**, **Hash Criptográfico & Estruturas Hash** e **Responsividade Mobile-First**.

---

## 1. Padrão Arquitetural MVC (Model - View - Controller)

Os scripts da aplicação (`admin.js`, `precos.js`, `carrinho.js` e controladores de `pedido.html` / `kanban.html`) estão documentados e divididos nas três camadas do padrão MVC:

* **Model (Camada de Dados e Persistência):**
  * Gerencia o estado dos 36 itens do catálogo (`alva_catalogo_produtos`), o cesto do cliente (`alva_carrinho_cliente`) e a fila de pedidos (`alva_pedidos_kanban`).
  * Implementa persistência NoSQL chave-valor no navegador (`localStorage` / `sessionStorage`) pronta para acoplamento via `fetch()` ao banco de dados relacional (SQL).
* **View (Camada de Apresentação):**
  * Páginas semânticas HTML5 (`index.html`, `institucional.html`, `precos.html`, `pedido.html`, `meu-pedido.html`, `admin.html`, `kanban.html`).
  * Folhas de estilo baseadas em Design Tokens (`tokens.css`, `style.css`, `precos.css`, `institucional.css`, `admin.css`).
  * Funções puras de atualização de DOM (`carregarCatalogoPublico()`, `renderizarTabelaAdmin()`, `atualizarInterfaceCarrinho()`, `renderizarQuadroKanban()`).
* **Controller (Camada de Controle e Regras de Negócio):**
  * Intercepta eventos de formulário e clique, valida regras de negócio e sincroniza o *Model* com a *View* (`realizarLogin()`, `salvarProdutoFormulario()`, `alternarStatus()`, `adicionarAoCarrinho()`, `moverStatusPedido()`).

---

## 2. Aplicação de HASH (Criptografia e Estruturas de Dados)

1. **Hash Criptográfico SHA-256 (`admin.js`):**
   * A senha do administrador nunca fica exposta em texto aberto no código-fonte.
   * A função `gerarHashSHA256(texto)` utiliza a **Web Crypto API** nativa (`crypto.subtle.digest('SHA-256', ...)`) — com fallback SHA-256 puro para execução local via `file://` — e compara o digest gerado com o hash oficial `03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4`.
2. **Tabela Hash / Hash Map de Chave Composta (`carrinho.js` e `kanban.html`):**
   * Os itens do cesto utilizam indexação O(1) por chave hash composta (`${idProduto}_${modalidade}`).
   * O dicionário de status (`INFO_STATUS[pedido.status]`) utiliza mapeamento direto chave-valor para compor as mensagens de WhatsApp e E-mail.

---

## 3. Responsividade e Separação de Jornadas

* **Design Responsivo:** Uso de `CSS Grid` (`repeat(auto-fit, minmax(...))`), tipografia fluida com `clamp()`, tabelas com rolagem horizontal (`overflow-x: auto`) e *Media Queries* para smartphones e tablets (`980px`, `820px`, `768px`, `640px`).
* **Separação de Jornadas:**
  * **Jornada do Cliente:** `index.html` → `precos.html` → `pedido.html` → `meu-pedido.html` (consulta individual por código).
  * **Jornada do Administrador:** `admin.html` (protegido por Hash SHA-256) → `kanban.html` (visão global de todos os pedidos da lavanderia).

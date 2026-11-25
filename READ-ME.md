# 🧺 Lavanderia Alva — Sistema Web Full-Stack (Delivery & Gestão Kanban)

Aplicação web completa para gestão operacional, catálogo dinâmico e pedidos online de lavanderia. O projeto aplica o padrão arquitetural **MVC (Model-View-Controller)**, segurança com **Hash Criptográfico SHA-256**, persistência em nuvem com **MongoDB Atlas (NoSQL)** e interface **Mobile-First**.

---

## 🚀 Tecnologias Utilizadas

* **Front-End:** HTML5 Semântico, CSS3 (Design Tokens, CSS Grid, Flexbox, Media Queries) e JavaScript (ES6+, Fetch API, Web Crypto API, LocalStorage/SessionStorage).
* **Back-End:** Node.js, Express.js, CORS, Dotenv.
* **Banco de Dados:** MongoDB Atlas (NoSQL orientado a documentos) modelado via **Mongoose** nas coleções `servicos`, `clientes` e `pedidos`.

---

## 📂 Estrutura de Pastas do Projeto

```text
Projeto Alva/
├── Front Alva/                  # Camadas View e Controller do Cliente/Admin
│   ├── index.html               # Página Inicial (Landing Page + Mapa)
│   ├── institucional.html       # História da Lavanderia e Sustentabilidade
│   ├── precos.html              # Tabela Dinâmica de Preços e Adição ao Cesto
│   ├── pedido.html              # Checkout Online sem Login (PIX / Cartão / Entrega)
│   ├── meu-pedido.html          # Rastreio Individual de Pedido (Linha do Tempo)
│   ├── admin.html               # Login SHA-256 e CRUD Completo do Catálogo
│   ├── kanban.html              # Esteira Kanban de Pedidos (Exclusivo Admin)
│   ├── tokens.css               # Variáveis Globais do Design System
│   ├── style.css                # Estilos Globais e Layout Responsivo
│   ├── precos.css               # Estilos da Página de Preços
│   ├── institucional.css        # Estilos da Página Institucional
│   ├── admin.css                # Estilos do Painel Administrativo
│   ├── carrinho.js              # Cesto Global Persistente (Drawer Lateral)
│   ├── precos.js                # Sincronização Pública do Catálogo
│   ├── admin.js                 # Lógica MVC do Admin + Hash SHA-256
│   └── ARQUITETURA_MVC_HASH.md  # Documentação Técnica de Arquitetura
│
└── backend/                     # API RESTful Node.js + MongoDB Atlas
    ├── models/
    │   ├── Servico.js           # Schema da coleção 'servicos'
    │   ├── Cliente.js           # Schema da coleção 'clientes'
    │   └── Pedido.js            # Schema da coleção 'pedidos'
    ├── .env                     # Variáveis de Ambiente (PORT e MONGO_URI)
    ├── package.json             # Dependências e Scripts npm
    └── server.js                # Servidor Express e Rotas da API
```

---

## ⚙️ Como Executar o Projeto Localmente

### 1. Pré-requisitos
* Ter o **[Node.js](https://nodejs.org/)** instalado na máquina.
* Configurar a variável `MONGO_URI` no arquivo `backend/.env` apontando para o cluster do **MongoDB Atlas**.

### 2. Passo a Passo no Terminal
Abra o terminal na pasta `backend` do projeto e execute:

```bash
cd backend
npm install
npm start
```

> **Dica para Windows PowerShell:** Caso a execução de scripts `.ps1` esteja bloqueada no seu sistema, utilize `npm.cmd install` e `npm.cmd start`.

O terminal exibirá as confirmações:
* `🚀 Servidor Full-Stack Lavanderia Alva rodando em http://localhost:3000`
* `✅ Conectado ao MongoDB Atlas (AlvaLavanderia)!`

---

## 🔗 Links de Acesso às Páginas

Com o servidor rodando na porta `3000`, acesse os endereços abaixo no navegador:

### 👤 1. Jornada do Cliente (Acesso Público)

| Página | URL de Acesso | Descrição |
| :--- | :--- | :--- |
| **Página Inicial (Home)** | [http://localhost:3000/index.html](http://localhost:3000/index.html) | Apresentação dos serviços, etapas do delivery e mapa interativo. |
| **Quem Somos** | [http://localhost:3000/institucional.html](http://localhost:3000/institucional.html) | História da lavanderia no bairro, galeria de bastidores e ações sociais. |
| **Tabela de Preços & Cesto** | [http://localhost:3000/precos.html](http://localhost:3000/precos.html) | Catálogo dinâmico com 36 serviços sincronizados com o banco e botão `+` para adicionar ao cesto. |
| **Finalizar Pedido (Checkout)** | [http://localhost:3000/pedido.html](http://localhost:3000/pedido.html) | Cadastro rápido sem login, simulação de pagamento (PIX/Cartão) e gravação automática no MongoDB. |
| **Rastrear Meu Pedido** | [http://localhost:3000/meu-pedido.html](http://localhost:3000/meu-pedido.html) | Consulta individual do andamento do pedido por código (ex: `ALV-8421` ou `ALV-7904`). |

---

### 🔐 2. Jornada do Administrador (Acesso Restrito)

* **Usuário de teste:** `admin` (ou `admin@alva.com.br`)
* **Senha de teste:** `1234` *(Validada via Hash Criptográfico SHA-256)*

| Página | URL de Acesso | Descrição |
| :--- | :--- | :--- |
| **Painel Administrativo** | [http://localhost:3000/admin.html](http://localhost:3000/admin.html) | Login com Hash SHA-256, indicadores em tempo real, edição rápida de preços, ativação/pausa e inclusão de serviços. |
| **Esteira Kanban de Pedidos** | [http://localhost:3000/kanban.html](http://localhost:3000/kanban.html) | Gestão visual das 5 etapas do delivery (com *Drag-and-Drop*), disparo de avisos para WhatsApp/E-mail e **Cancelamento exclusivo pelo Admin**. |

---

### 🗄️ 3. Endpoints da API RESTful (MongoDB Atlas)

Rotas JSON para inspeção direta dos documentos armazenados no banco de dados:

* **Listar Catálogo de Serviços (`GET`):** [http://localhost:3000/api/produtos](http://localhost:3000/api/produtos)
* **Listar Pedidos Ativos (`GET`):** [http://localhost:3000/api/pedidos](http://localhost:3000/api/pedidos)
* **Listar Clientes Cadastrados (`GET`):** [http://localhost:3000/api/clientes](http://localhost:3000/api/clientes)
* **Consultar Pedido por Código (`GET`):** `http://localhost:3000/api/pedidos/:codigo`
* **Criar Pedido + Upsert Cliente (`POST`):** `http://localhost:3000/api/pedidos`
* **Atualizar Etapa no Kanban (`PATCH`):** `http://localhost:3000/api/pedidos/:codigo/status`
* **Cancelar Pedido pelo Admin (`DELETE`):** `http://localhost:3000/api/pedidos/:codigo`

---

## 🛡️ Destaques Arquiteturais e Regras de Negócio

1. **Padrão MVC (Model-View-Controller):** Separação clara entre esquemas de dados/persistência (*Model*), renderização dinâmica de componentes (*View*) e gerenciamento de eventos/regras de negócio (*Controller*).
2. **Autenticação com Hash SHA-256:** Nenhuma senha em texto puro fica exposta no código. O login converte a entrada do usuário usando a *Web Crypto API* e compara com a assinatura hexadecimal `03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4`.
3. **Cadastro Automático de Clientes (Upsert):** Quando o cliente finaliza um pedido no checkout, o back-end cria ou atualiza automaticamente seu registro na coleção `clientes` e vincula o pedido na coleção `pedidos`.
4. **Regra de Cancelamento Controlada:** Para proteger a operação quando as peças já estão em processo de lavagem, o cliente visualiza apenas a linha do tempo em `meu-pedido.html`, enquanto o cancelamento é uma prerrogativa exclusiva do administrador no painel `kanban.html` mediante solicitação do cliente.
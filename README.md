# 🧼 Sistema Alva (LavaFlow) — Sprint 1

> Sistema de gestão inteligente para lavanderias, desenvolvido como projeto acadêmico para a disciplina de Desenvolvimento Web III / Engenharia de Software.

---

## 📋 Sobre o Projeto
O **Sistema Alva** nasce para solucionar os gargalos operacionais de lavanderias tradicionais que ainda operam com processos manuais e planilhas desconectadas. O objetivo da plataforma é centralizar o fluxo de atendimento, o controle de pedidos (Kanban), a gestão de colaboradores e, futuramente, o autoatendimento dos clientes.

---

## 🚀 O que foi entregue na Sprint 1

Nesta primeira entrega, estabelecemos a **fundamentação estrutural, de segurança e de controle de acessos** do sistema de ponta a ponta (Full-stack desacoplado):

### 1. Back-end (API RESTful em Spring Boot)
* **Arquitetura em Camadas:** Organização limpa separando *Controllers*, *Services*, *Repositories* e *DTOs*.
* **Persistência de Dados:** Integração com banco de dados **MySQL** utilizando **Spring Data JPA / Hibernate**.
* **Segurança Robusta (Spring Security + JWT):** 
  * Implementação de filtro personalizado (`JwtAuthenticationFilter`) para interceptação e validação de tokens via header `Authorization: Bearer <token>`.
  * Criptografia de senhas utilizando **BCrypt** (`PasswordEncoder`), garantindo que nenhuma credencial seja salva em texto plano.
* **Módulo de Usuários e Perfis (RBAC):** Cadastro e gerenciamento de operadores com controle de perfis (`ADMIN` e `ATENDENTE`).

### 2. Front-end (React & Vite)
* **Performance e Estilização:** Interface moderna desenvolvida em **React com Vite** e estilizada responsivamente com **Tailwind CSS**.
* **Gerenciamento de Estado e Sessão:** Uso de Context API (`AuthContext`) para persistência de sessão e controle global de autenticação.
* **Rotas Protegidas:** Implementação de componentes de rota privada (`PrivateRoute`) para impedir o acesso não autorizado ao painel interno.
* **Fluxo de Cadastro de Funcionários:** Tela integrada à API (`CadastroFuncionario.jsx`) permitindo ao administrador cadastrar novos operadores diretamente pela interface.

---

## 🛠️ Tecnologias Utilizadas

### **Back-end**
* **Java 21**
* **Spring Boot 3.x**
* **Spring Security & JWT (JSON Web Token)**
* **Spring Data JPA / Hibernate**
* **MySQL Driver & HikariCP**
* **Maven**

### **Front-end**
* **React 18 / Vite**
* **Tailwind CSS**
* **React Router DOM**
* **Axios** (para requisições HTTP)

---

## 📁 Estrutura do Repositório

```text
Alva-Projeto/
├── backend/            # API Spring Boot (Java 21)
│   ├── src/main/java/com/walkers/alva/
│   │   ├── config/     # Configurações de segurança e CORS
│   │   ├── controller/ # Endpoints REST (Auth, Usuários)
│   │   ├── model/      # Entidades JPA e Enums
│   │   ├── repository/ # Interfaces Spring Data
│   │   ├── security/   # Filtros e serviços JWT
│   │   └── service/    # Regras de negócio
│   └── pom.xml
│
└── frontend/           # Interface React com Vite e Tailwind
    ├── src/
    │   ├── components/ # Componentes reutilizáveis e rotas privadas
    │   ├── context/    # AuthContext (Gerenciamento de sessão)
    │   ├── pages/      # Telas (Login, Cadastro, Kanban/Dashboard)
    │   └── services/   # Configuração do Axios e chamadas de API
    └── package.json
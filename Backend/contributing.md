# Guia de Contribuição do Projeto

Boas-vindas ao nosso repositório! Este documento estabelece as regras e padrões que a nossa equipe deve seguir para manter o código organizado, legível e fácil de dar manutenção.

Antes de começar a programar, por favor, leia as diretrizes abaixo.

---

## 1. Padrão de Nomenclatura de Branches

Nunca faça commits diretamente nas branches `main` ou `develop`. Sempre crie uma branch específica para a sua tarefa a partir da `develop`.

O nome da branch deve ser em letras minúsculas, separadas por hífen (`-`), seguindo os prefixos abaixo:

* **`feature/`** - Para novas funcionalidades. Ex: `feature/tela-login`, `feature/api-usuarios`
* **`fix/`** - Para correção de bugs. Ex: `fix/erro-conexao-banco`, `fix/botao-invisivel`
* **`docs/`** - Para criação ou alteração de documentação. Ex: `docs/atualiza-readme`
* **`refactor/`** - Para reestruturação de código existente. Ex: `refactor/otimiza-query-banco`

**Exemplo de fluxo:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/cadastro-clientes
```

---

## 2. Padrão de Commits (Conventional Commits)

Nossos commits contam a história do projeto. Para manter o histórico limpo, usamos o seguinte formato:

`tipo(escopo): descrição curta no imperativo`

### Tipos Permitidos
* **feat**: Nova funcionalidade.
* **fix**: Correção de bug.
* **docs**: Mudanças na documentação.
* **style**: Formatação (espaços, ponto e vírgula, indentação).
* **refactor**: Refatoração de código.
* **test**: Adição ou correção de testes.
* **chore**: Atualizações de tarefas de build, pacotes ou configurações.

### Escopos (Opcional, mas recomendado)
Como nosso projeto é dividido, indique onde a mudança ocorreu:
* `(frontend)` - HTML, CSS, interfaces.
* `(backend)` - Lógica do servidor, PHP, Java, etc.
* `(banco)` - Scripts SQL (SQL Server, MySQL), triggers, procedures.
* `(config)` - Arquivos de configuração do repositório.

### Exemplos Práticos
* ✅ `feat(frontend): cria a estrutura base em HTML e CSS`
* ✅ `fix(backend): corrige cálculo na lógica de negócio`
* ✅ `feat(banco): adiciona trigger para validação de registros`
* ✅ `chore(config): atualiza o arquivo gitignore`

---

## 3. Regras para a Descrição do Commit
1. Use o verbo no **imperativo** (ex: "adiciona", "corrige", "muda"). Não use passado ("adicionado") ou gerúndio ("adicionando").
2. Não coloque ponto final na mensagem.
3. Mantenha a linha de assunto com no máximo 72 caracteres.

---

## 4. Fluxo de Pull Requests (PR)

Quando sua tarefa estiver concluída:
1. Faça o push da sua branch para o GitHub.
2. Abra um Pull Request (PR) apontando para a branch `develop`.
3. Adicione uma descrição clara no PR informando o que foi feito. Se o PR resolve uma Issue, coloque "Resolve #numero-da-issue".
4. Solicite a revisão de pelo menos 1 integrante da equipe.
5. O merge só deve ser feito após a aprovação da equipe.

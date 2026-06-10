# /services/frontend: Documentação do Dashboard de Monitoramento

Este documento descreve o microsserviço **`frontend`**, a interface que você vê. Ele é o responsável por consumir os dados da API Principal (NestJS) e transformar os logs e insights de clima em um painel interativo.

## 1. Visão Geral da Aplicação

Construído para ser **rápido e robusto**, o Dashboard foi desenvolvido com uma *stack* moderna, totalmente baseada em TypeScript para garantir a segurança de ponta a ponta.

| Aspecto | Detalhe | O que isso significa? |
| :--- | :--- | :--- |
| **Tecnologia Principal** | React (Vite) + TypeScript | Alto desempenho e código seguro e tipado. |
| **Componentes** | `shadcn/ui` + Tailwind CSS | Interface moderna, limpa e responsiva. |
| **Roteamento** | **TanStack Router** | Navegação rápida e **sem erros de link** (type-safe). |
| **Gestão de Dados** | **TanStack Query** | Gerencia o cache de dados, evitando requisições repetidas e tornando o dashboard mais ágil. |

---

## 2. Como o Frontend Foi Construído (Arquitetura)

A arquitetura foi pensada para desacoplar a interface da lógica de dados, usando ferramentas específicas para cada tarefa:

### Gerenciamento de Dados e Cache

Usamos o **TanStack Query** para lidar com toda a comunicação com a API (fetch, loading, cache). Quando você navega entre as páginas, o dashboard não precisa buscar o mesmo dado várias vezes, resultando em uma experiência de navegação **muito mais fluida**.

### Estado da Aplicação

O estado de autenticação do usuário é gerenciado por **React Context**, enquanto o cache e o estado assíncrono das requisições são administrados pelo **TanStack Query**. Essa separação mantém o fluxo simples e evita dependências desnecessárias.

### Roteamento e Tipagem de URLs

O **TanStack Router** garante que todos os links e parâmetros de URL sejam **verificados pelo TypeScript**. Se um link estiver errado, o código nem compila, eliminando um problema comum em aplicações grandes.

### Validação de Ambiente (Zod)

Para evitar erros bobos no início da aplicação, usamos o **Zod** para **validar as variáveis de ambiente**. Ele checa se a `VITE_API_URL` e outras configurações críticas estão presentes e no formato correto antes de a aplicação sequer ser carregada.

---

## 3. Estrutura de Diretórios

Organizamos o código de forma clara para que qualquer desenvolvedor encontre rapidamente o que precisa:

* **`/src/components`**: Componentes reutilizáveis (botões, tabelas, etc.).
* **`/src/config`**: Onde o **Zod** valida as variáveis de ambiente e ficam as constantes.
* **`/src/routes`**: A definição da navegação e das páginas via TanStack Router.
* **`/src/services`**: Funções de consumo da API e fluxo de autenticação.
* **`/src/providers`** e **`/src/contexts`**: Estado global de autenticação com React Context.
* **`/src/hooks`**: Hooks compartilhados, incluindo consultas com TanStack Query.

---

## 4. Configuração de Variáveis (Vite ENVs)

O Frontend espera as seguintes variáveis, que são injetadas pelo **Vite** no processo de build e validadas pelo Zod:

| Variável | Descrição | Importância |
| :--- | :--- | :--- |
| **`VITE_API_URL`** | O endereço completo da API Principal (NestJS). | **Crítica.** Essencial para fazer *fetch* de qualquer dado. |
| **`VITE_FRONTEND_URL`** | O endereço de onde o frontend está sendo servido. | Necessário para configurações de redirecionamento. |
| **`VITE_ENSURE_DEFAULT_USER_*`** | Credenciais do usuário Admin padrão. | Usado apenas para facilitar o preenchimento da tela de login na fase de avaliação/desenvolvimento. |

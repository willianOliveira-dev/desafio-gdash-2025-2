# Desafio Técnico GDASH 2025/02: Plataforma de Monitoramento Climático e Insights

### 1\. Contexto e Objetivo

Este repositório contém a solução técnica para o desafio de processo seletivo GDASH 2025/02. O objetivo é desenvolver uma aplicação **full-stack moderna e distribuída** focada em **integração entre sistemas**, **coleta de dados reais** e **uso de Inteligência Artificial**.

A solução implementa um pipeline de dados distribuído que coleta informações climáticas, as processa através de um **Message Broker** e as armazena em uma **API** para serem visualizadas em um **Dashboard interativo**.


-----

### 2\. Visão Geral da Arquitetura

A aplicação é modular e roda inteiramente via **Docker Compose**, orquestrando cinco (ou mais) serviços principais. A arquitetura adotada é a **Arquitetura Orientada a Microsserviços**, com comunicação assíncrona garantida pelo **RabbitMQ**.

**Fluxo de Dados:**
`python-producer (Produtor)` $\rightarrow$ `RabbitMQ (Fila)` $\rightarrow$ `go-worker (Consumidor)` $\rightarrow$ `api-nest` $\rightarrow$ `MongoDB`

**Fluxo de Consumo:**
`frontend (React)` $\leftrightarrow$ `api-nest`

-----

### 3\. Tecnologias Utilizadas

A stack de desenvolvimento é estritamente aderente aos requisitos do desafio, com foco em performance e tipagem segura.

| Serviço | Linguagem | Framework/Tecnologia Principal | Dependências Chave | Banco de Dados/Infra |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | TypeScript | React + Vite, TanStack Router/Query | `shadcn/ui`, Zustand | Docker |
| **API Principal** | TypeScript | NestJS (Node.js) | Mongoose, JWT, `ai-sdk/google` | MongoDB |
| **Worker da Fila** | Go | Padrão Go, `amqp` (RabbitMQ Client) | HTTP Client | RabbitMQ |
| **Coletor de Dados** | Python | `aio-pika`, `httpx` | `aio-pika`, `pydantic` | RabbitMQ |
| **Infraestrutura** | - | Docker Compose | - | MongoDB, RabbitMQ |

-----

### 4\. Estrutura do Projeto

Abaixo está a organização de diretórios na raiz do repositório, refletindo a estrutura modular da **Arquitetura de Microsserviços**:

  * `/services/api-nest` - Código-fonte da API principal (NestJS).
  * `/services/frontend` - Código-fonte da aplicação web (React/Vite).
  * `/services/python-producer` - Código-fonte do microserviço de coleta e produção (Python).
  * `/services/go-worker` - Código-fonte do microserviço consumidor da fila (Go).
  * `docker-compose.yml` - Arquivo de orquestração de todos os serviços.
  * `.env.example` - Template com todas as variáveis de ambiente necessárias.

-----

### 5\. Pré-requisitos

Para executar a aplicação localmente, é necessário ter instalado:

  * **Docker**
  * **Docker Compose**

-----

### 6\. Configuração e Execução

#### 6.1. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, baseado no template fornecido (`.env.example`), e preencha as variáveis de configuração, incluindo as credenciais do MongoDB e RabbitMQ, bem como a chave da API de Clima (`WEATHER_API_KEY`) e a chave da API do Google AI (`GEMINI_API_KEY`) para o serviço de Insights de IA.

#### 6.2. Inicialização

Para iniciar todos os serviços (API, Banco de Dados, Message Broker, Frontend, Collector, Worker), execute o comando na raiz do projeto:

```bash
docker-compose up --build -d
```

#### 6.3. Verificação

Aguarde alguns instantes para que todos os contêineres iniciem. Você pode verificar o status dos contêineres com:

```bash
docker-compose ps
```
Atenção: Aguarde API NestJS está completamente disponivel para poder acessar o frontend.  Você pode verificar o status dos contêiner com:

```bash
docker-compose logs -f  api-nest
```
-----

### 7\. Serviços e URLs Principais

Com base na configuração do `docker-compose.yml` e das variáveis de ambiente, os serviços estão expostos nas seguintes portas locais:

| Serviço | URL de Acesso | Descrição |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:5173` | Dashboard principal e interface de usuário. |
| **API Principal** | `http://localhost:3000` | Núcleo do sistema, autenticação e fonte de dados. |
| **Documentação da API** | `http://localhost:3000/docs` | Documentação dos endpoints via Swagger/OpenAPI. |
| **RabbitMQ Management** | `http://localhost:15672` | Interface de gerenciamento do Message Broker. |

-----

### 8\. Detalhes da Implementação

#### 8.1. Coletor de Dados Climáticos (`/services/python-producer`)

Responsabilidade: Buscar a previsão do tempo periodicamente e produzir mensagens na fila.
API Externa: **OpenWeatherMap** (API de tempo atual).
Frequência: **3600 segundos (1 hora)**, conforme a variável `WEATHER_INTERVAL`.
Mensageria: Usa `aio-pika` para comunicação assíncrona com o RabbitMQ.
Localização: Coleta dados para `WEATHER_CITIES=Rio de Janeiro`.

#### 8.2. Worker da Fila (`/services/go-worker`)

Responsabilidade: Consumir mensagens do Message Broker (**RabbitMQ**), realizar validações de schema e enviar os dados tratados via HTTP POST para a API NestJS.
Tratamento de Erro: Implementação de retry básico no consumo da fila e logs detalhados de confirmação (`ack`/`nack`).

#### 8.3. API Principal (`/services/api-nest` - NestJS)

Banco de Dados: MongoDB.
Autenticação: **JWT** (JSON Web Tokens) com armazenamento via **Cookies HTTP-only** para maior segurança.
Funcionalidade Auxiliar: Rota `/explore` para demonstração de consumo de API de terceiros (Rick and Morty API).

| Tag | Funcionalidade | Endpoint (Exemplo) | Tipo | Rota Protegida |
| :--- | :--- | :--- | :--- | :--- |
| Weather | Insights de IA | `GET /weather/insights` | Privado | Sim |
| Weather | Recebimento de Dados | `POST /weather/logs` | Interno | Não |
| Weather | Listagem de Logs | `GET /weather/logs` | Privado | Sim |
| Weather | Exportar CSV/XLSX | `GET /weather/export.csv/.xlsx` | Privado | Sim |
| Auth | Login/Logout/Refresh | `POST /auth/...` | Misto | Sim/Não |
| Users | CRUD de Usuários | `CRUD /users/:id` | Privado | Sim |
| Avatar | Upload de Imagem | `POST /avatars/upload` | Privado | Sim |

#### 8.4. Frontend (`/services/frontend` - React)

Tecnologias: React, Vite, Tailwind CSS, `shadcn/ui`. Usa **TanStack Router** e **TanStack Query** para otimização de cache e roteamento.

-----

### 9\. Insights de IA

A geração de insights é feita de forma automatizada e exibe a análise da tendência climática com base nos últimos dias de dados.

Endpoint: `GET /weather/insights`

Geração: **Automática** via **Cron Job diário** (`CronExpression.EVERY_DAY_AT_3AM`) na API NestJS.
Metodologia: Utiliza o modelo **Gemini 2.5 Flash** do Google AI Studio (`@ai-sdk/google`) para analisar os dados climáticos brutos dos últimos dias e gerar um relatório estruturado em formato JSON. O processo inclui um mecanismo de retry (3 tentativas) em caso de falha na geração.

-----

### 10\. Usuário Padrão de Acesso

Para o primeiro acesso ao Dashboard e às rotas protegidas, o seguinte usuário administrador é criado automaticamente na inicialização do serviço `api-nest`:

| Campo | Valor |
| :--- | :--- |
| **Email** | **`admin@gdash.io`** |
| **Senha** | **`@Gdash123`** |

-----


### 11\. Checklist de Entrega

| Requisito | Status |
| :--- | :--- |
| Arquitetura Distribuída (Microsserviços) | Sim |
| Uso de Message Broker (RabbitMQ) | Sim |
| Coleta de Dados Reais (OpenWeatherMap) | Sim |
| Uso de IA (Geração de Insights via Gemini) | Sim |
| Pipeline de Dados (Python $\rightarrow$ RabbitMQ $\rightarrow$ Go $\rightarrow$ NestJS) | Sim |
| Aplicação Full-Stack (React/NestJS) | Sim |
| Exportação de Dados (CSV/XLSX) | Sim |


### 12\. Estratégia de Validação de ENVs (Melhor Prática)
Para garantir a robustez e a segurança de tipagem em toda a arquitetura, cada microsserviço utiliza um arquivo de validação dedicado. Essa prática evita erros de runtime causados por variáveis ausentes ou com formatos incorretos, garantindo que o ambiente esteja configurado corretamente antes da inicialização.

| Microsserviço | Biblioteca / Estratégia |
| :--- | :--- |
| **API Principal (NestJS)** | `class-validator` e `class-transformer` |
| **Frontend (React/Vite)** | **`Zod`** |
| **Worker da Fila (Go)** | Mapeamento nativo de `os.Getenv` para uma *Struct* Tipada |
| **Coletor de Dados (Python)** | **`pydantic-settings`** |

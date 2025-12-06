# /services/api-nest: Documentação Técnica da API Principal

Este documento detalha o microsserviço **`api-nest`**, o núcleo de dados e lógica de negócio da plataforma de monitoramento climático do Desafio Técnico GDASH 2025/02.

## 1. Visão Geral do Microsserviço

A API, construída com NestJS, atua como o **Gateway de Dados** e o **Orquestrador de Lógica**. Ela recebe dados limpos do **Go Worker**, persiste-os no **MongoDB** e fornece interfaces (REST e Documentação) para o **Frontend**. A responsabilidade principal é a segurança, o gerenciamento de usuários e a execução da lógica de **Insights de IA**.

| Aspecto | Detalhe Técnico |
| :--- | :--- |
| **Tecnologia Principal** | NestJS (Node.js) |
| **Banco de Dados** | MongoDB (via Mongoose ODM) |
| **Comunicação de Dados** | HTTP (Interno, com Go Worker), REST (Externo, com Frontend) |
| **Recursos Avançados** | Cron Jobs (@nestjs/schedule) e Inteligência Artificial (Google Gemini) |

---

## 2. Arquitetura Interna

A aplicação adota uma **Arquitetura Escalável e Manutenível** (Clean Architecture/Domain-Driven Design), organizando a lógica em **Módulos** coesos e bem definidos.

| Módulo | Responsabilidades Chave |
| :--- | :--- |
| **Auth** | Login, Logout, Geração/Refresh de Tokens JWT e Estratégia de Cookies. |
| **Users** | Criação, Listagem e Gerenciamento de Usuários (CRUD). |
| **Weathers** | Persistência, Consulta (Paginação), Exportação de dados e Endpoints internos de recebimento. |
| **Insights** | Lógica de **Geração de Insights de IA** (Cron Job diário) e disponibilização dos relatórios. |
| **Avatars** | Serviço opcional para upload de imagens (Cloudinary). |

---

## 3. Estratégia de Autenticação (Cookies HTTP-Only)

O mecanismo de autenticação foi projetado para ser **Seguro e Livre de Responsabilidades do Frontend**, seguindo o padrão de segurança profissional.

1.  **Geração e Armazenamento:** No login (`POST /auth/login`), a API gera os tokens **Access** e **Refresh** JWTs e os armazena diretamente no navegador via **Cookies HTTP-only**.
2.  **Segurança Contra XSS:** O atributo **HTTP-only** impede que scripts de terceiros (JavaScript) no frontend acessem ou roubem os tokens, mitigando ataques **XSS (Cross-Site Scripting)**.
3.  **Fluxo Transparente:** Todas as requisições subsequentes do navegador enviam automaticamente os cookies para o servidor. O servidor valida o `accessToken` e renova o `refreshToken` quando necessário.
4.  **Middleware de Segurança:** Utilização de `helmet`, `compression` e `morgan` para proteção básica e monitoramento.

---

## 4. Endpoints Principais

A documentação completa de todos os endpoints está disponível via **Swagger UI** após a inicialização do serviço.

* **Documentação:** `http://localhost:3000/docs`
* **Base API:** `/api/v1/gdash` (Configurável via `BASE_API`)

| Rota | Descrição |
| :--- | :--- |
| `POST /auth/login` | Autentica o usuário e define os Cookies HTTP-only. |
| `GET /weather/logs` | Lista logs climáticos, com paginação e filtros (Requer autenticação). |
| `GET /weather/insights` | Retorna o último relatório de análise de IA (Requer autenticação). |
| `POST /weather/logs` | Endpoint interno consumido pelo Go Worker para inserção de novos logs. |
| `POST /weather/today` | Lista logs climáticos do dia. |
| `GET /weather/export.csv` | Exporta dados completos de clima (Requer autenticação). |
| `CRUD /users` | Gerenciamento de usuários (Requer autenticação). |

---
## 5. Rota de Exploração Externa (/explore)
Esta rota demonstra a capacidade da API de atuar como um Proxy para serviços externos, encapsulando chamadas e aplicando segurança interna.

| Rota | Detalhe |
| :--- | :--- |
| **Integração** | API Rick and Morty (consumida via `@nestjs/axios`). |
| **Segurança** | Requer **autenticação JWT** (`JwtAuthGuard`) para acesso. |
| **`GET /explore/character`** | **Paginação** e busca de personagens. Suporta filtros por `name`, `gender`, `status` e `page` via query parameters. |
| **`GET /explore/character/:id`** | Busca detalhada de um personagem específico. |

---

## 6. Implementação de Insights de IA

A inteligência da plataforma é fornecida pela análise assíncrona dos dados.

| Configuração | Detalhe |
| :--- | :--- |
| **Modelo de IA** | Google **Gemini 2.5 Flash** (via SDK `@ai-sdk/google`) |
| **Execução** | **Cron Job Diário** (`CronExpression.EVERY_DAY_AT_3AM`) |
| **Lógica** | O *Cron Job* busca os dados brutos e os envia ao Gemini com um prompt estruturado para gerar uma análise e previsão JSON, que é então salva no banco. |

---

## 7. Configuração e Variáveis de Ambiente

As variáveis de ambiente são **validadas** na inicialização (Ver `src/env.validation.ts`) para garantir a integridade do sistema. A estrutura abaixo reflete os parâmetros críticos esperados no arquivo `.env`.

| Variável | Descrição | Valor Padrão / Exemplo |
| :--- | :--- | :--- |
| **`PORT`** | Porta de execução da API. | 3000 |
| **`BASE_API`** | Prefixo global da API. | `api/v1/gdash` |
| **`MONGO_URI`** | String de conexão completa do MongoDB. | `mongodb://...` |
| **`JWT_ACCESS_SECRET`** | Chave secreta para assinatura do Access Token. | (Secreto) |
| **`JWT_REFRESH_SECRET`** | Chave secreta para assinatura do Refresh Token. | (Secreto) |
| **`GOOGLE_GENERATIVE_AI_API_KEY`**| Chave de acesso à API do Gemini. | (Secreto) |
| **`FRONTEND_URL`** | URL do Frontend para configuração do CORS. | `http://localhost:5173` |
| **`ENSURE_DEFAULT_USER_EMAIL`** | Email para criação do usuário Admin na inicialização. | `admin@gdash.io` |
| **`ENABLE_AVATAR_UPLOAD`** | Flag para habilitar o serviço de Cloudinary (opcional). | `false` |

### Detalhes sobre Upload de Avatar (Cloudinary)

O módulo de Avatars suporta upload de imagens para o Cloudinary, mas foi construído para ser opcional, visando a melhor experiência do recrutador.

Com Upload (Produção): Se as chaves CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET estiverem preenchidas e a flag ENABLE_AVATAR_UPLOAD for true, a API fará o upload real das imagens.

Sem Upload (Padrão): Se ENABLE_AVATAR_UPLOAD for false (o padrão), o sistema irá automaticamente atribuir uma URL de imagem de perfil estática (default-avatar.png) ao usuário, sem exigir a configuração de qualquer chave externa.

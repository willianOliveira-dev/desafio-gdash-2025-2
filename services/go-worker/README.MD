# /services/go-worker: Documentação Técnica do Consumidor da Fila (Go)

Este documento detalha o microsserviço **`go-worker`**, a camada intermediária no pipeline de dados, responsável por garantir a **integridade** e a **entrega confiável** das mensagens de clima do RabbitMQ para a API Principal (NestJS).

## 1. Visão Geral do Microsserviço

Desenvolvido em Go, o `go-worker` atua como um **Agente de Confirmação** e **Validação de Schema**. Ele opera exclusivamente no fluxo assíncrono de dados, isolando a API Principal da complexidade da mensageria e do tratamento de erros de rede.

| Aspecto | Detalhe Técnico |
| :--- | :--- |
| **Tecnologia Principal** | Go (golang 1.25.4) |
| **Mensageria** | RabbitMQ (via `amqp091-go` Client) |
| **Comunicação de Saída** | HTTP POST (para NestJS API) |
| **Função Crítica** | Validação de Contrato, Estratégia de Retry e Confirmação de Mensagem. |

---

## 2. Fluxo de Processamento e Robustez

O `go-worker` garante que cada mensagem seja processada ou, em caso de falha persistente, devidamente reenfilerada.

### Validação e Descarte (Nack)

1.  **Consumo Assíncrono:** O *worker* consome mensagens da fila em modo assíncrono.
2.  **Validação de Contrato:** A primeira etapa de processamento é a validação estrita do payload (JSON) contra o **Contrato de Dados** definido na `struct contracts.WeatherData`.
3.  **Mensagens Inválidas:** Se o JSON for malformado, possuir tipos incorretos ou faltar campos obrigatórios, a mensagem recebe um **`Nack(requeue=false)`** imediato e é **descartada**. Isso evita que mensagens corrompidas travem o *worker*.

### Entrega Confiável e Estratégia de Retry

O *worker* implementa um mecanismo de resiliência para garantir que a falha da API Destino (NestJS) não resulte em perda de dados:

1.  **Tentativas HTTP:** O *worker* tenta enviar a mensagem validada via **HTTP POST** para o endpoint da API Principal.
2.  **Retry com Backoff:** Em caso de falha transitória na entrega (erro de rede, timeout, HTTP 429 ou HTTP 5xx), o *worker* executa até **3 tentativas**, com um *delay* de 2 segundos entre elas. Erros HTTP 4xx permanentes são descartados para evitar loops de mensagens inválidas.
3.  **Confirmação Final:**
    * **Sucesso:** Se qualquer tentativa for bem-sucedida, a mensagem recebe um **`Ack(false)`** e é removida da fila.
    * **Falha Persistente:** Se todas as 3 tentativas falharem, a mensagem recebe um **`Nack(requeue=true)`** e é devolvida à fila para processamento futuro, evitando perda de dados.

### Reconexão com o RabbitMQ

Se a conexão com o RabbitMQ não estiver disponível na inicialização ou for encerrada durante a execução, o processo aguarda 5 segundos e tenta estabelecer uma nova conexão automaticamente.

---

## 3. Contrato de Dados (WeatherData Struct)

O contrato de dados é estritamente aplicado pelo *worker* para garantir a qualidade dos dados antes da persistência.

| Campo JSON | Tipo Go | Requisito de Validação |
| :--- | :--- | :--- |
| `city`, `country`, `condition` | `string` | Não pode ser vazio. |
| `temperature`, `feelsLike`, `tempMin`, `tempMax` | `float64` | Campo obrigatório; valores iguais a zero são válidos. |
| `humidity` | `float64` | Campo obrigatório, entre 0 e 100. |
| `pressure` | `float64` | Campo obrigatório e maior que zero. |
| `windSpeed` | `float64` | Campo obrigatório e não negativo. |
| `clouds`, `windDeg` | `float64` | Campos obrigatórios; nuvens entre 0 e 100 e direção entre 0 e 360. |
| `sunrise`, `sunset`, `currentTime` | `string` | Não pode ser vazio. |

---

## 4. Configuração de Ambiente

O *worker* carrega suas configurações através de uma *Struct* tipada (`config.Env`), garantindo que todas as variáveis críticas de conexão e destino sejam lidas corretamente na inicialização.

| Variável | Descrição |
| :--- | :--- |
| **`RABBITMQ_URL`** | URL de conexão completa ao Message Broker. |
| **`RABBITMQ_QUEUE`** | Nome da fila que será consumida. |
| **`RABBITMQ_EXCHANGE`** | Nome da *exchange* para vincular. |
| **`RABBITMQ_ROUTING_KEY`** | Chave de roteamento usada na vinculação. |
| **`API_NEST_URL`** | URL completa do endpoint **`POST /weather/logs`** da API Principal. |
| **`WORKER_API_TOKEN`** | Token compartilhado enviado à API no header **`X-Worker-Token`**. |

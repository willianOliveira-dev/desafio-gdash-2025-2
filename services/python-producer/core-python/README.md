# /services/python-producer: Documentação Técnica do Produtor de Dados

Este documento detalha o microsserviço **`python-producer`**, responsável pela coleta de dados climáticos de uma fonte externa e pela publicação assíncrona das mensagens no **RabbitMQ**. Este serviço inicia o pipeline de dados da plataforma.

## 1. Visão Geral do Microsserviço

O Produtor é o componente de ingestão de dados. Ele é construído em Python, utilizando a biblioteca **`asyncio`** para operações não bloqueantes e alta eficiência na consulta de APIs externas e comunicação com o Message Broker.

| Aspecto | Detalhe Técnico |
| :--- | :--- |
| **Tecnologia Principal** | Python (>=3.14) com `asyncio` |
| **API Externa** | OpenWeatherMap |
| **Mensageria** | RabbitMQ (via `aio-pika`) |
| **Controle de Dependências** | Poetry |
| **Função Crítica** | Coleta Periódica de Dados e Produção de Mensagens Persistentes. |

---

## 2. Fluxo de Coleta e Produção

O serviço opera em um *loop* contínuo, garantindo a coleta de dados na frequência desejada.

1.  **Leitura de Configuração:** Na inicialização, ele lê a lista de cidades (`WEATHER_CITIES`) e o intervalo (`WEATHER_INTERVAL`).
2.  **Loop Periódico:** O *worker* entra em um *loop* infinito (`while True`) com um *delay* assíncrono (`asyncio.sleep`) baseado no `WEATHER_INTERVAL` (em segundos, tipicamente 3600s/1 hora).
3.  **Consulta Assíncrona:** Dentro do loop, ele itera sobre as cidades configuradas e faz uma requisição **HTTP GET assíncrona** (`httpx.AsyncClient`) para a API do OpenWeatherMap.
4.  **Parse e Validação:** O JSON retornado pela OpenWeatherMap é imediatamente processado e validado contra o **Contrato de Dados Pydantic** (`src/contracts/weather_contract.py`).
5.  **Publicação da Mensagem:** O dado validado é empacotado e enviado de forma assíncrona (`MQProducer.send`) para o RabbitMQ, com a flag **`DeliveryMode.PERSISTENT`** ativada para evitar perda de dados em caso de falha do broker.
6.  **Conexão Persistente:** O produtor mantém uma única conexão robusta com o RabbitMQ durante sua execução, reutilizando o canal, a fila e a *exchange* entre as publicações.


---

## 3. Contrato de Dados (Pydantic)

O microsserviço utiliza **Pydantic** para definir e validar o schema de saída da mensagem. Isso garante que o payload enviado ao RabbitMQ esteja no formato exato que o **Go Worker** e o **NestJS API** esperam, promovendo a integridade do pipeline.

| Campo (Pydantic Model) | Tipo Python | Origem |
| :--- | :--- | :--- |
| `city`, `country`, `condition` | `str` | Metadados e Descrição do Clima. |
| `temperature`, `feelsLike`, `tempMin`, `tempMax` | `float` | Dados da seção `main`. |
| `humidity`, `pressure` | `int` | Dados da seção `main`. |
| `windSpeed`, `windDeg`, `clouds` | `float` ou `int` | Dados das seções `wind` e `clouds`. |
| `sunrise`, `sunset`, `currentTime` | `str` | Timestamps em formato ISO 8601 (gerados no parse). |

---

## 4. Configuração de Mensageria (RabbitMQ)

O serviço é configurado para ser um produtor robusto de mensagens.

| Variável | Descrição | Observações |
| :--- | :--- | :--- |
| **`RABBITMQ_URL`** | URL de conexão robusta ao RabbitMQ. | Implementa lógica de *retry* e reutiliza a conexão durante o processo (`RabbitMQConnection.connect`). |
| **`RABBITMQ_QUEUE`** | Nome da fila de destino. | Usada na declaração e *bind* da Exchange. |
| **`RABBITMQ_EXCHANGE`** | Nome da *Exchange* (Tipo `DIRECT`). | Usada para roteamento das mensagens. |
| **`RABBITMQ_ROUTING_KEY`** | Chave de roteamento. | Necessária para vincular a fila à *exchange*. |

### Configuração de Ambiente

As configurações são carregadas via **`pydantic-settings`**, que mapeia e tipa as variáveis de ambiente, garantindo que chaves de API e URLs estejam presentes e corretas na inicialização do serviço.

| Variável | Descrição |
| :--- | :--- |
| **`WEATHER_API_KEY`** | Chave de autenticação da OpenWeatherMap. |
| **`WEATHER_BASE_URL`** | URL base para a API de tempo atual. |
| **`WEATHER_CITIES`** | Lista de cidades (separadas por vírgula) para coleta de dados. |
| **`WEATHER_INTERVAL`** | Frequência de coleta em **segundos** (Ex: 3600 para 1 hora). |

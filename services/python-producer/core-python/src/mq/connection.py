import asyncio

from aio_pika import ExchangeType, connect_robust

from src.config import settings
from src.logger import get_logger


class RabbitMQConnection:
    def __init__(self) -> None:
        self.url = settings.RABBITMQ_URL
        self.queue_name = settings.RABBITMQ_QUEUE
        self.exchange_name = settings.RABBITMQ_EXCHANGE
        self.routing_key = settings.RABBITMQ_ROUTING_KEY
        self.logger = get_logger("rabbit_connection")
        self.connection = None
        self.channel = None
        self.queue = None
        self.exchange = None

    async def connect(self) -> None:
        if self.connection and not self.connection.is_closed:
            return

        max_retries = 10
        for attempt in range(1, max_retries + 1):
            try:
                self.logger.info("Tentando conectar ao RabbitMQ...")
                self.connection = await connect_robust(self.url)
                self.channel = await self.connection.channel()
                self.queue = await self.channel.declare_queue(
                    name=self.queue_name,
                    durable=True,
                )
                self.exchange = await self.channel.declare_exchange(
                    name=self.exchange_name,
                    type=ExchangeType.DIRECT,
                    durable=True,
                )
                await self.queue.bind(
                    exchange=self.exchange,
                    routing_key=self.routing_key,
                )
                self.logger.info("Conexao concluida com sucesso ao RabbitMQ.")
                return
            except Exception:
                self.logger.error(
                    f"Tentativa {attempt}/{max_retries}: "
                    "falha ao conectar no RabbitMQ.",
                )

                if attempt == max_retries:
                    raise ValueError(
                        "Todas as tentativas falharam ao conectar no RabbitMQ."
                    )

                self.logger.info("Tentando novamente em 5 segundos.")
                await asyncio.sleep(5)

    async def disconnect(self) -> None:
        if self.connection and not self.connection.is_closed:
            await self.connection.close()

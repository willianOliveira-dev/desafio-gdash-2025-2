from aio_pika import ExchangeType, connect_robust
from src.config import settings


class RabbitMQConnection:
    def __init__(self) -> None:
        if not settings.RABBITMQ_QUEUE or not settings.RABBITMQ_URL:
            raise ValueError("Configurações de RabbitMQ incompletas.")
        self.url = settings.RABBITMQ_URL
        self.queue_name = settings.RABBITMQ_QUEUE

    async def connect(self):
        """Abrir conexão com o RabbitMQ"""
        try:
            self.connection = await connect_robust(self.url)
            self.channel = await self.connection.channel()

            self.queue = await self.channel.declare_queue(
                name=self.queue_name, durable=True
            )

            return self.channel, self.queue

        except Exception as e:
            raise ValueError(f"Houve um erro ao abrir conexão com RabbitMQ: {e}")

    async def disconnect(self) -> None:
        """Encerrar conexão com o RabbitMQ"""
        try:
            await self.connection.close()
        except Exception as e:
            raise ValueError(f"Houve um erro em encerrar conexão no RabbitMQ: {e}")

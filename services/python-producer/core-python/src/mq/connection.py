import asyncio
from aio_pika import connect_robust
from src.config import settings
from src.logger import get_logger


class RabbitMQConnection:
    def __init__(self) -> None:
        if not settings.RABBITMQ_QUEUE or not settings.RABBITMQ_URL:
            raise ValueError(
                "Configurações de variáveis de ambiente RabbitMQ incompletas."
            )
        self.url = settings.RABBITMQ_URL
        self.queue_name = settings.RABBITMQ_QUEUE
        self.logger = get_logger("rabbit_connection")

    async def connect(self):
        MAX_RETRIES = 10
        attempt = 0
        while True:
            attempt += 1
            try:
                self.logger.info("Tentando conectar ao RabbitMQ...")
                self.connection = await connect_robust(self.url)
                self.logger.info("Conexaão concluída com sucesso ao RabbitMQ.")
                self.channel = await self.connection.channel()
                self.queue = await self.channel.declare_queue(
                    name=self.queue_name, durable=True
                )
                return self.channel, self.queue

            except Exception as _:
                self.logger.error(
                    f"Tentiva {attempt}/{MAX_RETRIES}: Falha ao conectar no RabbitMQ.",
                )

                if attempt == MAX_RETRIES:
                    raise ValueError(
                        "Todas as tentaivas falharam ao conectar no RabbitMQ."
                    )

                self.logger.info("Tentando novamente em 5 segundos.")
                await asyncio.sleep(5)

    async def disconnect(self) -> None:
        try:
            await self.connection.close()
        except Exception as e:
            raise ValueError(f"Houve um erro em encerrar conexão no RabbitMQ: {e}")

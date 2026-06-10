import json

from aio_pika import DeliveryMode, Message

from src.logger import get_logger
from src.mq.connection import RabbitMQConnection


class MQProducer:
    def __init__(self) -> None:
        self.logger = get_logger("rabbit_producer")
        self.connection = RabbitMQConnection()

    async def connect(self) -> None:
        await self.connection.connect()

    async def close(self) -> None:
        await self.connection.disconnect()

    async def send(self, message: dict) -> None:
        await self.connection.connect()

        await self.connection.exchange.publish(
            message=Message(
                body=json.dumps(message).encode("utf-8"),
                delivery_mode=DeliveryMode.PERSISTENT,
            ),
            routing_key=self.connection.routing_key,
        )

        self.logger.info(
            f"Mensagem publicada na fila {self.connection.queue.name} "
            f"via exchange {self.connection.exchange.name}: "
            f"{json.dumps(message)}"
        )

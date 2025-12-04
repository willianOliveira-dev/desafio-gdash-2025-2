import json
from aio_pika import Message, DeliveryMode, ExchangeType
from src.mq.connection import RabbitMQConnection
from src.config import settings
from src.logger import get_logger


class MQProducer:
    def __init__(self) -> None:
        self.logger = get_logger("rabbit_producer")

    async def send(self, message: dict) -> None:
        conn = RabbitMQConnection()
        channel, queue = await conn.connect()

        exchange_name = settings.RABBITMQ_EXCHANGE
        routing_key = settings.RABBITMQ_ROUTING_KEY

        if not exchange_name or not routing_key:
            raise ValueError(
                "Configurações de variáveis de ambiente RabbitMQ incompletas."
            )

        exchange = await channel.declare_exchange(
            name=exchange_name, type=ExchangeType.DIRECT, durable=True
        )

        await queue.bind(exchange=exchange, routing_key=routing_key)

        await exchange.publish(
            message=Message(
                body=json.dumps(message).encode("utf-8"),
                delivery_mode=DeliveryMode.PERSISTENT,
            ),
            routing_key=routing_key,
        )

        self.logger.info(
            f"Mensagem publicada: {json.dumps(message)} na fila: {queue.name} via exchange: {exchange.name}"
        )

        await conn.disconnect()

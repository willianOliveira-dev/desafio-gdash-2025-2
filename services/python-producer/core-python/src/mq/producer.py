import json
from aio_pika import Message, DeliveryMode, ExchangeType
from src.mq.connection import RabbitMQConnection


class MQProducer:
    async def send(self, message: dict, routing_key: str = "weather") -> None:
        conn = RabbitMQConnection()
        channel, queue = await conn.connect()

        exchange = await channel.declare_exchange(
            name="weather_exchange", type=ExchangeType.DIRECT, durable=True
        )

        await queue.bind(exchange=exchange, routing_key=routing_key)

        await exchange.publish(
            message=Message(
                body=json.dumps(message).encode("utf-8"),
                delivery_mode=DeliveryMode.PERSISTENT,
            ),
            routing_key=routing_key,
        )

        print(
            f"Mensagem publicada: {json.dumps(message)} na fila: {queue.name} via exchange: {exchange.name}"
        )

        await conn.disconnect()

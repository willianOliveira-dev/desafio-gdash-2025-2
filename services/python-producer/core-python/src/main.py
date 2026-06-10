import asyncio

from src.config import settings
from src.logger import get_logger
from src.mq import MQProducer
from src.services import WeatherService


async def main():
    cities = settings.WEATHER_CITIES.split(",")
    interval = settings.WEATHER_INTERVAL
    logger = get_logger("success")
    weather_service = WeatherService()
    mq_producer = MQProducer()

    await mq_producer.connect()

    try:
        while True:
            for city in cities:
                normalized_city = city.strip()
                weather_data = await weather_service.get_weather(city=normalized_city)
                await mq_producer.send(message=weather_data.model_dump())
                logger.info(
                    f"Dados do clima da cidade {normalized_city} "
                    "enviados para o Worker."
                )

            await asyncio.sleep(interval)
    finally:
        await mq_producer.close()


if __name__ == "__main__":
    asyncio.run(main())

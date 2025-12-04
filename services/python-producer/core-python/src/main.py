from src.config import settings
from src.services import WeatherService
from src.mq import MQProducer
from src.logger import get_logger
import asyncio


async def main():
    CITIES = settings.WEATHER_CITIES
    INTERVAL = settings.WEATHER_INTERVAL

    if not CITIES or not INTERVAL:
        raise ValueError("Configurações de intervalo ou cidades imcompletas.")

    CITIES = CITIES.split(",")
    logger = get_logger("success")
    weather_service = WeatherService()
    mq_producer = MQProducer()

    while True:
        for city in CITIES:
            weather_data = await weather_service.get_weather(city=city.strip())
            await mq_producer.send(message=weather_data.model_dump())
            logger.info(
                f" Dados do clima da cidade {city.strip()} enviados para Worker."
            )

        await asyncio.sleep(float(INTERVAL))


if __name__ == "__main__":
    asyncio.run(main())

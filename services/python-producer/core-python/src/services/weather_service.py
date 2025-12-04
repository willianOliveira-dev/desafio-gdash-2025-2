from httpx import URL, AsyncClient, HTTPStatusError
from datetime import datetime
from src.contracts import WeatherData
from src.config import settings
from src.logger import get_logger


class WeatherService:
    def __init__(self) -> None:
        if not settings.WEATHER_API_KEY or not settings.WEATHER_BASE_URL:
            raise ValueError(
                "Configurações de variáveis de ambiente weather imcompletas."
            )

        self.api_key = settings.WEATHER_API_KEY
        self.open_weather_url = settings.WEATHER_BASE_URL
        self.logger = get_logger("weather_service")

    async def get_weather(self, city: str, units: str = "metric") -> WeatherData:
        try:
            async with AsyncClient() as clientHttp:
                url = URL(self.open_weather_url)
                self.logger.info("Realizando requisição a API da OpenWeatherMap...")
                response = await clientHttp.get(
                    url=url, params={"q": city, "appid": self.api_key, "units": units}
                )
                response.raise_for_status()

                data = response.json()

                self.logger.info(f"Dados obtidos com sucesso: {data}")

                return self._parse_weather_data(data=data)

        except HTTPStatusError as e:
            raise ValueError(
                f"Erro ao buscar clima para {city}: {e.response.status_code}"
            )

    def _parse_weather_data(self, data: dict) -> WeatherData:
        main = data["main"]
        wind = data["wind"]
        sys = data["sys"]
        clouds = data["clouds"]
        weather = data["weather"][0]

        return WeatherData(
            city=data["name"],
            country=sys.get("country", ""),
            temperature=main["temp"],
            feelsLike=main["feels_like"],
            tempMin=main["temp_min"],
            tempMax=main["temp_max"],
            humidity=main["humidity"],
            pressure=main["pressure"],
            windSpeed=wind["speed"],
            windDeg=wind.get("deg", 0),
            clouds=clouds["all"],
            condition=weather["description"],
            sunrise=datetime.fromtimestamp(sys["sunrise"]).isoformat(),
            sunset=datetime.fromtimestamp(sys["sunset"]).isoformat(),
        )

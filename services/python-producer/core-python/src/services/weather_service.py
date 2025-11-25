from httpx import URL, AsyncClient, HTTPStatusError
from datetime import datetime
from src.contracts import WeatherData
from src.config import settings


class WeatherService:
    def __init__(self) -> None:
        if not settings.WEATHER_API_KEY or not settings.WEATHER_BASE_URL:
            raise ValueError("Configurações de weather imcompletas.")

        self.api_key = settings.WEATHER_API_KEY
        self.open_weather_url = settings.WEATHER_BASE_URL

    async def get_weather(self, city: str, units: str = "metric") -> WeatherData:
        try:
            async with AsyncClient() as clientHttp:
                url = URL(self.open_weather_url)

                response = await clientHttp.get(
                    url=url, params={"q": city, "appid": self.api_key, "units": units}
                )  
                
                response.raise_for_status()
                
                data = response.json()
                
                return self._parse_weather_data(data=data)

        except HTTPStatusError as e:
            raise ValueError(
                f"Erro ao buscar clima para {city}: {e.response.status_code}"
            )

    def _parse_weather_data(self, data: dict) -> WeatherData:
        """Extrair e padronizar dados da resposta da Api"""
        main = data["main"]
        wind = data["wind"]
        sys = data["sys"]
        clouds = data["clouds"]
        weather = data["weather"][0]

        return WeatherData(
            city=data["name"],
            country=sys.get("country", ""),
            temperature=main["temp"],
            feels_like=main["feels_like"],
            temp_min=main["temp_min"],
            temp_max=main["temp_max"],
            humidity=main["humidity"],
            pressure=main["pressure"],
            wind_speed=wind["speed"],
            wind_deg=wind.get("deg", 0),
            clouds=clouds["all"],
            condition=weather["description"],
            sunrise=datetime.fromtimestamp(sys["sunrise"]).isoformat(),
            sunset=datetime.fromtimestamp(sys["sunset"]).isoformat(),
        )

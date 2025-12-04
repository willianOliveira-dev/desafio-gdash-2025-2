from pydantic import BaseModel


class WeatherData(BaseModel):
    city: str
    country: str
    temperature: float
    feelsLike: float
    tempMin: float
    tempMax: float
    humidity: int
    pressure: int
    windSpeed: float
    windDeg: int
    clouds: int
    condition: str
    sunrise: str
    sunset: str
    currentTime: str

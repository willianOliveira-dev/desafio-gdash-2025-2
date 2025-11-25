from pydantic import BaseModel


class WeatherData(BaseModel):
    city: str
    country: str
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_deg: int
    clouds: int
    condition: str
    sunrise: str
    sunset: str

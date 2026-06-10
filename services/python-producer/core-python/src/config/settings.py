from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


CURRENT_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = CURRENT_DIR / ".env"


class Settings(BaseSettings):
    WEATHER_API_KEY: str
    WEATHER_BASE_URL: str
    WEATHER_CITIES: str
    WEATHER_INTERVAL: float

    RABBITMQ_URL: str
    RABBITMQ_QUEUE: str
    RABBITMQ_EXCHANGE: str
    RABBITMQ_ROUTING_KEY: str

    model_config = SettingsConfigDict(env_file=ENV_PATH, env_file_encoding="utf-8")


settings = Settings()

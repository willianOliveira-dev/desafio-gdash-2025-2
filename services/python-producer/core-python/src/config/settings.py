from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


CURRENT_DIR = Path(__file__).resolve().parent.parent.parent

ENV_PATH = CURRENT_DIR / ".env"

class Settings(BaseSettings):
    
    WEATHER_API_KEY: str | None = None
    WEATHER_BASE_URL: str | None = None
    WEATHER_CITIES: str | None = None
    WEATHER_INTERVAL: str | None = None
    
    RABBITMQ_URL: str | None = None
    RABBITMQ_QUEUE:str | None = None
    
    model_config = SettingsConfigDict(env_file=ENV_PATH, env_file_encoding="utf-8")


settings = Settings()
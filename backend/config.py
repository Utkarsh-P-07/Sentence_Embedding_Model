from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    MODEL_NAME: str = "all-MiniLM-L6-v2"
    MODEL_VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()

from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "CYBERX Risk Intelligence Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "cyberx-secret-key-change-in-production"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite:///./cyberx.db"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

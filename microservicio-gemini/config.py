import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuración del microservicio."""
    
    # Google Cloud
    PROJECT_ID: str = "tesis-475602"
    REGION: str = "us-central1"
    MODEL_ID: str = "gemini-2.0-flash"
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 5000
    DEBUG: bool = False
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8080"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def origins_list(self) -> list[str]:
        """Convierte ALLOWED_ORIGINS de string a lista."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()

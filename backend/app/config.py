import os
from typing import List

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "VayuNet Air Quality Micro-Mapping"
        VERSION: str = "1.0.0"
        API_V1_STR: str = "/api"
        ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        DATABASE_URL: str = os.getenv(
            "DATABASE_URL", 
            "postgresql://postgres:postgres@localhost:5432/airquality_db"
        )
        OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

        @property
        def cors_origin_list(self) -> List[str]:
            if self.CORS_ORIGINS == "*":
                return ["*"]
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

        class Config:
            case_sensitive = True

    settings = Settings()
except ImportError:
    class Settings:
        PROJECT_NAME: str = "VayuNet Air Quality Micro-Mapping"
        VERSION: str = "1.0.0"
        API_V1_STR: str = "/api"
        ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        DATABASE_URL: str = os.getenv(
            "DATABASE_URL", 
            "postgresql://postgres:postgres@localhost:5432/airquality_db"
        )
        OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

        @property
        def cors_origin_list(self) -> List[str]:
            if self.CORS_ORIGINS == "*":
                return ["*"]
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    settings = Settings()


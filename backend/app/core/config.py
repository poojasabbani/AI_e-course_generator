"""Application settings via pydantic-settings."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    GROQ_API_KEY: str = ""
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    CORS_ORIGINS: str = "*"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

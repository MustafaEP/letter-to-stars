from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Optional so the service can boot and serve /health without secrets.
    # /rewrite will error if missing.
    GEMINI_API_KEY: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()

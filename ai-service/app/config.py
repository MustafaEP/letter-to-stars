from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """
    Uygulama ayarları
    
    .env dosyasından otomatik yüklenir
    Pydantic validation ile tip kontrolü yapar
    """
    
    # Gemini API
    gemini_api_key: str
    gemini_model: str = "gemini-2.0-flash-exp"
    
    # App Config
    environment: str = "development"
    log_level: str = "INFO"
    
    # API Config
    api_host: str = "0.0.0.0"
    api_port: int = 8001
    
    class Config:
        env_file = ".env"
        case_sensitive = False  # GEMINI_API_KEY = gemini_api_key


@lru_cache()  # Singleton pattern - bir kere oluştur, tekrar kullan
def get_settings() -> Settings:
    """Settings instance'ını döndürür (cached)"""
    return Settings()
from pydantic_settings import BaseSettings

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    database_url: str
    gemini_api_key: str = ""
    google_client_id: str = ""
    google_client_secret: str = ""
    jwt_secret_key: str
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"
    replicate_api_token: str = ""

    class Config:
        env_file = str(BASE_DIR / ".env")

settings = Settings()
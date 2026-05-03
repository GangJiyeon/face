from pydantic_settings import BaseSettings

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    database_url: str
    anthropic_api_key: str = "" 
    gemini_api_key: str = ""
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_bucket_name: str = ""

    class Config:
        env_file = str(BASE_DIR / ".env")

settings = Settings()
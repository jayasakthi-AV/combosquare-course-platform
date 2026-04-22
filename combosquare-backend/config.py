from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    SECRET_KEY: str

    # App
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    APP_NAME: str = "ComboSquare API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    FRONTEND_URL: str = "http://localhost:5173"

    # Default admin credentials
    ADMIN_EMAIL: str = "admin@combosquare.com"
    ADMIN_PASSWORD: str = "Admin@123"

<<<<<<< HEAD
    # Email / SMTP
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    COMPANY_EMAIL: str = "combosquareofficials@gmail.com"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

=======
   # RAZORPAY_KEY_SECRET=your_secret_here
    RAZORPAY_KEY_ID    : str = ""
    RAZORPAY_KEY_SECRET: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True
>>>>>>> f700401b282d94970f741a5fe852d1ba4888c410

settings = Settings()
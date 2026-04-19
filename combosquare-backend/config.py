from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    APP_NAME: str = "ComboSquare API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    FRONTEND_URL: str = "http://localhost:5173"

    # Default admin credentials
    ADMIN_EMAIL: str = "admin@combosquare.com"
    ADMIN_PASSWORD: str = "Admin@123"

   # RAZORPAY_KEY_SECRET=your_secret_here
    RAZORPAY_KEY_ID    : str = ""
    RAZORPAY_KEY_SECRET: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
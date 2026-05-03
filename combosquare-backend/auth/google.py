# auth/google.py
import os
import json
import httpx
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from starlette.requests import Request
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from urllib.parse import quote

load_dotenv()

from database import SessionLocal
from models.user import User
from core.security import create_access_token

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
REDIRECT_URI = "http://localhost:8001/auth/google/callback"


def get_or_create_user(db: Session, email: str, full_name: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            full_name=full_name,
            email=email,
            hashed_password="google_oauth",
            mobile=None,
            role="student",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.get("/auth/google")
async def google_login():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid email profile"
        "&access_type=offline"
    )
    return RedirectResponse(url=google_auth_url, status_code=302)


@router.get("/auth/google/callback", name="google_callback")
async def google_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return RedirectResponse(url=f"{FRONTEND_URL}/login", status_code=302)

    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_response.json()

        userinfo_response = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        user_info = userinfo_response.json()

    email = user_info.get("email")
    name = user_info.get("name", "")

    db = SessionLocal()
    try:
        user = get_or_create_user(db, email=email, full_name=name)
    finally:
        db.close()

    access_token = create_access_token(data={"sub": str(user.id)})
    role = user.role

    # Pass token and role directly in URL — simple, no cookies needed
    redirect_url = f"{FRONTEND_URL}/auth/callback?token={access_token}&role={role}"
    return RedirectResponse(url=redirect_url, status_code=302)

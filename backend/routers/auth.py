from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.connection import get_db
from models.user import User
from utils.otp import generate_otp, verify_otp, send_otp_email
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import os

load_dotenv()

router     = APIRouter(prefix="/auth", tags=["Auth"])
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-32-chars-minimum!!")
ALGORITHM  = "HS256"


# ─── Helpers ──────────────────────────────────────────────────────────────────
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub":   user_id,
        "email": email,
        "exp":   datetime.utcnow() + timedelta(days=7),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ─── Schemas ──────────────────────────────────────────────────────────────────
class OTPRequest(BaseModel):
    email: EmailStr
    name:  str = ""


class OTPVerify(BaseModel):
    email: EmailStr
    otp:   str


class GoogleLoginRequest(BaseModel):
    token: str


class ProfileUpdate(BaseModel):
    user_id:        str
    name:           str | None = None
    college:        str | None = None
    monthly_budget: float | None = None
    monthly_income: float | None = None
    savings_goal:   float | None = None


# ─── Routes ───────────────────────────────────────────────────────────────────
@router.post("/send-otp")
async def send_otp(req: OTPRequest):
    otp = generate_otp(req.email)
    try:
        await send_otp_email(req.email, otp)
    except Exception as e:
        # Always print in dev so hackathon demo works even without SMTP
        print(f"[DEV OTP] {req.email} → {otp}  | SMTP error: {e}")
    return {"message": "OTP sent! Check your email (or server console in dev)."}


@router.post("/verify-otp")
async def verify_otp_route(req: OTPVerify, db: AsyncSession = Depends(get_db)):
    if not verify_otp(req.email, req.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP. Try again.")

    result = await db.execute(select(User).where(User.email == req.email))
    user   = result.scalar_one_or_none()

    if not user:
        user = User(email=req.email, auth_provider="email")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(str(user.id), user.email)
    return {
        "access_token": token,
        "user": {
            "id":             str(user.id),
            "email":          user.email,
            "name":           user.name or "",
            "college":        user.college or "",
            "monthly_budget": float(user.monthly_budget or 5000),
            "monthly_income": float(user.monthly_income or 8000),
            "savings_goal":   float(user.savings_goal or 2000),
        },
    }


@router.post("/google")
async def google_login(req: GoogleLoginRequest, db: AsyncSession = Depends(get_db)):
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as g_requests

        info  = id_token.verify_oauth2_token(
            req.token,
            g_requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID", ""),
        )
        email = info["email"]
        name  = info.get("name", "")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token.")

    result = await db.execute(select(User).where(User.email == email))
    user   = result.scalar_one_or_none()

    if not user:
        user = User(email=email, name=name, auth_provider="google")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(str(user.id), email)
    return {
        "access_token": token,
        "user": {
            "id":             str(user.id),
            "email":          email,
            "name":           name,
            "college":        user.college or "",
            "monthly_budget": float(user.monthly_budget or 5000),
            "monthly_income": float(user.monthly_income or 8000),
            "savings_goal":   float(user.savings_goal or 2000),
        },
    }


@router.put("/profile")
async def update_profile(req: ProfileUpdate, db: AsyncSession = Depends(get_db)):
    import uuid
    result = await db.execute(select(User).where(User.id == uuid.UUID(req.user_id)))
    user   = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if req.name           is not None: user.name           = req.name
    if req.college        is not None: user.college        = req.college
    if req.monthly_budget is not None: user.monthly_budget = req.monthly_budget
    if req.monthly_income is not None: user.monthly_income = req.monthly_income
    if req.savings_goal   is not None: user.savings_goal   = req.savings_goal

    await db.commit()
    await db.refresh(user)
    return {"message": "Profile updated.", "user": {
        "id": str(user.id), "name": user.name, "college": user.college,
        "monthly_budget": float(user.monthly_budget),
        "monthly_income": float(user.monthly_income),
        "savings_goal":   float(user.savings_goal),
    }}

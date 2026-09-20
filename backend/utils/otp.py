import random
import aiosmtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

# In-memory OTP store (fast for hackathon; swap for Redis in production)
_otp_store: dict = {}


def generate_otp(email: str) -> str:
    otp = str(random.randint(100000, 999999))
    _otp_store[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=10),
    }
    return otp


def verify_otp(email: str, otp: str) -> bool:
    record = _otp_store.get(email)
    if not record:
        return False
    if datetime.utcnow() > record["expires_at"]:
        _otp_store.pop(email, None)
        return False
    if record["otp"] == otp:
        _otp_store.pop(email, None)
        return True
    return False


async def send_otp_email(to_email: str, otp: str) -> None:
    msg = EmailMessage()
    msg["From"]    = os.getenv("SMTP_EMAIL", "")
    msg["To"]      = to_email
    msg["Subject"] = "🔐 Your AI Finance OTP — Valid 10 mins"
    msg.set_content(f"""
Hi there! 👋

Your one-time password for AI Financial Literacy Platform:

        ┌──────────────┐
        │   {otp}    │
        └──────────────┘

Valid for 10 minutes. Do NOT share this with anyone.

Stay financially smart! 🚀
— AI Finance Team
""")

    smtp_email    = os.getenv("SMTP_EMAIL", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")

    if not smtp_email or not smtp_password:
        print(f"[DEV] OTP for {to_email} → {otp}  (SMTP not configured)")
        return

    await aiosmtplib.send(
        msg,
        hostname="smtp.gmail.com",
        port=587,
        username=smtp_email,
        password=smtp_password,
        start_tls=True,
    )

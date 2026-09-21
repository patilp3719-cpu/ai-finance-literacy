from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from routers import auth, expenses, affordability, scholarship
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="AI Financial Literacy API",
    description="AI-powered financial advisor for Indian college students 🇮🇳",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "https://ai-finance-literacy.vercel.app",
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "*",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── DB Init on startup ───────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables ready.")


# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(affordability.router)
app.include_router(scholarship.router)


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "message": "🚀 AI Financial Literacy API is running!",
        "status":  "healthy",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}

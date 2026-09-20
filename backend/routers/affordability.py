from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database.connection import get_db
from models.user import User, Expense
from services.llm_service import ask_affordability_ai
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/afford", tags=["Affordability"])

# A nil UUID used when no user is logged in
_NIL_UUID = uuid.UUID("00000000-0000-0000-0000-000000000000")


# ─── Schema ───────────────────────────────────────────────────────────────────
class AffordRequest(BaseModel):
    user_id:    Optional[str] = None   # optional — works without login too
    item_name:  str
    item_price: float


# ─── Route ────────────────────────────────────────────────────────────────────
@router.post("/check")
async def check_affordability(req: AffordRequest, db: AsyncSession = Depends(get_db)):
    # Parse user_id safely — fall back to nil UUID if missing/invalid
    try:
        uid = uuid.UUID(req.user_id) if req.user_id else _NIL_UUID
    except ValueError:
        uid = _NIL_UUID

    # Fetch user profile (optional — use defaults if not found)
    user_result = await db.execute(select(User).where(User.id == uid))
    user        = user_result.scalar_one_or_none()

    # Fetch total spent (0 if no user)
    total_result = await db.execute(
        select(func.sum(Expense.amount)).where(Expense.user_id == uid)
    )
    total_spent = float(total_result.scalar() or 0)

    monthly_budget = float(user.monthly_budget) if user else 5000.0
    monthly_income = float(user.monthly_income) if user else 8000.0
    savings_goal   = float(user.savings_goal)   if user else 2000.0
    available      = max(0.0, monthly_budget - total_spent)

    profile = {
        "monthly_income": monthly_income,
        "monthly_budget": monthly_budget,
        "savings_goal":   savings_goal,
        "total_spent":    total_spent,
    }

    ai_response = await ask_affordability_ai(profile, req.item_name, req.item_price)

    # Simple affordability score (0–100)
    if req.item_price <= 0:
        score = 100
    elif available >= req.item_price:
        score = min(100, int((available / req.item_price) * 80))
    else:
        score = max(5, int((available / req.item_price) * 50))

    # Months to save (saving 25% of monthly income each month)
    monthly_savings_capacity = monthly_income * 0.25
    months_to_save = (
        round(req.item_price / monthly_savings_capacity, 1)
        if monthly_savings_capacity > 0 else None
    )

    return {
        "ai_response":         ai_response,
        "affordability_score": score,
        "available_budget":    round(available, 2),
        "total_spent":         round(total_spent, 2),
        "months_to_save":      months_to_save,
    }

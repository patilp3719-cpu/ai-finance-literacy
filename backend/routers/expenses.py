from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database.connection import get_db
from models.user import Expense
from services.llm_service import ask_expense_ai
from pydantic import BaseModel
from typing import Optional
from datetime import date
import uuid

router = APIRouter(prefix="/expenses", tags=["Expenses"])

CATEGORIES = [
    "Food", "Transport", "Education", "Rent",
    "Entertainment", "Medical", "Clothing", "Other",
]


# ─── Schemas ──────────────────────────────────────────────────────────────────
class ExpenseCreate(BaseModel):
    user_id:     str
    amount:      float
    category:    str
    description: Optional[str] = ""
    date:        Optional[str] = str(date.today())


class AIQuestion(BaseModel):
    user_id:  str
    question: str = "Analyze my spending and give me personalized tips"


# ─── Routes ───────────────────────────────────────────────────────────────────
@router.get("/categories")
async def get_categories():
    return {"categories": CATEGORIES}


@router.post("/add")
async def add_expense(exp: ExpenseCreate, db: AsyncSession = Depends(get_db)):
    new_exp = Expense(
        user_id=uuid.UUID(exp.user_id),
        amount=exp.amount,
        category=exp.category,
        description=exp.description,
        date=exp.date,
    )
    db.add(new_exp)
    await db.commit()
    return {"message": "Expense added successfully.", "id": str(new_exp.id)}


@router.delete("/delete/{expense_id}")
async def delete_expense(expense_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Expense).where(Expense.id == uuid.UUID(expense_id)))
    exp    = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found.")
    await db.delete(exp)
    await db.commit()
    return {"message": "Deleted."}


@router.get("/list/{user_id}")
async def list_expenses(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Expense)
        .where(Expense.user_id == uuid.UUID(user_id))
        .order_by(Expense.created_at.desc())
        .limit(50)
    )
    expenses = result.scalars().all()
    return [
        {
            "id":          str(e.id),
            "amount":      float(e.amount),
            "category":    e.category,
            "description": e.description or "",
            "date":        e.date or str(date.today()),
        }
        for e in expenses
    ]


@router.get("/summary/{user_id}")
async def expense_summary(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Expense).where(Expense.user_id == uuid.UUID(user_id))
    )
    expenses = result.scalars().all()

    summary: dict[str, float] = {}
    for e in expenses:
        summary[e.category] = round(summary.get(e.category, 0) + float(e.amount), 2)

    total = round(sum(summary.values()), 2)
    return {"summary": summary, "total": total}


@router.post("/ask-ai")
async def ask_ai(req: AIQuestion, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Expense)
        .where(Expense.user_id == uuid.UUID(req.user_id))
        .order_by(Expense.created_at.desc())
        .limit(30)
    )
    expenses = result.scalars().all()
    exp_list = [
        {"category": e.category, "amount": float(e.amount), "description": e.description or ""}
        for e in expenses
    ]
    response = await ask_expense_ai(exp_list, req.question)
    return {"response": response}

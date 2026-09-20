from fastapi import APIRouter
from services.llm_service import ask_scholarship_ai
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/scholarship", tags=["Scholarship"])


# ─── Schema ───────────────────────────────────────────────────────────────────
class ScholarshipRequest(BaseModel):
    college:       Optional[str]   = "Indian University"
    course:        Optional[str]   = "Engineering"
    family_income: Optional[float] = 400000
    category:      Optional[str]   = "General"
    state:         Optional[str]   = "Maharashtra"
    score:         Optional[str]   = "75"


# ─── Route ────────────────────────────────────────────────────────────────────
@router.post("/advise")
async def get_scholarship_advice(req: ScholarshipRequest):
    advice = await ask_scholarship_ai(req.model_dump())
    return {"advice": advice}

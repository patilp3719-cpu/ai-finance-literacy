from sqlalchemy import Column, String, Numeric, DateTime, Text, func
from sqlalchemy.dialects.postgresql import UUID
from database.connection import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name           = Column(String(100))
    email          = Column(String(150), unique=True, nullable=False)
    auth_provider  = Column(String(20),  default="email")
    college        = Column(String(150))
    monthly_budget = Column(Numeric(10, 2), default=5000.00)
    monthly_income = Column(Numeric(10, 2), default=8000.00)
    savings_goal   = Column(Numeric(10, 2), default=2000.00)
    created_at     = Column(DateTime, default=func.now())


class Expense(Base):
    __tablename__ = "expenses"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True))
    amount      = Column(Numeric(10, 2), nullable=False)
    category    = Column(String(50), nullable=False)
    description = Column(Text)
    date        = Column(String(20))
    created_at  = Column(DateTime, default=func.now())


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True))
    module       = Column(String(30))
    user_message = Column(Text)
    ai_response  = Column(Text)
    created_at   = Column(DateTime, default=func.now())

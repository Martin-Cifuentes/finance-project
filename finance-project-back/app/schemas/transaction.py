from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime

class TransactionBase(BaseModel):
    type: str # ingreso, egreso
    value: float
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    date: Optional[datetime] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    value: Optional[float] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    date: Optional[datetime] = None

class TransactionInDBBase(TransactionBase):
    id: UUID
    user_id: UUID
    transaction_date: datetime
    model_config = {"from_attributes": True}

class TransactionResponse(TransactionInDBBase):
    pass

class BalanceResponse(BaseModel):
    balance: float

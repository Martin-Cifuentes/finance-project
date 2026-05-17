from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    monthly_budget: Optional[float] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    monthly_budget: Optional[float] = None

class CategoryInDBBase(CategoryBase):
    id: UUID
    user_id: UUID
    model_config = {"from_attributes": True}

class CategoryResponse(CategoryInDBBase):
    pass

class CategoryDetailResponse(CategoryResponse):
    gastado: float = 0.0
    porcentaje_uso: float = 0.0

from pydantic import BaseModel, EmailStr
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: str | None = None

class UserInDBBase(UserBase):
    id: UUID
    model_config = {"from_attributes": True}

class UserResponse(UserInDBBase):
    pass

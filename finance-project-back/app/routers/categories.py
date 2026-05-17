from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryDetailResponse
from typing import List
from uuid import UUID

router = APIRouter()

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_category = db.query(Category).filter(
        Category.user_id == current_user.id, 
        Category.name == category_in.name
    ).first()
    
    if existing_category:
        if existing_category.deleted_at is not None:
            existing_category.deleted_at = None
            existing_category.monthly_budget = category_in.monthly_budget
            db.add(existing_category)
            db.commit()
            db.refresh(existing_category)
            return existing_category
        else:
            raise HTTPException(status_code=400, detail="La categoría ya existe")
            
    category = Category(
        name=category_in.name,
        monthly_budget=category_in.monthly_budget,
        user_id=current_user.id
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.get("", response_model=List[CategoryResponse])
def read_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Category).filter(Category.user_id == current_user.id, Category.deleted_at == None).all()

@router.get("/{id}", response_model=CategoryDetailResponse)
def read_category(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    category = db.query(Category).filter(
        Category.id == id,
        Category.user_id == current_user.id,
        Category.deleted_at == None
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    now = datetime.datetime.utcnow()
    start_of_month = datetime.datetime(now.year, now.month, 1)
    gastado = db.query(func.sum(Transaction.value)).filter(
        Transaction.category_id == id,
        Transaction.type == 'egreso',
        Transaction.deleted_at == None,
        Transaction.transaction_date >= start_of_month
    ).scalar() or 0.0
    
    porcentaje_uso = 0.0
    if category.monthly_budget and category.monthly_budget > 0:
        porcentaje_uso = (float(gastado) / float(category.monthly_budget)) * 100

    response_data = CategoryDetailResponse.model_validate(category)
    response_data.gastado = float(gastado)
    response_data.porcentaje_uso = porcentaje_uso
    return response_data

@router.put("/{id}", response_model=CategoryResponse)
def update_category(
    id: UUID,
    category_in: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    category = db.query(Category).filter(
        Category.id == id,
        Category.user_id == current_user.id,
        Category.deleted_at == None
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    if category_in.name is not None:
        category.name = category_in.name
    if category_in.monthly_budget is not None:
        category.monthly_budget = category_in.monthly_budget
        
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.delete("/{id}", response_model=CategoryResponse)
def delete_category(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    category = db.query(Category).filter(
        Category.id == id,
        Category.user_id == current_user.id,
        Category.deleted_at == None
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    category.deleted_at = datetime.datetime.utcnow()
    db.add(category)
    db.commit()
    return category

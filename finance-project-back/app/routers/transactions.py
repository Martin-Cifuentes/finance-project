from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse, BalanceResponse
from typing import List, Optional
from uuid import UUID
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.get("/balance", response_model=BalanceResponse)
def get_balance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ingresos = db.query(func.sum(Transaction.value)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == 'ingreso',
        Transaction.deleted_at == None
    ).scalar() or 0.0
    
    egresos = db.query(func.sum(Transaction.value)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == 'egreso',
        Transaction.deleted_at == None
    ).scalar() or 0.0
    
    return {"balance": float(ingresos) - float(egresos)}

@router.post("", status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if transaction_in.category_id:
        cat = db.query(Category).filter(
            Category.id == transaction_in.category_id,
            Category.user_id == current_user.id,
            Category.deleted_at == None
        ).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Invalid category")
            
    transaction = Transaction(
        user_id=current_user.id,
        category_id=transaction_in.category_id,
        value=transaction_in.value,
        type=transaction_in.type,
        description=transaction_in.description
    )
    if transaction_in.date:
        transaction.transaction_date = transaction_in.date
        
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    response_data = jsonable_encoder(TransactionResponse.model_validate(transaction))
    
    if transaction.type == 'egreso' and transaction.category_id:
        cat = db.query(Category).filter(Category.id == transaction.category_id).first()
        if cat and cat.monthly_budget and cat.monthly_budget > 0:
            now = datetime.datetime.utcnow()
            start_of_month = datetime.datetime(now.year, now.month, 1)
            gastado = db.query(func.sum(Transaction.value)).filter(
                Transaction.category_id == transaction.category_id,
                Transaction.type == 'egreso',
                Transaction.deleted_at == None,
                Transaction.transaction_date >= start_of_month
            ).scalar() or 0.0
            
            if gastado >= cat.monthly_budget:
                response_data["meta"] = {"alerta": "100_percent_exceeded"}
            elif gastado >= float(cat.monthly_budget) * 0.8:
                response_data["meta"] = {"alerta": "80_percent_exceeded"}
                
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=response_data)

@router.get("", response_model=List[TransactionResponse])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    type: Optional[str] = None,
    category_id: Optional[UUID] = None,
    start_date: Optional[datetime.datetime] = None,
    end_date: Optional[datetime.datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.deleted_at == None
    )
    
    if type:
        query = query.filter(Transaction.type == type)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if start_date:
        query = query.filter(Transaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(Transaction.transaction_date <= end_date)
        
    return query.order_by(Transaction.transaction_date.desc()).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=TransactionResponse)
def read_transaction(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t = db.query(Transaction).filter(
        Transaction.id == id,
        Transaction.user_id == current_user.id,
        Transaction.deleted_at == None
    ).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return t

@router.put("/{id}", response_model=TransactionResponse)
def update_transaction(
    id: UUID,
    transaction_in: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t = db.query(Transaction).filter(
        Transaction.id == id,
        Transaction.user_id == current_user.id,
        Transaction.deleted_at == None
    ).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    if transaction_in.value is not None:
        t.value = transaction_in.value
    if transaction_in.description is not None:
        t.description = transaction_in.description
    if transaction_in.category_id is not None:
        t.category_id = transaction_in.category_id
    if transaction_in.date is not None:
        t.transaction_date = transaction_in.date
        
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

@router.delete("/{id}", response_model=TransactionResponse)
def delete_transaction(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t = db.query(Transaction).filter(
        Transaction.id == id,
        Transaction.user_id == current_user.id,
        Transaction.deleted_at == None
    ).first()
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    t.deleted_at = datetime.datetime.utcnow()
    db.add(t)
    db.commit()
    return t

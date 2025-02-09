
from pydantic import BaseModel,field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class Expense(BaseModel):
    expense_id: str
    user_id: str
    expense_name: str
    expense_description: Optional[str] = None
    amount: float
    date:str= datetime.now()
    category: str
    is_personal_expense: bool
    is_group_expense: bool
    group_id: Optional[str] = None  # Required only for group expenses
    split_type: Optional[str] = "equal"  # Options: "equal", "percentage", "custom"
    participants: List[Dict[str, Any]] = []  # List of users with their split
    attachments: Optional[List[str]] = []  # Receipts or images
    status: str = "pending"  # Can be "pending", "settled", "reimbursed"
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    
    
    def to_dict(self):
        return {
            "expense_id": self.expense_id,
            "user_id": self.user_id,
            "expense_name": self.expense_name,
            "expense_description": self.expense_description,
            "amount": self.amount,
            "date": self.date,
            "category": self.category,
            "is_personal_expense": self.is_personal_expense,
            "is_group_expense": self.is_group_expense,
            "group_id": self.group_id,
            "split_type": self.split_type,
            "participants": self.participants,
            "attachments": self.attachments,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
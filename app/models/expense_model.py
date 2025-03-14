
from pydantic import BaseModel,field_validator,Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
class UserSplit(BaseModel):
    email: str
    split_amount: float

class GroupExpense(BaseModel):
    expense_id: str
    user_id: str
    expense_name: str
    expense_description: str
    amount: float
    date: str = Field(default_factory=lambda: datetime.now().strftime("%m/%d/%Y"))
    category: str
    is_group_expense: bool
    group_id: str
    split_type: str = "equal"
    participants: List[str]  # List of emails
    attachments: Optional[List[str]] = []
    status: str = "pending"
    paid_by:str
    total_owed_amout:float
    users: Optional[List[UserSplit]] = []  # Ensure correct type
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    
    def to_dict(self):
        return {
            "expense_id": self.expense_id,
            "user_id": self.user_id,
            "expense_name": self.expense_name,
            "expense_description": self.expense_description,
            "amount": self.amount,
            "date": self.date,
            "category": self.category,
            "is_group_expense": True,
            "group_id": self.group_id,
            "split_type": self.split_type,
            "total_owed_amout":self.total_owed_amout,
            "participants": self.participants,
            "attachments": self.attachments,
            "status": self.status,
            "user":self.users,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
        
        
class CreateIndividualExpense:
    merchant: str
    date:str
    category: str
    amount: float
    description: Optional[str] = None
    isReimbursable:bool
    attachments: Optional[List[str]] = []  # Receipts or images
    
    
    def to_dict(self):
        return {
            "merchant": self.merchant,
            "date": self.date,
            "category": self.category,
            "amount": self.amount,
            "description": self.description,
            "isReimbursable": self.isReimbursable,
            "attachments": self.attachments
        }
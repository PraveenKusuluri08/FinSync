from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class Receipt(BaseModel):
    receipt_name:str
    receipt_description:str
    receipt_image:str
    user:str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    
    def to_dict(self):
        return {
            "receipt_name": self.receipt_name,
            "receipt_description": self.receipt_description,
            "receipt_image": self.receipt_image,
            "user": self.user,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
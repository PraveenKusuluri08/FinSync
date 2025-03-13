from typing import Optional
from pydantic import BaseModel

class Participant(BaseModel):
    email: str
    is_invitation_accepted: bool = False
    invitation_token: Optional[str] = None
    link_expiry: Optional[str] = None

class Group(BaseModel):
    group_id: str
    group_name: str
    users: list[str]
    created_by: str
    group_type: str
    group_participants_invited: list[Participant]  # List of Participant objects
    group_description: str
    
    def to_dict(self):
        return {
            "group_id": self.group_id,
            "group_name": self.group_name,
            "users": self.users,
            "created_by": self.created_by,
            "group_type": self.group_type,
            "group_participants_invited": self.group_participants_invited,
            "group_description": self.group_description
        }
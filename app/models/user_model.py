import re
from datetime import datetime
from pydantic import BaseModel,field_validator
class User(BaseModel):
    firstname: str
    lastname: str
    email: str
    password: str
    phone_number:str
    created_at:str = datetime.now()
    profile_image:str
    
    def to_dict(self):
        return {
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "password": self.password,
            "phone_number": self.phone_number,
            "profile_image": self.profile_image
        }
    
    # @field_validator("password")
    # def validate_password(cls, password):
    #     print(f"Validating password: {password}")
    #     pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"

    #     if not re.match(pattern, password):
    #         raise ValueError("Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.")

    #     return password
          
    # @field_validator("email")
    # def validate_email(cls, email):
    #     if not re.match(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", email):
    #         raise ValueError("Invalid email address")
    
    # @field_validator("phone_number")
    # def validate_phone_number(cls, phone_number):
    #     if not re.match(r"^\+?[0-9]{10,15}$", phone_number):
    #         raise ValueError("Invalid phone number")
    #     return phone_number
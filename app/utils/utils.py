import os
import jwt
from ..models import user_model
import bcrypt

class Utils():
    
    @staticmethod
    def generate_token(user):
        
        userInformation={
            "email":user["email"],
            "firstname":user["firstname"],
            "lastname":user["lastname"],
            "phone_number":user["phone_number"],
        }
        return  jwt.encode(userInformation,os.getenv("SECRET_KEY"),algorithm="HS256")
    
    
    @staticmethod
    def hash_password(password):
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    @staticmethod
    def verify_password(user_current_password, hashed_password):
        return bcrypt.checkpw(user_current_password.encode('utf-8'), hashed_password.encode('utf-8'))
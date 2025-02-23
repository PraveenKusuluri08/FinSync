import os
import jwt
import bcrypt
from ..models import user_model
from ..config import dbConfig
import datetime
class Utils():
    client = dbConfig.DB_Config()
    @staticmethod
    def generate_token(user):
        
        userInformation={
            "user_id":str(user["_id"]),
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
    
    @staticmethod
    def generate_invite_token(email, group_id):
        payload = {
            "email": email,
            "group_id": group_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # 1-hour expiration
        }
        token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
        return token
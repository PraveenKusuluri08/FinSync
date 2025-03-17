from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app.config.dbConfig import DB_Config

client = DB_Config()
db = client["FinSync"]  # Replace with your actual database name
users_collection = db["users"]  # Collection for storing users

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data["_id"])  # MongoDB stores `_id` as ObjectId
        self.username = user_data["username"]
        self.email = user_data["email"]
        self.password_hash = user_data["password_hash"]

    @staticmethod
    def create_user(username, email, password):
        hashed_password = generate_password_hash(password)
        user_data = {"username": username, "email": email, "password_hash": hashed_password}
        users_collection.insert_one(user_data)
        return user_data

    @staticmethod
    def find_by_email(email):
        user_data = users_collection.find_one({"email": email})
        return User(user_data) if user_data else None

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

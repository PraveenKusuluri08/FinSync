import os
from bson import ObjectId
from flask import jsonify, request, g
import jwt
from ..config import dbConfig

def middleware(func):
    def wrapper(*args, **kwargs):
        try:
            client = dbConfig.DB_Config()
            token = request.headers.get('Authorization').split(" ")[1]
            
            print("token",token)

            if not token:
                return jsonify({"code": "token_not_found", "error": "Please login again"}), 401

            token = token.split(" ")[1] if " " in token else token
            decoded = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])

            if not decoded:
                return jsonify({"error": "Invalid token"}), 401

            user_id = ObjectId(decoded["user_id"])
            user = client.users.find_one({"_id": user_id})

            if not user:
                return jsonify({"error": "User not found"}), 404

            # Store user in Flask's `g` (global context)
            g.user = {
                "_id": str(user["_id"]),
                "firstname": user["firstname"],
                "lastname": user["lastname"],
                "email": user["email"],
            }

            return func(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return wrapper

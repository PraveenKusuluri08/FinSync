import os
from flask import jsonify, request
import jwt

def midleware(func):
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return func(*args, **kwargs)

    return wrapper
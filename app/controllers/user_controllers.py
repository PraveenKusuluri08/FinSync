from flask import request,jsonify,session
from ..models import user_model
from ..config import dbConfig
from ..utils import utils
class UserControllers:
    client = dbConfig.DB_Config()
    def CreateUser(self):
        try:
            data = request.get_json()
            print("data", data)

            firstname = data.get("firstName")
            lastname = data.get("lastName")
            email = data.get("email")
            password = data.get("password")
            phone_number = data.get("phone")
            profile_image = data.get("profile_image")

            if not firstname or not lastname or not phone_number or not email or not password:
                return jsonify({"message": "Missing required fields"}), 400

            # Hash password before saving
            hashed_password = utils.Utils.hash_password(password)

            user_data = {
                "email": email,
                "password": hashed_password,
                "firstname": firstname,
                "lastname": lastname,
                "phone_number": phone_number,
                "profile_image": profile_image,
            }
            result = self.client.users.insert_one(user_data)
            user_data["_id"] = str(result.inserted_id)

            token = utils.Utils.generate_token(user_data)
            return jsonify({"message": "User created successfully", "token": token, "user": user_data}), 201
        
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500

        
    def LoginUser(self):
        try:
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")
        
            user = self.client.users.find_one({"email": email})
            
            if not user:
                return jsonify({"message": "User not found"}), 404

            if not utils.Utils.verify_password(password,user["password"]):
                return jsonify({"message": "Invalid password"}), 400
            
            user['_id'] = str(user['_id'])

            print(user, "user")
            token= utils.Utils.generate_token(user)
            
            print(token)
            
            session["email"] = user["email"]
            # session["token"] = token
            return jsonify({"token": token, "user":user}), 200

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
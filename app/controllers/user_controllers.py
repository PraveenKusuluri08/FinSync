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
           print("email", email)
           if not firstname or not lastname or not phone_number:
               return jsonify({"message": "Missing required fields"}), 400
           user = user_model.User(
               firstname=firstname,
               lastname=lastname,
               email=email,
               password=password,
               phone_number=phone_number,
               profile_image=profile_image
               )
           user.password = utils.Utils.hash_password(password)
           result = self.client.users.insert_one({
               "email": email,
               "password": user.password,
               "firstname": user.firstname,
               "lastname": user.lastname,
               "phone_number": user.phone_number,
               "profile_image": user.profile_image,
               "created_at": user.created_at,
               })
           inserted_user = self.client.users.find_one({"_id": result.inserted_id})
           token= utils.Utils.generate_token(inserted_user)
           inserted_user["_id"] = str(inserted_user["_id"])
           return jsonify({"message": "User created successfully","user":inserted_user, "token":token}), 201
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
            
            token= utils.Utils.generate_token(user)
            user['_id'] = str(user['_id'])
            print(token)
            
            session["email"] = user["email"]
            # session["token"] = token
            return jsonify({"token": token, "user":user}), 200

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    def GetProfile(self,user):
        return user
        
        
      
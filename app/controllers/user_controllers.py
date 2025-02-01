from flask import request,jsonify,session
from ..models import user_model
from ..config import dbConfig
from ..utils import utils
class UserControllers:
    client = dbConfig.DB_Config()
    def CreateUser(self):
        try:
            data = request.get_json()
            firstname = data.get("firstname")
            lastname = data.get("lastname")
            email = data.get("email")
            password = data.get("password")
            phone_number = data.get("phone_number")
            profile_image = data.get("profile_image")
            
            print("email",email)

            user = user_model.User(
                firstname=firstname,
                lastname=lastname,
                email=email,
                password=password,
                phone_number=phone_number,
                profile_image=profile_image
            )

            # if user.validate_email(email):
            #     return jsonify({"message": "Invalid email address"}), 400

            user.password = utils.Utils.hash_password(password)

            self.client.users.insert_one({
                "email":email,
                "password":user.password,
                "firstname":user.firstname,
                "lastname":user.lastname,
                "phone_number":user.phone_number,
                "profile_image": user.profile_image,
                "created_at": user.created_at,
            })

            return jsonify({"message": "User created successfully"}), 201

        except Exception as e:
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
            
            print(token)
            
            session["email"] = user["email"]
            # session["token"] = token
            return jsonify({"token": token}), 200

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
        
      
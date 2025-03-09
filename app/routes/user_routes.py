from flask import Blueprint,request,g,jsonify
from ..controllers import user_controllers
from ..utils import endpoint
users_blueprint = Blueprint("users",__name__)

@users_blueprint.route('/users', methods=["POST"])
def Create():
    if request.method == 'POST':
        user_controller = user_controllers.UserControllers()  
        return user_controller.CreateUser()
    else:
        return "Invalid request method", 405
    
@users_blueprint.route('/users/login', methods=["POST"])
def Login():
    if request.method == 'POST':
        user_controller = user_controllers.UserControllers()  
        return user_controller.LoginUser()
    else:
        return "Invalid request method", 405
    
@users_blueprint.route("/users/profile", methods=["GET"])
@endpoint.middleware
def Profile():
    if request.method == 'GET':
        user_controller = user_controllers.UserControllers()  
        return user_controller.GetProfile(g.user)
    return jsonify({"error": "Invalid request method"}), 405


@users_blueprint.route("/users/forgotpassword", methods=["POST"])
def ForgotPassword():
    if request.method == 'POST':
        user_controller = user_controllers.UserControllers()  
        return user_controller.ForgotPassword()
    else:
        return "Invalid request method", 405
    
@users_blueprint.route("/users/verifyOTP", methods=["POST"])
def VerifyOTP():
    if request.method == 'POST':
        user_controller = user_controllers.UserControllers()  
        return user_controller.ValidateOTP()
    else:
        return "Invalid request method", 405


@users_blueprint.route("/users/resetpassword", methods=["POST"])
def ResetPassword():
    if request.method == 'POST':
        user_controller = user_controllers.UserControllers()  
        return user_controller.ChangePassword()
    else:
        return "Invalid request method", 405
    
    
@users_blueprint.route("/users/updateprofile", methods=["POST"],endpoint="update_profile_image")
@endpoint.middleware
def UpdateProfileImage():
    if request.method == 'POST':
        user_controller = user_controllers.UserControllers()  
        return user_controller.UpdateProfileImage(g.user)
    else:
        return jsonify({"error": "Invalid request method"}), 405
    
@users_blueprint.route("/getuserinfo/<group_id>/<email>", methods=["GET"],endpoint="getuserinfo")
@endpoint.middleware
def GetUserInfo(group_id, email):
    if request.method == 'GET':
        user_controller = user_controllers.UserControllers()  
        return user_controller.Get_User_Information_Details(group_id, email)
    else:
        return jsonify({"error": "Invalid request method"}), 405
    
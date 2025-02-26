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
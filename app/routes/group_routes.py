from flask import request, Blueprint,g
from ..controllers import group_controller
from ..utils import endpoint
group_routes_blueprint = Blueprint("Groups", __name__ )

@group_routes_blueprint.route("/groups", methods=["POST"])
@endpoint.middleware
def Create():
    if request.method == "POST":
        groupc = group_controller.Group()
        user = g.user
        return groupc.CreateGroup(user)
    else:
        return "Invalid request method", 405
    

@group_routes_blueprint.route("/accept-invite", methods=["GET"])
def accept_invite():
    if request.method == "GET":
        return group_controller.Group().accept_invite()
    else:
        return "Invalid request method", 405

@group_routes_blueprint.route("/get_users",methods=["GET"])
def GetAllUsers():
    if request.method == "GET":
        return group_controller.Group().get_users()
    else:
        return "Invalid request method", 405
    
@group_routes_blueprint.route("/allgroups",methods=["GET"],endpoint="all_groups")
@endpoint.middleware
def GetAllUserGroups():
    if request.method == "GET":
        user = g.user
        return group_controller.Group().GetUserInvolvedGroups(user)
    else:
        return "Invalid request method", 405


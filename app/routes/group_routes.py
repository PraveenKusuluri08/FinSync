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
        return group_controller.Group().Accept_Invitation()
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

@group_routes_blueprint.route("/getgroup/<group_id>",methods=["GET"],endpoint="get_group")
@endpoint.middleware
def GetGroup(group_id):
    if request.method == "GET":
        user = g.user
        return group_controller.Group().GetGroupData(user,group_id)
    else:
        return "Invalid request method", 405

@group_routes_blueprint.route("/adduserstogroup/<group_id>",methods=["POST"],endpoint="add_users_to_group")
@endpoint.middleware
def AddUsersToGroup(group_id):
    if request.method == "POST":
        user = g.user
        return group_controller.Group().AddUsersToGroup(user, group_id)
    else:
        return "Invalid request method", 405


@group_routes_blueprint.route("/getusergroups",methods=["GET"],endpoint="get_user_groups")
@endpoint.middleware
def GetUserGroups():
    if request.method == "GET":
        user = g.user
        return group_controller.Group().GetAllGroupsData(user)
    else:
        return "Invalid request method", 405
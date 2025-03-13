from flask import Blueprint,g,request
from ..controllers import calendar_controller
from ..utils import endpoint
calendar_blueprint = Blueprint("calendar", __name__)

@calendar_blueprint.route("/calendar", methods=["GET"])
@endpoint.middleware
def GetExpenses():
    if request.method == 'GET':
        user = g.user
        calender_controller = calendar_controller.Calendar
        return calendar_controller.Calendar().GetExpenses(user)
    else:
        return "Invalid request method", 405
    
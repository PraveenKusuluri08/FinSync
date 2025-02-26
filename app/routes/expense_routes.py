from flask import Blueprint,request,g
from ..controllers import expense_controller
from ..utils import endpoint
expenses_blueprint = Blueprint("expenses", __name__)


@expenses_blueprint.route("/expenses", methods=["POST"])
def create_expense():
    if request.method == 'POST':
        expense_controllers=expense_controller.ExpenseControllers
        user= request.user
        return expense_controllers.create_expense(user)
    else:
        return "Invalid request method", 405


@expenses_blueprint.route("/expenses_manualcreate/personal", methods=["POST"])
@endpoint.middleware
def create_manual_personal_expense():
    if request.method == "POST":
        expense_controllers = expense_controller.ExpenseControllers()

        return expense_controllers.create_expense_manual_create_single_user_expense(g.user)
    else:
        return "Invalid request method", 405

@expenses_blueprint.route("/getexpenses", methods=["GET"], endpoint="get_expenses")
@endpoint.middleware
def GetExpenses():
    if request.method == 'GET':
        expense_controllers = expense_controller.ExpenseControllers()
        user = g.user 
        return expense_controllers.get_expenses_by_user(user)
    else:
        return "Invalid request method", 405
    

@expenses_blueprint.route("/getexpensebyid/<expense_id>", methods=["GET"], endpoint="get_expense_by_id")
@endpoint.middleware
def GetExpenseById(expense_id):
    if request.method == 'GET':
        expense_controllers = expense_controller.ExpenseControllers()
        user = g.user
        return expense_controllers.get_expense_by_id(user,expense_id)
    else:
        return "Invalid request method", 405
    

@expenses_blueprint.route("/updateexpensebyid/<expense_id>", methods=["PUT"], endpoint="update_expense_by_id")
@endpoint.middleware
def UpdateExpenseById(expense_id):
    if request.method == 'PUT':
        expense_controllers = expense_controller.ExpenseControllers()
        user = g.user
        return expense_controllers.update_expense_by_id(user, expense_id)
    else:
        return "Invalid request method", 405
    

@expenses_blueprint.route("/createGroupExpense/<groupID>", methods=["POST"], endpoint="group_expense")
@endpoint.middleware
def CreateGroupExpense(groupID):
    if request.method == 'POST':
        expense_controllers = expense_controller.ExpenseControllers()
        user = g.user
        return expense_controllers.CreateGroupExpense(user, groupID)
    else:
        return "Invalid request method", 405


@expenses_blueprint.route("/getgroupexpensebyinvolveduser", methods=["GET"], endpoint="group_expense_by_involved_user")
@endpoint.middleware
def GetGroupExpenseByInvolvedUser():
    if request.method == 'GET':
        expense_controllers = expense_controller.ExpenseControllers()
        user = g.user
        return expense_controllers.GetGroupExpenseByInvolvedUser(user)
    else:
        return "Invalid request method", 405
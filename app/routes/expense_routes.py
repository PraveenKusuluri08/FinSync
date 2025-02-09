from flask import Blueprint,request
from ..controllers import expense_controller

expenses_blueprint = Blueprint("expenses", __name__)


@expenses_blueprint.route("/expenses", methods=["POST"])
def create_expense():
    if request.method == 'POST':
        expense_controllers=expense_controller.ExpenseControllers
        return expense_controllers.create_expense()
    else:
        return "Invalid request method", 405



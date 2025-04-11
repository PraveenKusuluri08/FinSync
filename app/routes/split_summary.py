from flask import Blueprint, request, jsonify, g
from ..controllers import split_summary
from ..utils import endpoint
split_summary_blueprint = Blueprint("SplitSummary", __name__)

@split_summary_blueprint.route("/split_summary", methods=["GET"])
@endpoint.middleware
def SplitSummary():
    if request.method == 'GET':
        split_summary_controller = split_summary.SplitSummary()
        return split_summary_controller.BalanceSummary(g.user)
    return jsonify({"error": "Invalid request method"}), 405

@split_summary_blueprint.route("/settle_up_all_expenses", methods=["POST"],endpoint="settle_up_all_expenses")
@endpoint.middleware
def SettleUpAllExpenses():
    if request.method == 'POST':
        split_summary_controller = split_summary.SplitSummary()
        return split_summary_controller.SettleUpAllGroupExpenses(g.user)
    return jsonify({"error": "Invalid request method"}), 405


from flask import jsonify, Blueprint, request, g
from ..controllers import receipt_controller
from ..utils import endpoint

receipt_blueprint = Blueprint("Receipt", __name__)

@receipt_blueprint.route("/receipts", methods=["POST"])
@endpoint.middleware
def SaveReceipt():
    if request.method == "POST":
        receipt_controller_instance = receipt_controller.Receipt_Controller()
        user = g.user
        return receipt_controller_instance.SaveReceipt(user)
    else:
        return jsonify({"error": "Invalid request method"}), 405

@receipt_blueprint.route("/receipts", methods=["GET"],endpoint="GetReceipts")
@endpoint.middleware
def GetReceipts():
    if request.method == "GET":
        receipt_controller_instance = receipt_controller.Receipt_Controller()
        user = g.user
        return receipt_controller_instance.GetReceipts(user)
    else:
        return jsonify({"error": "Invalid request method"}), 405
    
@receipt_blueprint.route("/receipts/<receipt_id>", methods=["GET"],endpoint="GetReceiptById")
@endpoint.middleware 
def GetReceiptById(receipt_id):
    if request.method == "GET":
        receipt_controller_instance = receipt_controller.Receipt_Controller()
        user = g.user
        return receipt_controller_instance.GetReceiptByIdAndExtractData(user, receipt_id)
    else:
        return jsonify({"error": "Invalid request method"}), 405

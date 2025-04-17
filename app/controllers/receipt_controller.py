from flask import jsonify, request
from ..config import dbConfig
class Receipt_Controller:
    client = dbConfig.DB_Config()
    
    
    def SaveReceipt():
        pass
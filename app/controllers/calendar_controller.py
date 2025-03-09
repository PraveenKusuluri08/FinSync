from flask import jsonify
from ..config import dbConfig
class Calendar:
    client = dbConfig.DB_Config()
    
    # For this i need to get the expenses of the user in this format {title:"Expense Title",date:"date",amount:"amount"}
    def GetExpenses(self,user):
        pass
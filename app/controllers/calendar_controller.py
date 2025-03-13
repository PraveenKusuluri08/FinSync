from flask import jsonify
from ..config import dbConfig
class Calendar:
    client = dbConfig.DB_Config()
    
    # For this i need to get the expenses of the user in this format {title:"Expense Title",date:"date",amount:"amount"}
    def GetExpenses(self, user):
        try:
            if not user.get("email"):
                return jsonify({"message": "User not found"}), 404

            expenses_cursor = self.client.expenses.find(
                {"user_id": user["email"]},
                {"_id": 1, "merchant": 1, "amount": 1, "is_group_expense": 1,"date":1}
            )

            group_expenses_cursor = self.client.group_expenses.find(
                {"users.email": user["email"],"paid_by":user["email"]},
                {"_id": 1, "expense_name": 1, "amount": 1, "is_group_expense": 1,"date":1}
            )

            expenses = [
                {
                    "_id": str(exp["_id"]),
                    "expense_title": exp.get("merchant", "Unknown"), 
                    "amount": exp["amount"],
                    "is_group_expense": exp.get("is_group_expense", False),
                    "date":exp["date"]
                }
                for exp in expenses_cursor
            ]

            group_expenses = [
                {
                    "_id": str(exp["_id"]),
                    "expense_title": exp.get("expense_name", "Unknown"),
                    "amount": exp["amount"],
                    "is_group_expense": exp.get("is_group_expense", True),
                    "date":exp["date"]
                }
                for exp in group_expenses_cursor
            ]

            expenses.extend(group_expenses)

            return jsonify({"data": expenses}), 200

        except Exception as e:
            print(f"Error fetching expenses: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

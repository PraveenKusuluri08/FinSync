from flask import jsonify,request
from ..config import dbConfig
from bson.objectid import ObjectId
class SplitSummary:
    client = dbConfig.DB_Config()
    
    def BalanceSummary(self, user):
        print("Current User:", user)
        current_user = user.get("email")
        if not current_user:
            return jsonify({"error": "User not found"}), 404

        expenses = self.client.group_expenses.find({"is_group_expense": True})

        you_owe = {}
        you_are_owed = {}

        for expense in expenses:
            payer = expense.get("paid_by")

            for user_entry in expense.get("users", []):
                user_email = user_entry.get("user")
                amount = user_entry.get("split_amount", 0)

                # Case 1: Current user paid, others owe
                if payer == current_user and user_email != current_user:
                    you_are_owed[user_email] = you_are_owed.get(user_email, 0) + amount

                # Case 2: Someone else paid, current user owes
                elif user_email == current_user and payer != current_user:
                    you_owe[payer] = you_owe.get(payer, 0) + amount
                    
            you_are_owed_total = sum(you_are_owed.values())

        return jsonify({
            "you_owe": you_owe,
            "you_are_owed": you_are_owed,
            "you_are_owed_total": you_are_owed_total,
        }), 200
        
        
        
    def SettleUpAllGroupExpenses(self, user):
        current_user = user.get("email")
        settle_user = request.json.get("settle_user")

        if not current_user or not settle_user:
            return jsonify({"error": "Both current_user and settle_user are required"}), 400

        print(f"[INFO] Settling expenses between {current_user} and {settle_user}")

        # Find all group expenses where EITHER user is paid_by and the other is in users
        # OR both are in the users list
        expenses = self.client.group_expenses.find({
            "is_group_expense": True,
            "$or": [
                {
                    "paid_by": current_user,
                    "users.user": settle_user
                },
                {
                    "paid_by": settle_user,
                    "users.user": current_user
                },
                {
                    "users.user": {"$all": [current_user, settle_user]}
                }
            ]
        })

        updated_count = 0

        for expense in expenses:
            expense_id = expense["_id"]
            users = expense.get("users", [])
            changed = False

            print(f"\n[EXPENSE] {expense_id} USERS before clearing:")
            for u in users:
                print(f" - {u['user']} | split_amount={u['split_amount']} | cleared={u['isSplitCleared']}")

            # Loop through all users and clear split for current_user and settle_user
            for i in range(len(users)):
                user_entry = users[i]
                if user_entry["user"] in [current_user, settle_user] and not user_entry.get("isSplitCleared", False):
                   
                    users[i]["isSplitCleared"] = True
                    users[i]["split_amount"] = 0
                    changed = True
                  
            if changed:
                result = self.client.group_expenses.update_one(
                    {"_id": ObjectId(str(expense_id))},
                    {"$set": {"users": users}}
                )
                print(f"[UPDATED] {expense_id} | Modified Count: {result.modified_count}")
                updated_count += 1
            else:
                print(f"[SKIPPED] {expense_id} - No matching entries to clear.")

        return jsonify({
            "message": f"Settled all expenses between {current_user} and {settle_user}",
            "expenses_updated": updated_count
        }), 200
        
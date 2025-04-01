import uuid
from flask import request, jsonify
import datetime
import json
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
from ..models import expense_model
from ..config import dbConfig
from ..utils import file_upload

class ExpenseControllers:
    client = dbConfig.DB_Config()
    def create_expense(self, user):
        print(user)

        if user.user_id is None:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json()
        expenseId = uuid.uuid4().hex
        user_id = user.user_id
        expense_name = data.get("expense_name")
        expense_description = data.get("expense_description")
        amount = data.get("amount")
        date = data.get("date")
        category = data.get("category")
        is_personal_expense = data.get("is_personal_expense")
        is_group_expense = data.get("is_group_expense")
        group_id = data.get("group_id")
        split_type = data.get("split_type")
        participants = data.get("participants")
        attachments = data.get("attachments")
        status = data.get("status")

        print(data)

        expense = expense_model.Expense(
            expense_id=expenseId,
            user_id=user_id,
            expense_name=expense_name,
            expense_description=expense_description,
            amount=amount,
            date=date,
            category=category,
            is_personal_expense=is_personal_expense,
            is_group_expense=is_group_expense,
            group_id=group_id,
            split_type=split_type,
            participants=participants,
            attachments=attachments,
            status=status,
        )

        print(expense)

        # Save expense to database
        self.client.expenses.insert_one({
            "expense_id": expense.expense_id,
            "user_id": expense.user_id,
            "expense_name": expense.expense_name,
            "expense_description": expense.expense_description,
            "amount": expense.amount,
            "date": expense.date,
            "category": expense.category,
            "is_personal_expense": expense.is_personal_expense,
            "is_group_expense": expense.is_group_expense,
            "group_id": expense.group_id,
            "split_type": expense.split_type,
            "participants": expense.participants,
            "attachments": expense.attachments,
            "status": expense.status,
            "created_at": expense.created_at,
            "updated_at": expense.updated_at,
        })

        return jsonify({"message": "Expense created successfully"}), 201

    def create_expense_manual_create_single_user_expense(self, user):
        print(user)

        if user.get("email") is None:
            return jsonify({"message": "User not found"}), 404

        try:
            # Extract JSON data from request.form (multipart/form-data)
            expense_id = uuid.uuid4().hex
            user_id = user.get("email")
            expense_name = request.form.get("merchant")
            date = request.form.get("date")
            category = request.form.get("category")
            amount = request.form.get("amount")
            description = request.form.get("description")
            is_personal_expense = True
            is_group_expense = False

            # Handle Image Upload (if provided)
            image_url = None
            image = request.files.get("image")  # Use get() to avoid KeyErrors
            if image and image.filename:  # Ensure image exists and has a filename
                image_url = file_upload.upload_file(image)  # Upload to Cloudinary and get URL

            # Store in MongoDB
            expense_data = {
                "expense_id": expense_id,
                "user_id": user_id,
                "merchant": expense_name,
                "date": date,
                "category": category,
                "amount": amount,
                "description": description,
                "is_personal_expense": is_personal_expense,
                "is_group_expense": is_group_expense,
                "image_url": image_url,  # Store Cloudinary image URL in MongoDB
            }

            expense_result = self.client.expenses.insert_one(expense_data)

            # Convert ObjectId to string for JSON serializability
            expense_data["_id"] = str(expense_result.inserted_id)

            return jsonify({"message": "Expense stored successfully", "data": expense_data}), 201

        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 500

    def get_expenses_by_user(self, user):
        print(user)
        try:
            if user.get("email") is None:
                return jsonify({"message": "User not found"}), 404

            expenses_cursor = self.client.expenses.find({"user_id": user["email"]})

            # Convert MongoDB cursor to a list of dictionaries
            expenses = list(expenses_cursor)

            # Convert ObjectId fields to strings for JSON serializability
            for expense in expenses:
                expense["_id"] = str(expense["_id"])

            return jsonify({"data": expenses}), 200

        except Exception as e:
            print(f"Error fetching expenses: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        

    def get_expense_by_id(self, user, expense_id):
        print("Getting expense by",user)
        try:
            if user.get("email")==None:
                return jsonify({"message": "User not found"}), 404
            filter = {"expense_id":ObjectId(expense_id)}
            
            # Filter the expenses collection with the userId and the expenseId
            expense_document=self.client.expenses.find_one({"user_id":user.get("email"),"_id":ObjectId(expense_id)})
            if not expense_document:
                return jsonify({"message": "Expense not found"}), 404
            
            # Convert ObjectId fields to strings for JSON serializability
            expense_document["_id"] = str(expense_document["_id"])
            
            return jsonify({"data": expense_document}), 200
        
        except Exception as e:
            print(f"Error fetching expense: {e}")
            return jsonify({"error": "Internal Server Error"}), 500


    def update_expense_by_id(self, user, expense_id):
        print("Updating expense by", user)
        try:
            if user.get("email") is None:
                return jsonify({"message": "User not found"}), 404
        
            data = request.get_json()
            print(data)

            if "_id" in data:
                del data["_id"]
        
            filter = {"user_id": user.get("email"), "_id": ObjectId(expense_id)}

            updated_expense = self.client.expenses.update_one(filter, {"$set": data})
            if updated_expense.matched_count == 0:
             return jsonify({"message": "Expense not found"}), 404
        
            return jsonify({"message": "Expense updated successfully"}), 200

        except Exception as e:
            print(f"Error updating expense: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    def DeleteExpense(self,user,expense_id):
        try:
            if user.get("email") is None:
                return jsonify({"message": "User not found"}), 404

            filter = {"user_id": user.get("email"), "_id": ObjectId(expense_id)}

            deleted_expense = self.client.expenses.delete_one(filter)
            if deleted_expense.deleted_count == 0:
                return jsonify({"message": "Expense not found"}), 404

            return jsonify({"message": "Expense deleted successfully"}), 200
        
        except Exception as e:
            print(f"Error deleting expense: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
    

    def CreateGroupExpense(self, user, groupID):
        try:
            if user.get("email") is None:
                return jsonify({"message": "User not found"}), 404
            
            print("data",request.form.get("participants"))

            # Generate unique expense ID
            expense_id = uuid.uuid4().hex
            user_id = user.get("email")
            expense_name = request.form.get("expense_name")
            expense_description = request.form.get("expense_description")
            amount = request.form.get("amount")
            category = request.form.get("category")
            split_type = request.form.get("split_type")
            status = request.form.get("status")
            paid_by = request.form.get("paid_by")

            try:
                amount = float(amount)
            except ValueError:
                return jsonify({"error": "Invalid amount value"}), 400

            # Get group details
            group = self.client.groups.find_one({"group_id": groupID})
            if not group:
                return jsonify({"error": "Group not found"}), 404

            # Convert participants to a proper list
            participants_raw = request.form.get("participants")  # This might be a string
            if isinstance(participants_raw, str):
                try:
                    participants = json.loads(participants_raw)  # Convert to list
                except json.JSONDecodeError:
                    return jsonify({"error": "Invalid participants format"}), 400
            else:
                participants = participants_raw

            # Ensure the current user is included in the split calculation
            if user_id not in participants:
                participants.append(user_id)

            print("Final Participants List (For Split Calculation):", participants)

            # Handle file attachments
            attachments = []
            if "attachments" in request.files:
                uploaded_files = request.files.getlist("attachments")
                for file in uploaded_files:
                    if file.filename:
                        filename = secure_filename(file.filename)
                        file_url = file_upload.upload_file(file)  # Upload & get URL
                        attachments.append(file_url)

            # Splitting logic
            total_participants = len(participants)
            split_mapping = {}

            if total_participants == 0:
                return jsonify({"error": "No participants provided"}), 400

            if split_type == "equal":
                split_amount = round(amount / total_participants, 2)
                split_mapping = {email.strip(): split_amount for email in participants}

            elif split_type == "custom":
                split_amounts = request.form.getlist("split_amounts")

                if len(split_amounts) != total_participants:
                    return jsonify({"error": "Mismatch between participants and split amounts"}), 400

                try:
                    split_amounts = [float(a) for a in split_amounts]
                except ValueError:
                    return jsonify({"error": "Invalid split amount values"}), 400

                if sum(split_amounts) != amount:
                    return jsonify({"error": "Split amounts do not sum up to total amount"}), 400

                split_mapping = {participants[i].strip(): split_amounts[i] for i in range(total_participants)}

            # Construct users array: Exclude the current user from the users list
            users = []
            for email in participants:
                email = email.strip()
                if email != user_id:  # Exclude the current logged-in user
                    user_obj = {
                        "user": email,
                        "split_amount": float(split_mapping[email]),  # Individual user split
                        "isSplitCleared": (email == paid_by)  # Payer's share is always cleared
                    }
                    users.append(user_obj)

            # Calculate the total amount **other users owe** (excluding the current user)
            total_owed_amount = sum(user["split_amount"] for user in users if user["user"] != paid_by)

            # Construct the expense object
            expense = {
                "expense_id": expense_id,
                "user_id": user_id,
                "expense_name": expense_name,
                "expense_description": expense_description,
                "amount": float(amount),
                "category": category,
                "group_id": groupID,
                "split_type": split_type,
                "is_group_expense": True,       
                "attachments": attachments,
                "status": status,
                "users": users,
                "date":datetime.datetime.now().strftime("%m/%d/%Y"),
                "paid_by": paid_by,
                "total_owed_amount": total_owed_amount,
            }

            print("Expense Object Before Saving:", json.dumps(expense, indent=4))

            # Insert into database
            self.client.group_expenses.insert_one(expense)

            # Update each participant's expense record in the users collection (excluding the current user)
            for participant in participants:
                if participant.strip() != user_id:
                    self.client.users.update_one(
                        {"email": participant.strip()},
                        {"$push": {"expenses": expense_id}}
                    )

            # Update the group document with the new expense
            self.client.groups.update_one(
                {"group_id": groupID},
                {"$push": {"expenses": expense_id}}
            )

            return jsonify({"message": "Group expense created successfully"}), 201

        except Exception as e:
            print("Error:", e)
            return jsonify({"error": str(e)}), 500
        
    def GetGroupExpenseByInvolvedUser(self, user):
        try:
            if user.get("email") is None:
                return jsonify({"message": "User not found"}), 404

            user_email_regex = {"$regex": f"^{user['email']}$", "$options": "i"}

            filter = {
                "$or": [
                    {"user_id": user_email_regex},
                    {"users": {"$elemMatch": {"user": user_email_regex}}}
                ]
            }

            group_expenses = self.client.group_expenses.find(filter)
            group_expenses = list(group_expenses)

            for expense in group_expenses:
                expense["_id"] = str(expense["_id"])

            return jsonify({"data": group_expenses}), 200

        except Exception as e:
            print(f"Error fetching group expenses: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        
    
    def GetExpensesForGroup(self,user,group_id):
        try:
            if user.get("email")==None:
                return jsonify({"message": "User not found"}), 404
            filter = {"user_id":user.get("email"),"group_id": group_id, "is_group_expense": True}
            group_expenses = self.client.group_expenses.find(filter,{"_id":1,"expense_name":1,"amount":1,"users":1,"paid_by":1,"split_type":1,"expense_description":1,"total_owed_amount":1})
            group_expenses = list(group_expenses)
            # Convert ObjectId fields to strings for JSON serializability
            for expense in group_expenses:
                expense["_id"] = str(expense["_id"])

            return jsonify({"data": group_expenses}), 200

        except Exception as e:
            print(f"Error fetching group expenses: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        
    def SettleUpGroupExpenseByCreator(self, user):
        if user.get("email") is None:
            return jsonify({"message": "User not found"}), 404
            
        data = request.get_json()
        group_id = data.get("group_id")
        expense_id = data.get("expense_id")
        user_id_to_settle_up = data.get("user_id_to_settle_up")
        split_amount_cleared = data.get("split_amount_cleared")

        try:
            expense = self.client.group_expenses.find_one({"group_id": group_id, "expense_id": expense_id})
            if not expense:
                return jsonify({"error": "Expense not found"}), 404

            paid_by = expense.get("paid_by")
            if user.get("email") != paid_by:
                return jsonify({"error": "Only the payer can settle up expenses"}), 403

            updated_users = []
            user_found = False
            total_owed_amount = expense.get("total_owed_amount", 0)

            for participant in expense["users"]:
                if participant["user"] == user_id_to_settle_up:
                    if not participant["isSplitCleared"]:
                        current_split = participant.get("split_amount", 0)
                        amount_to_subtract = min(split_amount_cleared, current_split)  # Prevent negative
                        participant["split_amount"] = round(current_split - amount_to_subtract, 2)
                        total_owed_amount -= amount_to_subtract
                        if participant["split_amount"] <= 0:
                            participant["split_amount"] = 0
                            participant["isSplitCleared"] = True
                        user_found = True
                updated_users.append(participant)

            if not user_found:
                return jsonify({"error": "User not part of the expense or already settled"}), 400

            self.client.group_expenses.update_one(
                {"group_id": group_id, "expense_id": expense_id},
                {"$set": {"users": updated_users, "total_owed_amount": round(total_owed_amount, 2)}}
            )

            return jsonify({
                "message": f"User {user_id_to_settle_up} partially settled up",
                "total_owed_amount": round(total_owed_amount, 2)
            }), 200

        except Exception as e:
            print(f"Error settling up group expense: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

    
    def get_expense_summary(self, user):
        print("Received user:", user)  # Debugging the user data
        try:
            if not user.get("email"):
                return jsonify({"message": "User not found"}), 404

            # Pipeline to sum all expenses for the user (ignoring categories)
            pipeline = [
                {"$match": {"user_id": user["email"]}},  # Filter by user
                {"$group": {
                    "_id": None,  # No grouping by category, just sum all expenses
                    "total_amount": {"$sum": {"$toDouble": "$amount"}}  # Sum the amount as a number
                }}
            ]

            summary = list(self.client.expenses.aggregate(pipeline))

            # If no expenses found, return 0
            if not summary:
                return jsonify({"total_amount": 0}), 200

            # Extract the total amount from the summary
            total_amount = summary[0].get("total_amount", 0)
            print("summary", total_amount)
            return jsonify({"total_amount": total_amount}), 200

        except Exception as e:
            # Log the error (consider using a logging framework instead of print in production)
            print(f"Error fetching summary: {e}")
            return jsonify({"error": "Internal Server Error"}), 500



            
            
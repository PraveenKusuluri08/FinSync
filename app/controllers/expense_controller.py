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
    
    def CreateGroupExpense(self, user, groupID):
        try:
            if user.get("email") is None:
                return jsonify({"message": "User not found"}), 404

            expense_id = uuid.uuid4().hex
            user_id = user.get("email")
            expense_name = request.form.get("expense_name")
            expense_description = request.form.get("expense_description")
            amount = request.form.get("amount")
            category = request.form.get("category")
            split_type = request.form.get("split_type")
            participants = request.form.getlist("participants")  # Get all participants
            status = request.form.get("status")
            paid_by = request.form.get("paid_by")

            # Convert amount to float for calculations
            try:
                amount = float(amount)
            except ValueError:
                return jsonify({"error": "Invalid amount value"}), 400

            # Convert participants list properly
            parsed_participants = []
            for p in participants:
                try:
                    emails = json.loads(p) if isinstance(p, str) and p.startswith("[") else [p]
                    parsed_participants.extend(emails)
                except json.JSONDecodeError:
                    parsed_participants.append(p) 

            if user_id not in parsed_participants:
                parsed_participants.append(user_id)

            print("Final Participants List:", parsed_participants)

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
            users = []
            total_users = len(parsed_participants)

            if total_users == 0:
                return jsonify({"error": "No participants provided"}), 400

            if split_type == "equal":
                split_amount = round(amount / total_users, 2)  # Evenly distribute amount
                users = [{"email": email, "split_amount": split_amount} for email in parsed_participants]

            elif split_type == "custom":
                split_amounts = request.form.getlist("split_amounts")  # Get split amounts
                
                # Ensure the number of split amounts matches participants
                if len(split_amounts) != total_users:
                    return jsonify({"error": "Mismatch between participants and split amounts"}), 400
                
                # Convert split amounts to float
                try:
                    split_amounts = [float(a) for a in split_amounts]
                except ValueError:
                    return jsonify({"error": "Invalid split amount values"}), 400

                # Validate that the sum of custom split amounts equals total amount
                if sum(split_amounts) != amount:
                    return jsonify({"error": "Split amounts do not sum up to total amount"}), 400

                users = [{"email": parsed_participants[i], "split_amount": split_amounts[i]} for i in range(total_users)]

            # Create expense object
            expense = expense_model.GroupExpense(
                expense_id=expense_id,
                user_id=user_id,
                expense_name=expense_name,
                expense_description=expense_description,
                amount=str(amount),
                category=category,
                group_id=groupID,
                split_type=split_type,
                is_group_expense=True,       
                participants=parsed_participants,  # Ensure participants are correctly formatted
                attachments=attachments,
                status=status,
                users=users, 
                paid_by = paid_by,
            )

            print("Expense Object Before Saving:", expense)  # Debugging

            # Save to database with properly formatted users
            self.client.group_expenses.insert_one({
                "expense_id": expense.expense_id,
                "user_id": expense.user_id,
                "expense_name": expense.expense_name,
                "expense_description": expense.expense_description,
                "amount": str(expense.amount),
                "category": expense.category,
                "group_id": expense.group_id,
                "split_type": expense.split_type,
                "is_group_expense": expense.is_group_expense,
                "participants": expense.participants,  # This should now be a clean list
                "attachments": expense.attachments,
                "status": expense.status,
                "users": users,  # This should now contain correctly structured dictionaries
                "paid_by":expense.paid_by
            })

            return jsonify({"message": "Group expense created successfully"}), 201

        except Exception as e:
            print("Error:", e)
            return jsonify({"error": str(e)}), 500
    
    # For this function I need to query based on the expense involved by the user like
    # User is owner of the group or user is just involved in the split of the expense 
    # Then need to get all teh expense infomration and return array of expenses
    def GetGroupExpenseByInvolvedUser(self, user):
        try:
            if user.get("email") is None:
                return jsonify({"message": "User not found"}), 404
            
            filter = {"$or":[{"user_id":user["email"]},{"participants":{"$in":[user["email"]]}}]}
            group_expenses = self.client.group_expenses.find(filter)
            group_expenses = list(group_expenses)

            # Convert ObjectId fields to strings for JSON serializability
            for expense in group_expenses:
                expense["_id"] = str(expense["_id"])

            return jsonify({"data": group_expenses}), 200

        except Exception as e:
            print(f"Error fetching group expenses: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
import uuid
from flask import request, jsonify
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
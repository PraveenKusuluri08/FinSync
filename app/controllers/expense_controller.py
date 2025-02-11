from flask import request, jsonify
import uuid
from ..models import expense_model
from ..config import dbConfig
class ExpenseControllers():
    
    client = dbConfig.DB_Config()
    def create_expense(self,user):
        
        print(user)
        
        if user.user_id == None:
            return jsonify({"message": "User not found"}), 404
        
        data = request.get_json()
        expenseId= uuid.uuid4().hex
        user_id= user.user_id
        expense_name= data.get("expense_name")
        expense_description= data.get("expense_description")
        amount= data.get("amount")
        date= data.get("date")
        category= data.get("category")
        is_personal_expense= data.get("is_personal_expense")
        is_group_expense= data.get("is_group_expense")
        group_id= data.get("group_id")
        split_type= data.get("split_type")
        participants= data.get("participants")
        attachments= data.get("attachments")
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
            status=status
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
            "updated_at": expense.updated_at
            })
        
        # Create a notifications service to send email notifications if any group people involved in the expense
        return jsonify({"message": "Expense created successfully"}), 201
    
    
    
            
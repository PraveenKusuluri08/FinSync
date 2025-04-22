import uuid
import os
import jwt
from ..config import dbConfig
from ..models import group_model
from ..utils import email,utils
from flask import jsonify, request
from bson.objectid import ObjectId
import datetime
class Group:
    
    client = dbConfig.DB_Config()
    
    def CreateGroup(self, user):
        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json()
        group_name = data.get("group_name")
        group_description = data.get("group_description")
        group_type = data.get("group_type")
        participants = data.get("participants", [])  # Default to an empty list
        created_by = user["email"]
        group_id = uuid.uuid4().hex

        # Check if a group with the same name already exists under the current user
        documents_count = self.client.groups.count_documents({
            "created_by": created_by,
            "group_name": group_name
        })
        if documents_count > 0:
            return jsonify({"message": "Group with the same name already exists"}), 409

        # Add the creator directly to the 'users' array
        users_list = [
            {
                "email": created_by,
                "joined_at": datetime.datetime.utcnow().isoformat(),
                "is_admin": True  # Optional flag to indicate group admin
            }
        ]

        participants_list = []

        for participant_email in participants:
            if participant_email == created_by:
                continue  # Don't send invitation to the creator

            token = utils.Utils.generate_invite_token(participant_email, group_id)
            print("token", token)
            invitation_token = token
            expiry_time = datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # 24-hour expiry

            # Create and append the participant object
            participant_obj = group_model.Participant(
                email=participant_email,
                invitation_link=invitation_token,
                link_expiry=expiry_time.isoformat(),
                is_invitation_accepted=False
            ).model_dump()

            participants_list.append(participant_obj)

            # Email content
            email_body = f"""
            <html>
            <body>
                <p>You have been invited to join the group '<b>{group_name}</b>' created by {created_by}.</p>
                <a href="http://cassini.cs.kent.edu:8004/accept-invite?token={invitation_token}" 
                style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">
                Accept Invitation
                </a>
                <p>This link will expire on {expiry_time.strftime('%Y-%m-%d %H:%M:%S')} UTC.</p>
            </body>
            </html>
            """
            email.send_email(participant_email, "You Have Been Invited!", email_body)

        # Final group data to insert
        group_data = {
            "group_id": group_id,
            "group_name": group_name,
            "group_participants_invited": participants_list,
            "users": users_list,
            "created_by": created_by,
            "group_type": group_type,
            "group_description": group_description
        }

        self.client.groups.insert_one(group_data)

        return jsonify({"message": "Group created successfully, invitations sent!"}), 201


    
    
    def Accept_Invitation(self):
        token = request.args.get("token")
        print("token", token)

        if not token:
            return jsonify({"message": "Invalid invitation link"}), 400

        try:
            decoded_token = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
            print("decoded_token", decoded_token)
            user_email = decoded_token["email"]
            group_id = decoded_token["group_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Invitation link has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        # Update the participants array: remove invitation_link & link_expiry, set is_invitation_accepted to True
        update_result = self.client.groups.update_one(
            {"group_id": group_id, "group_participants_invited.email": user_email},
            {
                "$set": {
                    "group_participants_invited.$.is_invitation_accepted": True
                },
                "$unset": {
                    "group_participants_invited.$.invitation_link": "",
                    "group_participants_invited.$.link_expiry": ""
                },
                "$push": {
                    "users": {"email": user_email} 
                }
            }
        )

        if update_result.matched_count == 0:
            return jsonify({"message": "Invitation not found or already accepted"}), 404

        email.send_email(user_email, "Invitation Accepted", f"Your invitation for group {group_id} has been accepted!")

        return jsonify({"message": "Invitation accepted successfully!"})
    
    # Get the all users for to show in the users list in the creation of group
    def get_users(self):
        try:
            users = self.client.users.find({})
            users = list(users)
            
            users = [{"firstname": user["firstname"], "email": user["email"]} for user in users]
            
            return jsonify({"users": users})
        
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500

        
    def GetUserInvolvedGroups(self,user):
        #  In this function I need to get all the groups which the user created and the involved
        if not user:
            return jsonify({"message": "User not found"}), 404
        try:
            filter = {"$or": [{"created_by": user["email"]},{"users": {"$elemMatch": {"email": user["email"]}}}]}
            groups = self.client.groups.find(filter)
            groups = list(groups)
            
            groups = [{"_id":str(group["_id"]),"group_id": str(group["group_id"]), "group_name": group["group_name"], "users": group["users"], "group_type": group["group_type"], "group_description": group["group_description"]} for group in groups]
            
            return jsonify({"groups": groups})
        
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    
    def GetGroupData(self,user,groupId):
        if not user:
            return jsonify({"message": "User not found"}), 404
        try:
            group = self.client.groups.find_one({"group_id": groupId})
            if group is None:
                return jsonify({"message": "Group not found"}), 404
            
            print("group", group)
            
            group = {"_id":str(group["_id"]),"group_id": str(group["group_id"]), "group_name": group["group_name"], "users": group["users"], "group_type": group["group_type"], "group_description": group["group_description"], "created_by": str(group["created_by"])}
            
            return jsonify({"group": group})
        
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    
    def AddUsersToGroup(self, user, groupId):
        if user.get("email") is None:
            return jsonify({"message": "User not found"}), 404

        try:
            data = request.get_json()
            users = data.get("users")

            if not users or not isinstance(users, list):
                return jsonify({"message": "Invalid users list"}), 400

            # Fetch group details
            group = self.client.groups.find_one({"group_id": groupId})
            if not group:
                return jsonify({"message": "Group not found"}), 404

            group_name = group.get("group_name")
            created_by = group.get("created_by")  # Get the creator's email

            participants_list = []
            for participant_email in users:
                token = utils.Utils.generate_invite_token(participant_email, groupId)
                expiry_time = datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # 24-hour expiry time

                # Create a participant object with necessary fields
                participant_obj = {
                    "email": participant_email,
                    "invitation_link": token,
                    "link_expiry": expiry_time.isoformat(),
                    "is_invitation_accepted": False
                }

                participants_list.append(participant_obj)

                # Send email invitations with secure token
                accept_link = f"http://cassini.cs.kent.edu:8004/accept-invite?token={token}"
                email_body = f"""
                <html>
                <body>
                    <p>You have been invited to join the group '<b>{group_name}</b>' created by {created_by}.</p>
                    <a href="{accept_link}" 
                    style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">
                    Accept Invitation
                    </a>
                    <p>This link will expire on {expiry_time.strftime('%Y-%m-%d %H:%M:%S')} UTC.</p>
                </body>
                </html>
                """
                email.send_email(participant_email, "You Have Been Invited!", email_body)

            # Add participants to `group_participants_invited`
            update_result = self.client.groups.update_one(
                {"group_id": groupId},
                {"$addToSet": {"group_participants_invited": {"$each": participants_list}}}
            )

            if update_result.matched_count == 0:
                return jsonify({"message": "Failed to add users to the group"}), 500

            return jsonify({"message": "Users added and invitations sent successfully"}), 200

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    
    def GetAllGroupsData(self,user):
        if not user:
            return jsonify({"message": "User not found"}), 404
        try:
            groups = self.client.groups.find({"created_by": user["email"]})
            groups = list(groups)
            
            groups = [{"_id":str(group["_id"]),"group_id": str(group["group_id"]), "group_name": group["group_name"], "users": group["users"], "group_type": group["group_type"], "group_description": group["group_description"]} for group in groups]
            
            return jsonify({"groups": groups})
        
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500

    
    def DeleteGroup(self,user,group_id):
        pass
    
    def GetGroupExpenseSummary(self, user):
        if not user:
            return jsonify({"message": "User not found"}), 404

        user_email = user["email"]
        net_balance = 0.0

        try:
            expenses_cursor = self.client.group_expenses.find({
                "$or": [
                    {"paid_by": user_email},
                    {"users.user": user_email}
                ]
            })

            for expense in expenses_cursor:
                paid_by = expense.get("paid_by")
                users = expense.get("users", [])

                if paid_by == user_email:
                    # I paid → others owe me → I gain, but only if not yet settled
                    for u in users:
                        if u.get("user") != user_email and not u.get("isSplitCleared", False):
                            net_balance += float(u.get("split_amount", 0))
                else:
                    # Someone else paid → I owe → I lose, only if not yet settled
                    for u in users:
                        if u.get("user") == user_email and not u.get("isSplitCleared", False):
                            net_balance -= float(u.get("split_amount", 0))

            return jsonify({"group_expense_total": round(net_balance, 2)}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
     
    
    def GetGroupExpenseSummaryFull(self, user):
        if not user:
            return jsonify({"message": "User not found"}), 404

        user_email = user["email"]
        net_balance = 0.0
        you_owe = 0.0
        you_are_owed = 0.0

        expenses_cursor = self.client.group_expenses.find({
            "$or": [{"paid_by": user_email}, {"users.user": user_email}]
        })

        for expense in expenses_cursor:
            paid_by = expense.get("paid_by")
            users = expense.get("users", [])

            if paid_by == user_email:
                for u in users:
                    if u.get("user") != user_email and not u.get("isSplitCleared", False):
                        share = float(u.get("split_amount", 0))
                        net_balance += share
                        you_are_owed += share
            else:
                for u in users:
                    if u.get("user") == user_email and not u.get("isSplitCleared", False):
                        share = float(u.get("split_amount", 0))
                        net_balance -= share
                        you_owe += share

        return jsonify({
            "group_expense_total": round(net_balance, 2),
            "you_owe": round(you_owe, 2),
            "you_are_owed": round(you_are_owed, 2)
        }), 200   
        
        
    def getRecentTransactions(self,user):
        email = user["email"]
        transactions = []

        personal_cursor = self.client.expenses.find({"user_id": email}).sort("date", -1).limit(5)
        for p in personal_cursor:
            transactions.append({
                "type": "Personal",
                "desc": p.get("merchant"),
                "amount": p.get("amount"),
                "date": p.get("date")
            })

        group_cursor = self.client.group_expenses.find({"users.user": email}).sort("date", -1).limit(5)
        for g in group_cursor:
            transactions.append({
                "type": "Group",
                "desc": g.get("expense_name"),
                "amount": g.get("amount"),
                "date": g.get("date")
            })

        transactions.sort(key=lambda x: x["date"], reverse=True)
        return jsonify(transactions[:5])
                

    def getCategoryBreakdown(self,user):
        email = user["email"]
        category_map = {}

        personal_cursor = self.client.expenses.find({"user_id": email})
        for doc in personal_cursor:
            cat = doc.get("category", "Other")
            amt = float(doc.get("amount", 0))
            category_map[cat] = category_map.get(cat, 0) + amt

        group_cursor = self.client.group_expenses.find({"users.user": email})
        for doc in group_cursor:
            cat = doc.get("category", "Other")
            for u in doc.get("users", []):
                if u["user"] == email:
                    amt = float(u.get("split_amount", 0))
                    category_map[cat] = category_map.get(cat, 0) + amt

        result = [{"name": k, "value": round(v, 2)} for k, v in category_map.items()]
        return jsonify(result)

    def getMonthlyTrend(self,user):
        from collections import defaultdict
        from datetime import datetime

        email = user["email"]
        monthly = defaultdict(float)

        cursor = self.client.expenses.find({"user_id": email})
        for doc in cursor:
            try:
                dt = datetime.strptime(doc.get("date"), "%m/%d/%Y")
                month = dt.strftime("%B")
                monthly[month] += float(doc.get("amount", 0))
            except:
                continue

        cursor = self.client.group_expenses.find({"users.user": email})
        for doc in cursor:
            try:
                dt = datetime.strptime(doc.get("date"), "%m/%d/%Y")
                month = dt.strftime("%B")
                for u in doc.get("users", []):
                    if u["user"] == email:
                        monthly[month] += float(u.get("split_amount", 0))
            except:
                continue

        trend = [{"month": m, "amount": round(a, 2)} for m, a in monthly.items()]
        trend.sort(key=lambda x: datetime.strptime(x["month"], "%B"))
        return jsonify(trend)

    def getTopGroupDues(self, user):
        email = user["email"]
        cursor = self.client.group_expenses.find({"users.user": email})

        group_dues = {}

        for doc in cursor:
            group_id = doc.get("group_id", "Others")

            # Fetch group name using group_id
            group_doc = self.client.groups.find_one({"group_id": group_id})
            group_name = group_doc["group_name"] if group_doc and "group_name" in group_doc else group_id

            for u in doc.get("users", []):
                if u["user"] == email and not u.get("isSplitCleared", False):
                    group_dues[group_name] = group_dues.get(group_name, 0) + float(u.get("split_amount", 0))

        top = sorted(
            [{"group": g, "you_owe": round(a, 2)} for g, a in group_dues.items()],
            key=lambda x: x["you_owe"],
            reverse=True
        )

        return jsonify(top[:5])  # Optional: return only top 5


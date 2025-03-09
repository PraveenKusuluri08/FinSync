import uuid
import os
import jwt
from ..config import dbConfig
from ..models import group_model
from ..utils import email,utils
from flask import jsonify, request
from bson.objectid import ObjectId
class Group:
    
    client = dbConfig.DB_Config()
    
    def CreateGroup(self, user):
        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json()
        group_name = data.get("group_name")
        group_description = data.get("group_description")
        group_type = data.get("group_type")
        participants = data.get("participants")
        created_by = user["email"]
        group_id = uuid.uuid4().hex

        # Check if a group with the same name already exists under the current user
        documents_count = self.client.groups.count_documents({"created_by": created_by, "group_name": group_name})
        if documents_count > 0:
            return jsonify({"message": "Group with the same name already exists"}), 409

        group = group_model.Group(
            group_id=group_id,
            group_name=group_name,
            group_participants_invited=participants,
            users=[],
            created_by=created_by,
            group_type=group_type,
            group_description=group_description
        )

        self.client.groups.insert_one(group.to_dict())

        if len(participants) > 0:
            # Send email invitations with secure token
            for participant_email in participants:
                token = utils.Utils.generate_invite_token(participant_email, group_id)
                accept_link = f"http://localhost:5173/accept-invite?token={token}"
                email_body = f"""
                <html>
                <body>
                    <p>You have been invited to join the group '<b>{group_name}</b>' created by {created_by}.</p>
                    <a href="{accept_link}" 
                    style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">
                    Accept Invitation
                    </a>
                </body>
                </html>
                """
                email.send_email(participant_email, "You Have Been Invited!", email_body)

        return jsonify({"message": "Group created successfully, invitations sent!"}), 201
    
    
    def Accept_Invitation(self):
        token = request.args.get("token")
        print("token",token)

        if not token:
            return jsonify({"message": "Invalid invitation link"}), 400

        try:
            decoded_token = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
            print("decoded_token",decoded_token)
            user_email = decoded_token["email"]
            
            group_id = decoded_token["group_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Invitation link has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        self.client.groups.update_one(
            {"_id": ObjectId(group_id)},
            {"$addToSet": {"users": user_email}}
        )

        email.send_email(user_email, "Invitation Accepted", f"Your invitation for {group_id} is accepted!")

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
            filter = {"$or":[{"created_by":user["email"]},{"users":{"$in":[user["email"]]}}]}
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
            group = self.client.groups.find_one({"_id": ObjectId(groupId)})
            if group is None:
                return jsonify({"message": "Group not found"}), 404
            
            group = {"_id":str(group["_id"]),"group_id": str(group["group_id"]), "group_name": group["group_name"], "users": group["users"], "group_type": group["group_type"], "group_description": group["group_description"]}
            
            return jsonify({"group": group})
        
        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    
    def AddUsersToGroup(self,user, groupId):
        if user.get("email") is None:
            return jsonify({"message": "User not found"}), 404
        try:
            data = request.get_json()
            users = data.get("users")

            if not users or not isinstance(users, list):
                return jsonify({"message": "Invalid users list"}), 400

            # Fetch group details
            group = self.client.groups.find_one({"_id": ObjectId(groupId)})
            if not group:
                return jsonify({"message": "Group not found"}), 404

            group_name = group.get("group_name")
            created_by = group.get("created_by")  # Get the creator's email

            # Update group_participants_invited while keeping existing data
            self.client.groups.update_one(
                {"group_id": groupId},
                {"$addToSet": {"group_participants_invited": {"$each": users}}}
            )

            # Send email invitations with secure token
            for participant_email in users:
                token = utils.Utils.generate_invite_token(participant_email, groupId)
                accept_link = f"http://localhost:5173/accept-invite?token={token}"
                email_body = f"""
                <html>
                <body>
                    <p>You have been invited to join the group '<b>{group_name}</b>' created by {created_by}.</p>
                    <a href="{accept_link}" 
                    style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">
                    Accept Invitation
                    </a>
                </body>
                </html>
                """
                email.send_email(participant_email, "You Have Been Invited!", email_body)

            return jsonify({"message": "Users added and invitations sent successfully"}), 200

        except Exception as e:
            print(e)
            return jsonify({"message": f"An error occurred: {e}"}), 500

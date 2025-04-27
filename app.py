import os
from app import app
from flask import jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
from app.config import dbConfig
from datetime import datetime

load_dotenv()

PORT = os.getenv('PORT') or 8080
isProduction = os.getenv("APPLICATION_MODE") == "PRODUCTION"

CORS(app, origns=["http://cassini.cs.kent.edu:8004","http://localhost:5173","http://finsync.kentcs.org:8004"])

socketio = SocketIO(app, cors_allowed_origins=["http://cassini.cs.kent.edu:8004","http://localhost:5173","http://finsync.kentcs.org:8004"])

client = dbConfig.DB_Config()
messages_collection = client["messages"]

@app.route("/get_messages/<room_id>/<expense_id>", methods=["GET"])
def get_messages(room_id,expense_id):
    """Fetch messages for a given chat room from MongoDB"""
    messages = list(messages_collection.find({"room": room_id,"expense_id":expense_id}, {"_id": 0}))
    return jsonify(messages)

@app.route("/send_message", methods=["POST"])
def send_message_api():
    """REST API for sending messages (only emits message, doesn't save)"""
    data = request.get_json()
    print(data)
    room = data.get("room")
    user = data.get("user")
    message = data.get("message")
    group_id = data.get("group_id")
    expense_id = data.get("expense_id")

    if not all([room, user, message, group_id, expense_id]):
        return jsonify({"error": "Missing fields"}), 400

    # Emit message only, do NOT save to MongoDB here
    socketio.emit("receive_message", {
        "room": room,
        "user": user,
        "message": message,
        "timestamp": datetime.now().strftime("%m/%d/%Y, %H:%M:%S"),
        "group_id": group_id,
        "expense_id": expense_id
    }, room=room)

    return jsonify({"message": "Message sent successfully"}), 200

def save_message_to_db(room, user, message, group_id, expense_id):
    """Save a message to MongoDB"""
    message_data = {
        "room": room,
        "user": user,
        "message": message,
        "timestamp": datetime.now().strftime("%m/%d/%Y, %H:%M:%S"),
        "group_id": group_id,
        "expense_id": expense_id
    }
    
    messages_collection.insert_one(message_data)
    return message_data

@socketio.on("join_room")
def handle_join_room(data):
    """Socket.IO event for users joining a chat room"""
    room = data.get("room")
    if room:
        join_room(room)
        previous_messages = list(messages_collection.find({"room": room}, {"_id": 0}))
        emit("load_messages", previous_messages, room=room)

@socketio.on("send_message")
def handle_send_message(data):
    """Socket.IO event to handle sending messages and saving them to MongoDB"""
    try:
        room = data.get("room")
        user = data.get("user")
        message = data.get("message")
        group_id = data.get("group_id")
        expense_id = data.get("expense_id")

        if not all([room, user, message, group_id, expense_id]):
            emit("error", {"message": "Missing required fields"}, room=room)
            return

        # Save message only in WebSocket function
        saved_message = save_message_to_db(room, user, message, group_id, expense_id)

        # Emit message to the room
        emit("receive_message", saved_message, room=room)

    except Exception as e:
        print(f"Error in handle_send_message: {e}")
        emit("error", {"message": str(e)}, room=room)

app.secret_key = "secret_key"

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=8001, debug=not isProduction)

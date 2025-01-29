from pymongo import MongoClient
import os

connection_uri = os.getenv("CONNECTION_URI")

def DB_Config():
    try:
        client = MongoClient(connection_uri)
        print("Connected to MongoDB")
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

    
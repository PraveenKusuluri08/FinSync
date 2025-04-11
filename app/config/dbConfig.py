from pymongo import MongoClient
import os

connection_uri = "mongodb+srv://somaharshith2000:somaharshith2000@finsyncapp.payrozu.mongodb.net/?retryWrites=true&w=majority&appName=finsyncapp"

def DB_Config():
    try:
        client = MongoClient(connection_uri,maxPoolSize=50)
        print("Connected to MongoDB")
        return client["FinSync"]
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

    
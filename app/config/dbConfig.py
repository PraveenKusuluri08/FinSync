from pymongo import MongoClient
import os

connection_uri = "mongodb+srv://ADMIN_ETMS:Capstone_2025@cluster1.uyl3sto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

def DB_Config():
    try:
        client = MongoClient(connection_uri, tls=True, tlsAllowInvalidCertificates=True)
        print("Connected to MongoDB")
        return client["FinSync"]
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

    
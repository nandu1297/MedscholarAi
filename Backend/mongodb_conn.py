import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))

db = client["MedScholarAI"]

chat_collection = db["chat_history"]

print("MongoDB connected successfully")
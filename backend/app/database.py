import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dogbreed_db")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]

# Collections
pets_collection = db["pets"]
history_collection = db["search_history"]
feedback_collection = db["feedback"]
breed_searches_collection = db["breed_searches"]  # <-- ADDED breed searches collection

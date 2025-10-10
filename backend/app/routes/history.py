from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid

from ..auth import get_current_user
from ..database import history_collection

router = APIRouter(prefix="/api/history", tags=["history"])

# Add Pydantic model for request validation
class HistoryCreate(BaseModel):
    breed: str
    confidence: str
    image_url: str

@router.post("")
async def save_history(
    history_data: HistoryCreate,  # ← Changed from individual Form fields to Pydantic model
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    history_id = str(uuid.uuid4())
    history_doc = {
        "_id": history_id,
        "user_id": user_id,
        "breed": history_data.breed,
        "confidence": history_data.confidence,
        "image_url": history_data.image_url,
        "searched_on": datetime.now().isoformat().split('T')[0]
    }
    await history_collection.insert_one(history_doc)
    return {
        "id": history_id,
        "breed": history_data.breed,
        "confidence": history_data.confidence,
        "image": history_data.image_url,
        "searchedOn": history_doc["searched_on"]
    }

@router.get("")
async def get_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    cursor = history_collection.find({"user_id": user_id}).sort("searched_on", -1)
    history = await cursor.to_list(length=100)
    return [
        {
            "id": item["_id"],
            "breed": item["breed"],
            "confidence": item["confidence"],
            "image": item["image_url"],
            "searchedOn": item["searched_on"]
        }
        for item in history
    ]

@router.delete("/{history_id}")
async def delete_history(
    history_id: str,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    result = await history_collection.delete_one({"_id": history_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="History item not found")
    return {"message": "History item deleted successfully"}


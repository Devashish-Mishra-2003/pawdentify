from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid

from ..auth import get_current_user
from ..database import feedback_collection

router = APIRouter(prefix="/api", tags=["feedback"])

# Pydantic models
class FeedbackCreate(BaseModel):
    prediction: str
    vote: str  # "upvote" or "downvote"
    message: str = ""  # optional

class FeedbackResponse(BaseModel):
    id: str
    user_id: str
    prediction: str
    vote: str
    message: str
    timestamp: str

@router.post("/feedback")
async def submit_feedback(
    feedback_data: FeedbackCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    feedback_id = str(uuid.uuid4())
    feedback_doc = {
        "_id": feedback_id,
        "user_id": user_id,
        "prediction": feedback_data.prediction,
        "vote": feedback_data.vote,
        "message": feedback_data.message,
        "timestamp": datetime.now().isoformat()
    }
    await feedback_collection.insert_one(feedback_doc)
    return {
        "id": feedback_id,
        "message": "Feedback submitted successfully"
    }

@router.get("/admin/feedbacks")
async def get_all_feedbacks(current_user: dict = Depends(get_current_user)):
    # Check if user is admin
    payload = current_user["payload"]
    public_metadata = payload.get("public_metadata", {})
    role = public_metadata.get("role") or payload.get("role")
    
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    cursor = feedback_collection.find().sort("timestamp", -1)
    feedbacks = await cursor.to_list(length=1000)
    return [
        {
            "id": item["_id"],
            "user_id": item["user_id"],
            "predicted_breed": item["prediction"],
            "vote_type": item["vote"],
            "feedback_message": item["message"],
            "timestamp": item["timestamp"]
        }
        for item in feedbacks
    ]


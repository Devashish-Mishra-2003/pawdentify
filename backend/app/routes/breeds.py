from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime

from ..auth import get_current_user
from ..database import breed_searches_collection

router = APIRouter(prefix="/api", tags=["breeds"])

# Pydantic models
class BreedSearchTrack(BaseModel):
    breed_id: str
    breed_name: str

@router.post("/breeds/track")
async def track_breed_search(
    data: BreedSearchTrack,
    current_user: dict = Depends(get_current_user)
):
    """
    Track when a user searches for a specific breed.
    Increments the search count for that breed.
    """
    try:
        # Increment count for this breed, create if doesn't exist
        await breed_searches_collection.update_one(
            {"breed_id": data.breed_id},
            {
                "$inc": {"count": 1},
                "$set": {
                    "breed_name": data.breed_name,
                    "last_searched": datetime.now().isoformat()
                }
            },
            upsert=True
        )
        return {"message": "Search tracked successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to track search: {str(e)}")

@router.get("/breeds/top")
async def get_top_searched_breeds():
    """
    Get top 10 most searched breeds.
    Returns list sorted by search count (descending).
    """
    try:
        cursor = breed_searches_collection.find().sort("count", -1).limit(10)
        top_breeds = await cursor.to_list(length=10)
        
        # Format response
        result = [
            {
                "breed_id": item["breed_id"],
                "breed_name": item["breed_name"],
                "count": item["count"],
                "last_searched": item.get("last_searched")
            }
            for item in top_breeds
        ]
        
        return {
            "top_searched": result,
            "count": len(result)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch top breeds: {str(e)}")

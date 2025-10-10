from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..auth import get_current_user
from ..database import db

router = APIRouter(prefix="/api/settings", tags=["settings"])

# Pydantic model for settings (removed anonymousMode)
class UserSettings(BaseModel):
    imageQuality: str = "high"
    saveHistory: bool = True
    language: str = "en"

@router.get("")
async def get_settings(current_user: dict = Depends(get_current_user)):
    """Get user settings"""
    user_id = current_user["user_id"]
    
    # Try to find existing settings
    settings = await db["user_settings"].find_one({"user_id": user_id})
    
    if settings:
        # Remove MongoDB _id from response
        settings.pop("_id", None)
        settings.pop("user_id", None)
        # Remove old anonymousMode field if it exists
        settings.pop("anonymousMode", None)
        return settings
    
    # Return default settings if none exist
    return {
        "imageQuality": "high",
        "saveHistory": True,
        "language": "en"
    }

@router.post("")
async def save_settings(
    settings: UserSettings,
    current_user: dict = Depends(get_current_user)
):
    """Save or update user settings"""
    user_id = current_user["user_id"]
    
    settings_doc = {
        "user_id": user_id,
        **settings.dict()
    }
    
    # Upsert: update if exists, insert if not
    await db["user_settings"].update_one(
        {"user_id": user_id},
        {"$set": settings_doc},
        upsert=True
    )
    
    return {
        "message": "Settings saved successfully",
        "settings": settings.dict()
    }

@router.delete("")
async def reset_settings(current_user: dict = Depends(get_current_user)):
    """Reset user settings to defaults"""
    user_id = current_user["user_id"]
    
    default_settings = {
        "user_id": user_id,
        "imageQuality": "high",
        "saveHistory": True,
        "language": "en"
    }
    
    await db["user_settings"].update_one(
        {"user_id": user_id},
        {"$set": default_settings},
        upsert=True
    )
    
    return {
        "message": "Settings reset to defaults",
        "settings": {k: v for k, v in default_settings.items() if k != "user_id"}
    }

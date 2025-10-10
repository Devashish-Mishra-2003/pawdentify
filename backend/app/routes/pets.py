from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from datetime import datetime
import uuid

from ..auth import get_current_user
from ..database import pets_collection
from ..cloudinary_config import upload_image, delete_image

router = APIRouter(prefix="/api/pets", tags=["pets"])

@router.post("")
async def add_pet(
    name: str = Form(...),
    breed: str = Form(...),
    birthday: str = Form(None),
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    image_bytes = await image.read()
    # Upload image to Cloudinary
    upload_result = await upload_image(image_bytes, folder="pets")
    pet_id = str(uuid.uuid4())
    added_date = datetime.now().isoformat().split('T')[0]
    
    pet_doc = {
        "_id": pet_id,
        "user_id": user_id,
        "name": name,
        "breed": breed,
        "birthday": birthday,
        "image_url": upload_result["url"],
        "image_public_id": upload_result["public_id"],
        "added_on": added_date,
        "notes": []
    }
    await pets_collection.insert_one(pet_doc)
    
    return {
        "id": pet_id,
        "name": name,
        "breed": breed,
        "birthday": birthday,
        "image": upload_result["url"],
        "addedOn": added_date,  # Return in camelCase
        "notes": []
    }

@router.get("")
async def get_pets(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    cursor = pets_collection.find({"user_id": user_id})
    pets = await cursor.to_list(length=100)
    
    # Transform to frontend format
    result = []
    for pet in pets:
        result.append({
            "id": pet["_id"],
            "name": pet["name"],
            "breed": pet["breed"],
            "birthday": pet.get("birthday"),
            "image": pet["image_url"],
            "addedOn": pet.get("added_on"),  # Convert snake_case to camelCase
            "notes": pet.get("notes", [])
        })
    
    return result

@router.delete("/{pet_id}")
async def delete_pet(pet_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    pet = await pets_collection.find_one({"_id": pet_id, "user_id": user_id})
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    await delete_image(pet["image_public_id"])
    await pets_collection.delete_one({"_id": pet_id})
    return {"message": "Pet deleted successfully"}

@router.post("/{pet_id}/notes")
async def add_note(
    pet_id: str,
    text: str = Form(...),
    category: str = Form("other"),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]

    pet = await pets_collection.find_one({"_id": pet_id, "user_id": user_id})
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    note_id = str(uuid.uuid4())
    note_doc = {
        "id": note_id,
        "text": text,
        "category": category,
        "date": datetime.utcnow().isoformat()
    }

    await pets_collection.update_one(
        {"_id": pet_id},
        {"$push": {"notes": note_doc}}
    )

    return note_doc

@router.delete("/{pet_id}/notes/{note_id}")
async def delete_note(
    pet_id: str,
    note_id: str,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]

    pet = await pets_collection.find_one({"_id": pet_id, "user_id": user_id})
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    await pets_collection.update_one(
        {"_id": pet_id},
        {"$pull": {"notes": {"id": note_id}}}
    )

    return {"message": "Note deleted successfully"}




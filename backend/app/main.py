# backend/app/main.py
import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import Optional

from .preprocessing import preprocess_image_bytes, load_model_from_path, predict_top

# --- Import routers ---
from .routes import pets, history, settings, places, feedback, breeds  # <-- ADDED breeds

# Load environment (expect backend/.env or backend/.env.example)
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR.parent.joinpath(".env"))

MODEL_PATH = os.getenv("MODEL_PATH", str(BASE_DIR.joinpath("model/efficientnetv2b2_320.keras")))
CONF_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.4))

BREED_INFO_PATH = BASE_DIR.joinpath("breed_info_final.json")

app = FastAPI(title="Dog Breed Classifier API")

# Allow CORS from dev frontend (adjust origin as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # add your frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register routers ---
app.include_router(pets.router)
app.include_router(history.router)
app.include_router(settings.router)
app.include_router(places.router)
app.include_router(feedback.router)
app.include_router(breeds.router)  # <-- ADDED breeds router

# Load breed info
if not BREED_INFO_PATH.exists():
    raise RuntimeError(f"breed_info.json not found at {BREED_INFO_PATH}")
with open(BREED_INFO_PATH, "r", encoding="utf-8") as f:
    BREED_JSON = json.load(f)

# Build helper maps
ID_TO_NAME = {}
ID_TO_PRETTY = {}

def prettify(raw_name: str) -> str:
    # Replace underscores/hyphens and capitalize words properly
    parts = raw_name.replace("-", " ").replace("_", " ").split()
    parts = [p.capitalize() for p in parts]
    return " ".join(parts)

for item in BREED_JSON.get("breeds", []):
    idx = int(item["id"])
    name = item["name"]
    ID_TO_NAME[idx] = name
    ID_TO_PRETTY[idx] = prettify(name)

# Load model
MODEL = None
try:
    MODEL = load_model_from_path(MODEL_PATH)
except Exception as e:
    # keep MODEL as None; /predict will return 501 if model missing
    print("Model load failed:", e)
    MODEL = None

@app.get("/breeds")
def get_breeds():
    """
    Return list of breeds with id, canonical name, pretty_name.
    """
    out = []
    for item in BREED_JSON.get("breeds", []):
        idx = int(item["id"])
        out.append({
            "id": idx,
            "name": item["name"],
            "pretty_name": ID_TO_PRETTY.get(idx, item["name"])
        })
    return {"breeds": out}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accept an image file. If top prediction confidence >= CONF_THRESHOLD,
    return id, pretty name, confidence, and low_confidence flag.
    """
    if MODEL is None:
        raise HTTPException(status_code=501, detail="Model not loaded on server.")

    contents = await file.read()
    try:
        img_arr = preprocess_image_bytes(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    try:
        top_idx, top_prob = predict_top(MODEL, img_arr)   # <-- top_idx is already 0-based
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    # --- MODIFIED: Always return confidence score ---
    if top_prob >= CONF_THRESHOLD:
        pretty = ID_TO_PRETTY.get(top_idx, ID_TO_NAME.get(top_idx, "Unknown"))
        return JSONResponse({
            "low_confidence": False,
            "prediction": pretty,
            "prediction_id": int(top_idx),   # <-- added id
            "confidence": round(float(top_prob), 4)
        })
    else:
        return JSONResponse({
            "low_confidence": True,
            "prediction_id": int(top_idx),  # still return id for debugging
            "prediction": ID_TO_PRETTY.get(top_idx, "Unknown"),
            "confidence": round(float(top_prob), 4)
        })


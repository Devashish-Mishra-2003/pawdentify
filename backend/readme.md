# Paws — Backend **

Small backend for serving your EfficientNetV2-B2 dog-breed model (part of the PawCare website project).

**What this does**
- Loads your Keras model and exposes two endpoints:
  - `GET /breeds` → returns id, canonical name, `pretty_name`.
  - `POST /predict` → accepts a file and returns either `{ "low_confidence": false, "prediction": "<Pretty Name>" }` when top confidence ≥ `CONFIDENCE_THRESHOLD`, or `{ "low_confidence": true }` otherwise.
- Uses `backend/app/preprocessing.py` (320×320, EfficientNetV2 preprocessing).

**Quick notes**
- Put your model at the path specified by `MODEL_PATH` in `backend/.env` (default: `./app/model/efficientnetv2b2_320.keras`).
- `breed_info.json` (in `backend/app/`) must match the model's label ordering.
- CORS is set for local dev (adjust `allow_origins` in `app.main` if needed).

**Run (very short)**
```bash
# from backend/
conda env create -f requirements.yml   # or update
conda activate dogbreed_backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

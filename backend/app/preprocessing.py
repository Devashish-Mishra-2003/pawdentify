# backend/app/preprocessing.py
from io import BytesIO
from pathlib import Path
from PIL import Image
import numpy as np
import tensorflow as tf

from tensorflow.keras.applications.efficientnet_v2 import preprocess_input

IMG_SIZE = (320, 320)

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Resize image and return float32 array shape (1, H, W, 3) suitable for EfficientNetV2 preprocessing.
    """
    if not isinstance(image, Image.Image):
        raise TypeError("Expected PIL.Image.Image")
    image = image.resize(IMG_SIZE, Image.BILINEAR)
    arr = np.asarray(image).astype("float32")  # 0..255
    if arr.ndim == 2:
        arr = np.stack((arr,) * 3, axis=-1)
    arr = np.expand_dims(arr, axis=0)  # (1, H, W, 3)
    arr = preprocess_input(arr)
    return arr

def preprocess_image_bytes(file_bytes: bytes) -> np.ndarray:
    """Convenience: accept raw bytes (from upload) and return model-ready array."""
    img = Image.open(BytesIO(file_bytes)).convert("RGB")
    return preprocess_image(img)

def _is_probabilities(arr: np.ndarray, tol: float = 1e-3) -> bool:
    """Return True if arr looks like probabilities: all in [0,1] and sums ~1."""
    if np.any(arr < -tol):  # allow tiny negative float noise
        return False
    # All elements should be <= 1 + tol (tiny floating noise allowed)
    if np.any(arr > 1.0 + tol):
        return False
    s = float(arr.sum())
    return abs(s - 1.0) <= tol

def predict_top(model, img_array: np.ndarray):
    """
    Run model.predict and return (top_index:int, top_prob:float).
    top_prob is in 0..1.
    Robustly handles models that already output probabilities.
    """
    raw = model.predict(img_array, verbose=0)
    preds = np.asarray(raw).squeeze()  # shape -> (N,) or scalar

    # If scalar output (binary/single-value), convert to 1-element array
    if preds.ndim == 0:
        preds = np.array([float(preds)])

    # If preds already look like probabilities, use them directly.
    # Otherwise compute a numerically stable softmax.
    if _is_probabilities(preds):
        probs = preds.astype(float)
    else:
        # numerically stable softmax
        maxv = np.max(preds)
        exp = np.exp(preds - maxv)
        probs = exp / np.sum(exp)

    top_idx = int(np.argmax(probs))
    top_prob = float(probs[top_idx])
    return top_idx, top_prob

def load_model_from_path(model_path: str):
    """
    Load a Keras model from a .keras or .h5 file.
    """
    p = Path(model_path)
    if not p.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    try:
        model = tf.keras.models.load_model(str(p))
        return model
    except Exception as e:
        raise RuntimeError(f"Error loading model from {model_path}: {e}")

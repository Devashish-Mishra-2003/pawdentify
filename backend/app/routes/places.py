from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
import httpx
import os

from ..auth import get_current_user

router = APIRouter(prefix="/api/places", tags=["places"])

# Primary and fallback credentials
MAPPLS_ACCOUNTS = [
    {
        "client_id": os.getenv("MAPPLS_CLIENT_ID"),
        "client_secret": os.getenv("MAPPLS_CLIENT_SECRET"),
        "name": "Primary"
    },
    {
        "client_id": os.getenv("MAPPLS_CLIENT_ID_2"),
        "client_secret": os.getenv("MAPPLS_CLIENT_SECRET_2"),
        "name": "Fallback 1"
    },
    {
        "client_id": os.getenv("MAPPLS_CLIENT_ID_3"),
        "client_secret": os.getenv("MAPPLS_CLIENT_SECRET_3"),
        "name": "Fallback 2"
    }
]

# Cache for access tokens
_token_cache = {}

async def get_access_token(account_index=0):
    """Get OAuth2 access token with fallback support"""
    import time
    
    for i in range(account_index, len(MAPPLS_ACCOUNTS)):
        account = MAPPLS_ACCOUNTS[i]
        
        if not account["client_id"] or not account["client_secret"]:
            print(f"[Auth] Skipping {account['name']} - credentials not set")
            continue
        
        cache_key = f"token_{i}"
        
        # Check cache
        if cache_key in _token_cache and _token_cache[cache_key]["expires_at"] > time.time():
            print(f"[Auth] ✅ Using cached token from {account['name']}")
            return _token_cache[cache_key]["token"], i
        
        try:
            print(f"[Auth] Requesting new token from {account['name']}...")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://outpost.mappls.com/api/security/oauth/token",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": account["client_id"],
                        "client_secret": account["client_secret"]
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                print(f"[Auth] {account['name']} token response: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    token = data.get("access_token")
                    expires_in = data.get("expires_in", 3600)
                    
                    _token_cache[cache_key] = {
                        "token": token,
                        "expires_at": time.time() + expires_in - 60
                    }
                    
                    print(f"[Auth] ✅ Got token from {account['name']}")
                    return token, i
                else:
                    print(f"[Auth] ❌ {account['name']} failed: {response.text[:200]}")
                    continue
                    
        except Exception as e:
            print(f"[Auth] ❌ {account['name']} exception: {str(e)}")
            continue
    
    print(f"[Auth] ❌ All accounts failed")
    return None, -1

# Category keywords
PLACE_CATEGORIES = {
    "vet": "veterinary clinic",
    "pet_store": "pet shop",
    "food_store": "pet food",
    "shelter": "pet adoption",
    "ngo": "animal welfare"
}

MAX_RADIUS = 10000

@router.get("/nearby")
async def get_nearby_places(
    category: str = Query(..., description="Category: vet, pet_store, food_store, shelter, ngo"),
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    current_user: dict = Depends(get_current_user)
):
    """Get nearby places within 10km"""
    
    if category not in PLACE_CATEGORIES:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    keyword = PLACE_CATEGORIES[category]
    
    print(f"\n{'='*60}")
    print(f"[Places] Category: {category} ({keyword})")
    print(f"[Places] Location: {lat}, {lon}")
    print(f"{'='*60}\n")
    
    # Get token with fallback support
    access_token, account_index = await get_access_token()
    
    if not access_token:
        print(f"[Places] ❌ No valid access token")
        return {
            "places": [],
            "total": 0,
            "error": "authentication_failed",
            "message": "Unable to authenticate. All API accounts failed."
        }
    
    print(f"[Places] Using {MAPPLS_ACCOUNTS[account_index]['name']} account")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = "https://atlas.mappls.com/api/places/nearby/json"
            
            params = {
                "keywords": keyword,
                "refLocation": f"{lat},{lon}",
                "radius": MAX_RADIUS,
                "page": 1
            }
            
            headers = {
                "Authorization": f"Bearer {access_token}"
            }
            
            print(f"[Places] Calling Nearby API...")
            print(f"[Places] URL: {url}")
            print(f"[Places] Params: {params}")
            
            response = await client.get(url, params=params, headers=headers)
            
            print(f"[Places] Response Status: {response.status_code}")
            print(f"[Places] Response Headers: {dict(response.headers)}")
            
            # Log response body for errors
            if response.status_code != 200:
                print(f"[Places] Response Body: {response.text[:500]}")
            
            # Handle rate limiting (429) or unauthorized (401)
            if response.status_code == 429:
                print(f"[Places] ❌ Rate limited (429) - daily limit exceeded")
                
                # Try fallback account
                print(f"[Places] Trying fallback account...")
                access_token, account_index = await get_access_token(account_index + 1)
                
                if not access_token:
                    return {
                        "places": [],
                        "total": 0,
                        "error": "rate_limited",
                        "message": "Daily API limit reached on all accounts. Please try again tomorrow or add more fallback accounts."
                    }
                
                # Retry with fallback
                headers["Authorization"] = f"Bearer {access_token}"
                print(f"[Places] Retrying with {MAPPLS_ACCOUNTS[account_index]['name']}...")
                response = await client.get(url, params=params, headers=headers)
                print(f"[Places] Retry Status: {response.status_code}")
            
            if response.status_code == 401:
                print(f"[Places] ❌ Unauthorized (401)")
                return {
                    "places": [],
                    "total": 0,
                    "error": "authentication_failed",
                    "message": "Authentication failed. Please check API credentials."
                }
            
            if response.status_code == 204:
                print(f"[Places] No results (204)")
                return {
                    "places": [],
                    "total": 0,
                    "error": "no_results",
                    "message": f"No {keyword}s found within 10km."
                }
            
            if response.status_code != 200:
                print(f"[Places] ❌ API Error: {response.status_code}")
                return {
                    "places": [],
                    "total": 0,
                    "error": "api_error",
                    "message": f"Service error ({response.status_code}). Please try again."
                }
            
            # Success
            data = response.json()
            results = data.get("suggestedLocations", [])
            
            print(f"[Places] ✅ Found {len(results)} results")
            
            places = []
            
            for idx, item in enumerate(results[:10]):
                distance = int(item.get("distance", 0))
                
                place_data = {
                    "id": item.get("eLoc", f"{category}_{idx}"),
                    "name": item.get("placeName", "Unknown"),
                    "address": item.get("placeAddress", "No address"),
                    "latitude": float(item.get("latitude", lat)),
                    "longitude": float(item.get("longitude", lon)),
                    "distance": distance,
                    "eloc": item.get("eLoc", ""),
                    "type": item.get("type", category)
                }
                
                places.append(place_data)
                print(f"  {idx+1}. {place_data['name']} - {distance}m")
            
            print(f"\n[Places] ✅ Returned {len(places)} places")
            print(f"{'='*60}\n")
            
            return {
                "places": places,
                "total": len(places),
                "category": category
            }
            
    except Exception as e:
        print(f"[Places] ❌ Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "places": [],
            "total": 0,
            "error": "server_error",
            "message": "Something went wrong. Please try again."
        }













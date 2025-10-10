import os
import jwt
import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from functools import lru_cache

# Your Clerk instance domain from the publishable key
CLERK_DOMAIN = "pretty-dragon-25.clerk.accounts.dev"
CLERK_JWKS_URL = f"https://{CLERK_DOMAIN}/.well-known/jwks.json"
CLERK_ISSUER = f"https://{CLERK_DOMAIN}"

security = HTTPBearer()

@lru_cache(maxsize=1)
def get_jwks():
    """Fetch and cache JWKS keys from Clerk"""
    try:
        response = requests.get(CLERK_JWKS_URL, timeout=10)
        response.raise_for_status()
        jwks = response.json()
        if "keys" not in jwks:
            raise HTTPException(
                status_code=500, 
                detail=f"JWKS endpoint did not return 'keys'. Response: {jwks}"
            )
        return jwks
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch JWKS: {str(e)}"
        )

def verify_token(token: str) -> dict:
    """Verify Clerk JWT token"""
    try:
        # Get unverified header to find the key ID
        unverified_header = jwt.get_unverified_header(token)
        jwks = get_jwks()
        
        # Find the matching key
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
        
        if not rsa_key:
            raise HTTPException(
                status_code=401, 
                detail="Unable to find appropriate key"
            )
        
        # Decode and verify the token with RS256
        payload = jwt.decode(
            token,
            jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key),
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={
                "verify_aud": False,  # Clerk doesn't always include 'aud'
                "verify_iss": True,   # Verify issuer
                "verify_exp": True,   # Verify expiration
            }
        )
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, 
            detail="Token has expired"
        )
    except jwt.InvalidIssuerError:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token issuer. Expected: {CLERK_ISSUER}"
        )
    except jwt.exceptions.InvalidTokenError as e:
        raise HTTPException(
            status_code=401, 
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401, 
            detail=f"Unable to parse authentication token: {str(e)}"
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """Extract and verify user from Clerk token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=401, 
            detail="Invalid token: no user ID"
        )
    
    return {
        "user_id": user_id,
        "payload": payload
    }


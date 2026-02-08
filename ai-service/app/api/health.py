from fastapi import APIRouter
import os

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "ai-service ok",
        "service": "letter-to-stars-ai",
        "version": os.getenv("APP_VERSION", "dev")
    }

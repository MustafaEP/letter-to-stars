from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "ai-service ok",
        "service": "letter-to-stars-ai",
        "version": "1.0.0"
    }

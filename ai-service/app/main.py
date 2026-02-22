from fastapi import FastAPI, HTTPException
from app.models import RewriteRequest, RewriteResponse, RewriteResponseUpgrade
from app.services.gemini_service import GeminiService
import logging
import os

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="Yıldızlara Mektup - AI Service",
    description="IELTS text rewriting service",
    version="1.0.0"
)

# Service instance (singleton)
gemini_service = GeminiService()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ai-service ok",
        "service": "letter-to-stars-ai",
        "version": os.getenv("APP_VERSION", "dev")
    }

@app.post("/rewrite", response_model=RewriteResponse)
async def rewrite_text(request: RewriteRequest):
    """
    Kullanıcının metnini IELTS seviyesine göre yeniden yazar
    """
    try:
        # AI servisini çağır
        result = gemini_service.rewrite_text(
            user_text=request.user_text,
            ielts_level=request.ielts_level
        )
        
        # Response model'e dönüştür
        return RewriteResponse(
            original_text=request.user_text,
            rewritten_text=result["rewritten_text"],
            new_words=result["new_words"],
            ielts_level=request.ielts_level
        )
        
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/rewrite-upgrade", response_model=RewriteResponseUpgrade)
async def rewrite_text_upgrade(request: RewriteRequest):
    """
    Kullanıcının metnini IELTS seviyesine göre yeniden yazar. 
    Kullanıcının metnindeki grammar hatalarını düzeltilir.
    Kullanıcının metnindeki yeni kelimeler eklenir.
    Kullanıcının metnindeki yazma ipuçları önerilir.
    Kullanıcının metnindeki güçlü yönleri ve zayıf yönleri analiz edilir.
    Kullanıcının metnindeki genel değerlendirme önerilir.
    """
    try:
        # AI servisini çağır
        result = gemini_service.rewrite_text_upgrade(
            user_text=request.user_text,
            ielts_level=request.ielts_level
        )
        
        # Response model'e dönüştür
        return RewriteResponseUpgrade(
            original_text=request.user_text,
            rewritten_text=result["rewritten_text"],
            new_words=result["new_words"],
            writing_tips=result["writing_tips"],
            strengths=result["strengths"],
            weaknesses=result["weaknesses"],
            overall_feedback=result["overall_feedback"],
            ielts_level=request.ielts_level
        )
        
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")




from fastapi import FastAPI
from app.schemas.rewrite import RewriteRequest, RewriteResponse
from app.services.rewrite_service import rewrite_text

app = FastAPI(title="Letter to Stars AI")

@app.post("/rewrite", response_model=RewriteResponse)
def rewrite(req: RewriteRequest):
    return rewrite_text(req.text, req.level)
    
@app.get("/health")
def health():
    return {
        "status": "ai-service ok",
        "service": "letter-to-stars-ai"
    }

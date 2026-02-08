from fastapi import FastAPI
from app.schemas.rewrite import RewriteRequest, RewriteResponse
from app.services.rewrite_service import rewrite_text
from app.api.health import router as health_router

app = FastAPI(title="Letter to Stars AI")

app.include_router(health_router)

@app.post("/rewrite", response_model=RewriteResponse)
def rewrite(req: RewriteRequest):
    return rewrite_text(req.text, req.level)

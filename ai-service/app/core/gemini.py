import google.generativeai as genai
from app.core.config import settings

_model = None

def get_model():
    """
    Lazy-init Gemini model so the service can start without GEMINI_API_KEY.
    """
    global _model
    if _model is not None:
        return _model

    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is missing")

    genai.configure(api_key=settings.GEMINI_API_KEY)
    _model = genai.GenerativeModel("gemini-2.5-flash")
    return _model

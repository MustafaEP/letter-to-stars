from pydantic import BaseModel
from typing import List

class RewriteRequest(BaseModel):
    text: str
    level: str #IELTS level (6, 7, 8, 9)

class VocabularyItem(BaseModel):
    word: str
    meaning_tr: str

class RewriteResponse(BaseModel):
    rewritten_text: str
    new_vocabulary: List[VocabularyItem]
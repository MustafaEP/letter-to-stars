from pydantic import BaseModel, Field, field_validator # FastAPI' de gelen/giden JSON verisini doğrulamak ve model tanımlamak için
from typing import List # Model içinde liste (dizi) tiplerini belirtmek için

class RewriteRequest(BaseModel):
    """Kullanıcının yazdığı metni IELTS seviyesine dönüştürme isteği"""

    user_text: str = Field(
        ..., # Required (zorunlu)
        min_length=10,
        max_length=10000,
        description="Kullanıcının İngilizce günlük metni",
        example="Today I went to the park and saw many birds."
    )

    ielts_level: int = Field(
        ..., 
        ge=6, # Greater or equal (>=)
        le=9, # Less or equal (<=)
        description="HedefIELTS seviyesi (6, 7, 8, 9)",
        example=7
    )

    @field_validator("ielts_level")
    def validate_ielts_level(cls, v):
        if v not in [6, 7, 8, 9]:
            raise ValueError("IELTS seviyesi 6, 7, 8 veya 9 olmalıdır.")
        return v

class Word(BaseModel):
    """AI tarafından eklenen yeni kelime"""
    
    english_word: str = Field(
        ...,
        min_length=1,
        description="İngilizce kelime",
        example="contemplate"
    )

    turkish_meaning: str = Field(
        ...,
        min_length=1,
        description="Türkçe anlamı",
        example="derin düşünmek"
    )

class GrammarCorrection(BaseModel):
    """AI tarafından düzeltilen grammar hatası"""
    
    original: str = Field(
        ...,
        description="Orijinal hata",
        example="to park"
    )
    corrected: str = Field(
        ...,
        description="Düzeltilmiş hata",
        example="to the park"
    )
    explanation: str = Field(
        ...,
        description="Hata açıklaması",
        example="Missing definite article 'the'"
    )

class RewriteResponse(BaseModel):
    """AI dönüşüm sonucu"""

    original_text: str = Field(
        ...,
        description="Kullanıcının orijinal metni",
        example="Today I went to park"
    )

    rewritten_text: str = Field(
        ...,
        description="IELTS seviyesine dönüştürülmüş metin",
        example="This morning, I visited the local park to contemplate nature."
    )

    new_words: List[Word] = Field(
        default=[],
        description="AI' ın eklediği yeni kelimeler"
    )

    ielts_level: int = Field(
        ...,
        description="Uygulandığı IELTS seviyesi",
        example=7
    )

class RewriteResponseUpgrade(BaseModel):
    """AI dönüşüm sonucu"""

    original_text: str = Field(
        ...,
        description="Kullanıcının orijinal metni",
        example="Today I went to park"
    )

    grammar_corrections: List[GrammarCorrection] = Field(
        default=[],
        description="AI' ın düzelttiği grammar hataları",
        example=[
            {
                "original": "to park",
                "corrected": "to the park",
                "explanation": "Missing definite article 'the'"
            }
        ]
    )

    rewritten_text: str = Field(
        ...,
        description="IELTS seviyesine dönüştürülmüş metin",
        example="This morning, I visited the local park to contemplate nature."
    )

    new_words: List[Word] = Field(
        default=[],
        description="AI' ın eklediği yeni kelimeler",
        example=[
            {
                "english_word": "contemplate",
                "turkish_meaning": "derin düşünmek"
            }
        ]
    )

    writing_tips: List[str] = Field(
        default=[],
        description="AI' ın önerdiği yazma ipuçları",
        example=[
            "Use articles (a, an, the) correctly before singular countable nouns.",
            "Try combining short sentences into complex structures.",
            "Incorporate descriptive adjectives to enrich your writing."
        ]
    )

    strengths: List[str] = Field(
        default=[],
        description="AI' ın orijinal metne göre güçlü yönleri",
        example=[
            "The meaning is clear.",
            "The sentence structure is understandable."
        ]
    )

    weaknesses: List[str] = Field(
        default=[],
        description="AI' ın orijinal metne göre zayıf yönleri",
        example=[
            "Limited vocabulary range.",
            "Missing article usage."
        ]
    )

    overall_feedback: str = Field(
        ...,
        description="AI' ın orijinal metne göre genel değerlendirme",
        example="The text is clear but basic. Vocabulary and grammatical accuracy need improvement to reach Band 8."
    )

    ielts_level: int = Field(
        ...,
        description="Uygulandığı IELTS seviyesi",
        example=7
    )
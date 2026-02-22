import json
import re
import logging
import google.generativeai as genai
from typing import Dict, Any
from app.config import get_settings
from app.prompts.ielts_prompts import get_rewrite_prompt, get_rewrite_prompt_upgrade
 
# Logger konfigürasyonu
logger = logging.getLogger(__name__)

class GeminiService:
    """
    Gemini API ile iletişim kuran servis
    
    Sorumlulukları:
    - API konfigürasyonu
    - Prompt gönderme
    - Response parsing
    - Error handling
    """
    
    def __init__(self):
        settings = get_settings()
        
        # Gemini'yi konfigüre et
        genai.configure(api_key=settings.gemini_api_key)
        
        # Model instance'ı oluştur
        self.model = genai.GenerativeModel(
            settings.gemini_model,
            generation_config={
                "temperature": 0.7,  # Yaratıcılık seviyesi
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
            }
        )
        
        logger.info(f"GeminiService initialized with model: {settings.gemini_model}")
        
    # JSON response'unu temizle
    def _clean_json_response(self, text: str) -> str:
        """
        AI response'undan JSON'u temizler
        
        AI bazen şöyle döner:
        ```json
            {"key": "value"}
        ```
        
        Biz sadece {...} istiyoruz
        """
        # Markdown code block'ları temizle
        text = re.sub(r'```json\s*', '', text)
        text = re.sub(r'```\s*', '', text)
        
        # Başındaki/sonundaki boşlukları temizle
        text = text.strip()
        
        return text
    
    
    def _validate_response(self, data: Dict[str, Any]) -> bool:
        """
        AI response'unun doğru formatta olduğunu kontrol eder
        
        Beklenen format:
        {
            "rewritten_text": str,
            "new_words": [{"english_word": str, "turkish_meaning": str}]
        }
        """
        if not isinstance(data, dict):
            return False
        
        # Gerekli alanları kontrol et
        if "rewritten_text" not in data or "new_words" not in data:
            logger.error(f"Missing required fields. Got: {data.keys()}")
            return False
        
        # rewritten_text string mi?
        if not isinstance(data["rewritten_text"], str):
            logger.error("rewritten_text is not a string")
            return False
        
        # new_words liste mi?
        if not isinstance(data["new_words"], list):
            logger.error("new_words is not a list")
            return False
        
        # Her kelime doğru formatta mı?
        for word in data["new_words"]:
            if not isinstance(word, dict):
                return False
            if "english_word" not in word or "turkish_meaning" not in word:
                return False
        
        return True
    
    def _validate_response_upgrade(self, data: Dict[str, Any]) -> bool:
        """
        AI response'unun doğru formatta olduğunu kontrol eder
        
        Beklenen format:
        {
            "rewritten_text": str,
            "grammar_corrections": [{"original": str, "corrected": str, "explanation": str}],
            "new_words": [{"english_word": str, "turkish_meaning": str}]
            "writing_tips": [str],
            "strengths": [str],
            "weaknesses": [str],
            "overall_feedback": str
        }
        """
        if not isinstance(data, dict):
            return False
        
        # Gerekli alanları kontrol et
        if "rewritten_text" not in data or "new_words" not in data:
            logger.error(f"Missing required fields. Got: {data.keys()}")
            return False
        
        # rewritten_text string mi?
        if not isinstance(data["rewritten_text"], str):
            logger.error("rewritten_text is not a string")
            return False
        

        # grammar_corrections liste mi?
        if not isinstance(data["grammar_corrections"], list):
            logger.error("grammar_corrections is not a list")
            return False
        
        # Her grammar correction doğru formatta mı?
        for correction in data["grammar_corrections"]:
            if not isinstance(correction, dict):
                return False
            if "original" not in correction or "corrected" not in correction or "explanation" not in correction:
                return False
        
        # writing_tips liste mi?
        if not isinstance(data["writing_tips"], list):
            logger.error("writing_tips is not a list")
            return False
        
        # Her writing tip string mi?
        for tip in data["writing_tips"]:
            if not isinstance(tip, str):
                return False
        
        # strengths liste mi?
        if not isinstance(data["strengths"], list):
            logger.error("strengths is not a list")
            return False
        
        # Her strength string mi?
        for strength in data["strengths"]:
            if not isinstance(strength, str):
                return False
        
        # weaknesses liste mi?
        if not isinstance(data["weaknesses"], list):
            logger.error("weaknesses is not a list")
            return False
        
        # Her weakness string mi?
        for weakness in data["weaknesses"]:
            if not isinstance(weakness, str):
                return False
        
        # overall_feedback string mi?
        if not isinstance(data["overall_feedback"], str):
            logger.error("overall_feedback is not a string")
            return False
        
        # new_words liste mi?
        if not isinstance(data["new_words"], list):
            logger.error("new_words is not a list")
            return False
        
        # Her kelime doğru formatta mı?
        for word in data["new_words"]:
            if not isinstance(word, dict):
                return False
            if "english_word" not in word or "turkish_meaning" not in word:
                return False
        
        return True
    
    def rewrite_text(self, user_text: str, ielts_level: int) -> Dict[str, Any]:
        """
        Metni IELTS seviyesine göre yeniden yazar
        
        Args:
            user_text: Kullanıcının orijinal metni
            ielts_level: Hedef IELTS seviyesi (6-9)
            
        Returns:
            {
                "rewritten_text": str,
                "new_words": [{"english_word": str, "turkish_meaning": str}]
            }
            
        Raises:
            ValueError: JSON parse hatası veya validation hatası
            Exception: Gemini API hatası
        """
        
        try:
            logger.info(f"Rewriting text to IELTS level {ielts_level}")
            logger.debug(f"Original text length: {len(user_text)} chars")
            
            # 1. Prompt'u oluştur
            prompt = get_rewrite_prompt(user_text, ielts_level)
            
            # 2. Gemini'ye gönder
            logger.info("Sending request to Gemini API...")
            response = self.model.generate_content(prompt)
            
            # 3. Response kontrolü
            if not response or not response.text:
                logger.error("Empty response from Gemini")
                raise ValueError("Gemini API boş yanıt döndü")
            
            logger.debug(f"Raw response: {response.text[:200]}...")  # İlk 200 char
            
            # 4. JSON temizle
            cleaned_text = self._clean_json_response(response.text)
            
            # 5. JSON parse et
            try:
                result = json.loads(cleaned_text)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error: {e}")
                logger.error(f"Problematic text: {cleaned_text[:500]}")
                raise ValueError(f"AI yanıtı JSON formatında değil: {str(e)}")
            
            # 6. Validate et
            if not self._validate_response(result):
                logger.error(f"Invalid response structure: {result}")
                raise ValueError("AI yanıtı beklenen formatta değil")
            
            logger.info(f"Successfully rewrote text. New words count: {len(result['new_words'])}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error in rewrite_text: {str(e)}", exc_info=True)
            raise   
    
    def rewrite_text_upgrade(self, user_text: str, ielts_level: int) -> Dict[str, Any]:
        """
        Metni IELTS seviyesine göre yeniden yazar
        
        Args:
            user_text: Kullanıcının orijinal metni
            ielts_level: Hedef IELTS seviyesi (6-9)
            
        Returns:
            {
                "rewritten_text": str,
                "grammar_corrections": [{"original": str, "corrected": str, "explanation": str}],
                "new_words": [{"english_word": str, "turkish_meaning": str}],
                "writing_tips": [str],
                "strengths": [str],
                "weaknesses": [str],
                "overall_feedback": str
            }
            
        Raises:
            ValueError: JSON parse hatası veya validation hatası
            Exception: Gemini API hatası
        """
        
        try:
            logger.info(f"Rewriting text to IELTS level {ielts_level}")
            logger.debug(f"Original text length: {len(user_text)} chars")
            
            # 1. Prompt'u oluştur
            prompt = get_rewrite_prompt_upgrade(user_text, ielts_level)
            
            # 2. Gemini'ye gönder
            logger.info("Sending request to Gemini API...")
            response = self.model.generate_content(prompt)
            
            # 3. Response kontrolü
            if not response or not response.text:
                logger.error("Empty response from Gemini")
                raise ValueError("Gemini API boş yanıt döndü")
            
            logger.debug(f"Raw response: {response.text[:200]}...")  # İlk 200 char
            
            # 4. JSON temizle
            cleaned_text = self._clean_json_response(response.text)
            
            # 5. JSON parse et
            try:
                result = json.loads(cleaned_text)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error: {e}")
                logger.error(f"Problematic text: {cleaned_text[:500]}")
                raise ValueError(f"AI yanıtı JSON formatında değil: {str(e)}")
            
            # 6. Validate et
            if not self._validate_response_upgrade(result):
                logger.error(f"Invalid response structure: {result}")
                raise ValueError("AI yanıtı beklenen formatta değil")
            
            logger.info(f"Successfully rewrote text. New words count: {len(result['new_words'])}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error in rewrite_text: {str(e)}", exc_info=True)
            raise
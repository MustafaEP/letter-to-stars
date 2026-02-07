import json
import re
from app.core.gemini import model
from app.schemas.rewrite import RewriteResponse, VocabularyItem

PROMPT_TEMPLATE = """
You are an IELTS writing assistant.

TASKS:
1. Rewrite the diary text to {level} level English.
2. Identify vocabulary words that DO NOT appear in the original text.
3. For each word, provide its Turkish meaning.

IMPORTANT:
- Respond ONLY with valid JSON.
- Do NOT include explanations or markdown.
- JSON format MUST be exactly:

{{
    "rewritten_text": "string",
    "new_vocabulary": [
        {{"word": "string", "meaning_tr": "string"}}
    ]
}}

Diary:
{text}
"""

def _normalize_words(text: str) -> set[str]:
    return set(re.findall(r"[a-zA-Z]+", text.lower()))

def rewrite_text(text: str, level: str) -> RewriteResponse:
    prompt = PROMPT_TEMPLATE.format(text=text, level=level)

    result = model.generate_content(prompt)
    raw = result.text.strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        # fallback (model sometimes wraps with ```json)
        cleaned = raw.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned)

    original_words = _normalize_words(text)

    filtered_vocab = []
    for item in data.get("new_vocabulary", []):
        word = item.get("word", "").lower()
        if word and word not in original_words:
            filtered_vocab.append(
                VocabularyItem(
                    word=item["word"],
                    meaning_tr=item["meaning_tr"]
                )
            )

    return RewriteResponse(
        rewritten_text=data["rewritten_text"],
        new_vocabulary=filtered_vocab
    )

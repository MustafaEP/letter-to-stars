from app.core.gemini import model
from app.schemas.rewrite import RewriteResponse, VocabularyItem

PROMPT_TEMPLATE = """
You are an IELTS writing assistant.

Rewrite the following diary text to {level} level English.
Then list vocabulary words that were NOT used in the original text.
For each word, give its Turkish meaning.

Return JSON with:
- rewritten_text
- new_vocabulary [{{"word": "...", "meaning_tr": "..."}}]

Diary:
{text}
"""


def rewrite_text(text: str, level: str) -> RewriteResponse:
    prompt = PROMPT_TEMPLATE.format(text=text, level=level)

    result = model.generate_content(prompt)
    raw = result.text

    # Simple parse (later we will use structured output)
    return RewriteResponse(
        rewritten_text=raw,
        new_vocabulary=[]
    )

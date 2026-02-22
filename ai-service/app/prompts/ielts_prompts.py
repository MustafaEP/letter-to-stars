def get_rewrite_prompt(user_text: str, ielts_level: int) -> str:
    """
    IELTS seviyesine göre metni yeniden yazan prompt oluşturur
    
    Prompt Engineering Stratejisi:
    - Role-based prompting (IELTS expert persona)
    - Few-shot learning (örnek JSON)
    - Explicit constraints (IELTS level specifications)
    - Structured output (guaranteed JSON format)
    """
    
    # IELTS seviye tanımları
    level_descriptions = {
        6: """
        - Simple and compound sentences
        - Common everyday vocabulary
        - Basic connectors (and, but, because)
        - Some grammatical errors acceptable
        - Clear but simple expression
        """,
        7: """
        - Mix of simple and complex sentences
        - Good range of vocabulary with some less common words
        - Various linking words (however, moreover, consequently)
        - Occasional errors that don't impede understanding
        - Clear and coherent expression
        """,
        8: """
        - Wide range of complex structures
        - Sophisticated vocabulary and collocations
        - Flexible use of advanced connectors
        - Rare minor errors
        - Natural and fluent expression
        """,
        9: """
        - Full range of structures with flexibility
        - Precise and natural vocabulary (idiomatic expressions)
        - Seamless coherence and cohesion
        - No noticeable errors
        - Native-like fluency
        """
    }
    
    prompt = f"""You are an IELTS Writing Assessment Expert with 15+ years of experience.

        **TASK**: Rewrite the user's text to match IELTS Band {ielts_level} standards.

        **IELTS BAND {ielts_level} CRITERIA**:
        {level_descriptions[ielts_level]}

        **IMPORTANT RULES**:
        1. Preserve the original meaning and context
        2. Identify words/phrases YOU ADDED that weren't in the original text
        3. Only list vocabulary that is NEW or more advanced than the original
        4. Provide Turkish meanings for Turkish speakers
        5. Return ONLY valid JSON, no markdown, no explanations

        **OUTPUT FORMAT** (strict JSON):
        {{
        "rewritten_text": "The rewritten text at IELTS {ielts_level} level",
        "new_words": [
            {{
            "english_word": "sophisticated",
            "turkish_meaning": "sofistike, gelişmiş"
            }}
        ]
        }}

        **EXAMPLE INPUT**: "I went to park yesterday. It was nice."

        **EXAMPLE OUTPUT FOR IELTS 8**:
        {{
        "rewritten_text": "Yesterday, I visited the local park, where I found the atmosphere remarkably serene and rejuvenating.",
        "new_words": [
            {{
            "english_word": "remarkably",
            "turkish_meaning": "oldukça, dikkat çekici şekilde"
            }},
            {{
            "english_word": "serene",
            "turkish_meaning": "huzurlu, sakin"
            }},
            {{
            "english_word": "rejuvenating",
            "turkish_meaning": "canlandırıcı, yenileyici"
            }}
        ]
        }}

        **USER TEXT TO REWRITE**:
        {user_text}

        **TARGET LEVEL**: IELTS {ielts_level}

        Return ONLY the JSON object, nothing else."""

    return prompt

def get_rewrite_prompt_upgrade(user_text: str, ielts_level: int) -> str:
    """
    Advanced IELTS rewriting & feedback prompt.
    - Role-based prompting
    - Band-specific linguistic constraints
    - Error detection
    - Vocabulary control
    - Structured deterministic JSON output
    """

    level_descriptions = {
        6: """
        - Mostly simple and compound sentences
        - Common everyday vocabulary
        - Basic connectors (and, but, because)
        - Some grammatical errors acceptable
        - Clear but simple expression
        """,
        7: """
        - Mix of simple and complex sentences
        - Good range of vocabulary with some less common words
        - Various linking words (however, moreover, consequently)
        - Occasional errors that do not reduce clarity
        - Clear and coherent expression
        """,
        8: """
        - Wide range of complex sentence structures
        - Sophisticated vocabulary and natural collocations
        - Flexible use of advanced connectors
        - Rare minor errors
        - Natural and fluent expression
        """,
        9: """
        - Full range of structures used flexibly
        - Precise, idiomatic, and natural vocabulary
        - Seamless coherence and cohesion
        - No noticeable grammatical errors
        - Native-like fluency
        """
    }

    prompt = f"""
        You are a senior IELTS Writing Examiner with 15+ years of official assessment experience.

        Your task is to ANALYZE, CORRECT, and TRANSFORM the given text according to IELTS Band {ielts_level} standards.

        ========================
        IELTS BAND {ielts_level} CRITERIA
        ========================
        {level_descriptions[ielts_level]}

        ========================
        STRICT RULES
        ========================
        1. Preserve the original meaning and intent.
        2. Do NOT invent new ideas or change the topic.
        3. Grammar corrections must reference EXACT substrings from the original text.
        4. If there are no grammar mistakes, return an empty list for "grammar_corrections".
        5. "new_words" must include ONLY vocabulary that:
            - does NOT appear in the original text
            - is more advanced than the original wording
        6. Provide Turkish meanings for each new word.
        7. Writing tips MUST directly reference specific grammar or expression mistakes from the original text.
        8. Each tip must explain:
            - What was wrong
            - Why it was wrong
            - How to improve it
        9. Output MUST be valid JSON.
        10. No markdown. No explanations outside JSON.
        11. Do NOT include trailing commas.
        12. Ensure JSON is parsable.
        13. writing_tips, strengths, weaknesses and overall_feedback MUST be written in Turkish-English mixed explanation style.
        14. Keep explanation clarity at IELTS Band 6 English maximum.
        15. Assume the reader is a Turkish IELTS learner.
        16. Writing tips must explicitly mention mistakes found in the original sentence.
        17. Avoid academic or examiner-style formal language in these sections.
        18. Do NOT use academic evaluation language such as:
            "demonstrates lexical resource", 
            "task achievement",
            "coherence and cohesion",
            "lexical sophistication",
            "grammatical range and accuracy".
            Use simple explanatory language instead.
        ========================
        TASKS
        ========================
        1. Identify and fix grammar mistakes.
        2. Rewrite the text at IELTS Band {ielts_level}.
        3. Extract advanced vocabulary used in the rewrite.
        4. Provide 3–5 personalized writing improvement tips.
        5. Analyze strengths and weaknesses.
        6. Provide a short overall evaluation (1–2 sentences).
        7. Writing tips MUST directly reference specific grammar or expression mistakes from the original text.
        8. Each tip must explain:
        - What was wrong
        - Why it was wrong
        - How to improve it

        ========================
        RESPONSE FORMAT (STRICT JSON)
        ========================
        {{
        "grammar_corrections": [
            {{
            "original": "exact phrase from original text",
            "corrected": "grammatically correct version",
            "explanation": "brief explanation of the mistake"
            }}
        ],
        "rewritten_text": "IELTS {ielts_level} level rewritten version here",
        "new_words": [
            {{
            "english_word": "advanced_word",
            "turkish_meaning": "turkce_anlam"
            }}
        ],
        "writing_tips": [
            "You wrote 'go to park'. Burada article eksik. Doğrusu 'go to the park' olmalı. Singular countable nouns önünde genelde 'the' gerekir.",
            "Cümleler çok kısa ve simple. Try to combine them using 'because', 'although', 'while' gibi bağlaçlar.",
            "Bazı kelimeler çok basic (nice, good). Instead of 'nice', use 'pleasant' veya 'enjoyable'."
        ],
        "strengths": [
            "Meaning clear, ne demek istediğin anlaşılıyor.",
            "Cümle yapısı simple ama anlaşılır."
        ],
        "weaknesses": [
            "Article kullanımı eksik (örneğin: 'to park').",
            "Vocabulary range limited, daha advanced kelimeler kullanılabilir."
        ],
        "overall_feedback": "Genel olarak meaning clear ancak grammar ve vocabulary gelişmeli. Şu an yaklaşık Band 6 seviyesinde."
        }}

        ========================
        EXAMPLE INPUT
        ========================
        "I went to park yesterday. It was nice."

        ========================
        EXAMPLE OUTPUT (IELTS 8)
        ========================
        {{
        "grammar_corrections": [
            {{
            "original": "to park",
            "corrected": "to the park",
            "explanation": "Missing definite article 'the'"
            }}
        ],
        "rewritten_text": "Yesterday, I visited the local park, where I found the atmosphere remarkably serene and rejuvenating.",
        "new_words": [
            {{
            "english_word": "remarkably",
            "turkish_meaning": "oldukça, dikkat çekici şekilde"
            }},
            {{
            "english_word": "serene",
            "turkish_meaning": "huzurlu"
            }},
            {{
            "english_word": "rejuvenating",
            "turkish_meaning": "yenileyici"
            }}
        ],
        "writing_tips": [
            "Use articles (a, an, the) correctly before singular countable nouns.",
            "Try combining short sentences into complex structures.",
            "Incorporate descriptive adjectives to enrich your writing."
        ],
        "strengths": [
            "The meaning is clear.",
            "The sentence structure is understandable."
        ],
        "weaknesses": [
            "Limited vocabulary range.",
            "Missing article usage."
        ],
        "overall_feedback": "The text is clear but basic. Vocabulary and grammatical accuracy need improvement to reach Band 8."
        }}

        ========================
        USER TEXT
        ========================
        {user_text}

        Return ONLY the JSON object.
        """

    return prompt
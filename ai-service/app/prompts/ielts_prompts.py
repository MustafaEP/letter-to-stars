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
import os
from google import genai  # Gemini SDK

SYSTEM_PROMPT = """
You are a friendly fashion assistant inside a web app that works like Tinder for clothes and outfits.
The user swipes right to LIKE items and left to PASS on them. Each item has attributes such as category,
brand, colour, material, style, and price. The goal is to help the user discover outfits they would enjoy
wearing in real life.

When you answer:
- Be concise and concrete (1–3 short paragraphs or a few bullet points).
- Give style reasoning: why this item might suit them, how to wear it, what to pair it with.
- If they ask for recommendations, focus on patterns in what they tend to like (e.g. colours, fits, price range).
- Never mention internal implementation details or APIs; just talk about clothes, outfits, and style.
"""

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

def chat_with_gemini(message: str, history: list[dict]) -> str:
    """Builds the prompt and returns Gemini's reply text."""
    contents = []

    # System / instruction message
    contents.append({
        "role": "user",
        "parts": [{"text": SYSTEM_PROMPT.strip()}],
    })

    # Previous turns
    for turn in history or []:
        contents.append({
            "role": "user" if turn.get("role") == "user" else "model",
            "parts": [{"text": turn.get("content", "")}],
        })

    # Latest user message
    contents.append({
        "role": "user",
        "parts": [{"text": message}],
    })

    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=contents,
    )

    return resp.text or ""

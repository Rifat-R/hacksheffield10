import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai  # Gemini SDK

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

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

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True) or {}
    message = data.get("message", "")
    history = data.get("history", [])

    if not message:
        return jsonify({"error": "No message"}), 400

    contents = []

    # 1) System / instruction message
    contents.append({
        "role": "user",
        "parts": [{"text": SYSTEM_PROMPT.strip()}],
    })

    # 2) Previous turns from the UI
    for turn in history:
        contents.append({
            "role": "user" if turn.get("role") == "user" else "model",
            "parts": [{"text": turn.get("content", "")}],
        })

    # 3) Latest user message
    contents.append({
        "role": "user",
        "parts": [{"text": message}],
    })

    resp = client.models.generate_content(
        model="gemini-2.0-flash",  # or gemini-2.0-flash-exp if quota allows
        contents=contents,
    )

    return jsonify({"reply": resp.text or ""})

if __name__ == "__main__":
    app.run(debug=True)

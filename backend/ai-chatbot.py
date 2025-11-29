import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai  # Gemini SDK

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)  # uses Gemini API key [web:98][web:101]

@app.post("/api/chat")
def chat():
    data = request.get_json(force=True)
    message = data.get("message", "")
    history = data.get("history", [])  # [{role, content}, ...]

    if not message:
        return jsonify({"error": "No message"}), 400

    # Build contents array from history + new message [web:100][web:109]
    contents = []
    for turn in history:
        contents.append({
            "role": "user" if turn.get("role") == "user" else "model",
            "parts": [{"text": turn.get("content", "")}],
        })
    contents.append({
        "role": "user",
        "parts": [{"text": message}],
    })

    resp = client.models.generate_content(
        model="gemini-2.0-flash-exp",  # or any chat-capable Gemini model [web:98][web:101]
        contents=contents,
    )

    text = resp.text or ""
    return jsonify({"reply": text})

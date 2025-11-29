import os 
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.gemini_client import chat_with_gemini  # new import

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True) or {}
    message = data.get("message", "")
    history = data.get("history", [])

    if not message:
        return jsonify({"error": "No message"}), 400

    reply = chat_with_gemini(message, history)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)

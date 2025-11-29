from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/api/hello")
def hello():
    """Return a friendly greeting for the frontend demo."""
    return jsonify({"message": "Hello from Flask!"})


if __name__ == "__main__":
    # Enable debug for local development convenience.
    app.run(host="0.0.0.0", port=5000, debug=True)

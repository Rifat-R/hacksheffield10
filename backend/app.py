from flask import Flask, jsonify
from dotenv import load_dotenv
from db_service import get_all, get_by_id, create_record, update_record, delete_record
load_dotenv()

app = Flask(__name__)

if __name__ == "__main__":
    # Enable debug for local development convenience.
    app.run(host="0.0.0.0", port=5000, debug=True)

from flask import Flask, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
load_dotenv()


app = Flask(__name__)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)




if __name__ == "__main__":
    # Enable debug for local development convenience.
    app.run(host="0.0.0.0", port=5000, debug=True)

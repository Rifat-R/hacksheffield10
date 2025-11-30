from flask import Blueprint, jsonify, request
import numpy as np
from supabase_client import supabase
from helpers.algorithm import get_next_best_product


swiped_bp = Blueprint("swipes", __name__)


ALPHA = 0.1  # learning rate; higher = adapt faster
USER_ID = 1


def get_product_embedding(product_id: int) -> np.ndarray:
    res = (
        supabase.table("products")
        .select("embedding")
        .eq("id", product_id)
        .single()
        .execute()
    )
    data = res.data
    if not data or data.get("embedding") is None:
        raise ValueError("Product embedding not found")
    raw = data["embedding"]
    if isinstance(raw, str):
        try:
            import json
            raw = json.loads(raw)
        except Exception:
            raise ValueError("Product embedding is stored as a string that could not be parsed.")
    # Supabase returns arrays as Python lists
    return np.array(raw, dtype=float)


def get_user_profile(user_id: int):
    res = (
        supabase.table("users")
        .select("embedding, liked_count")
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    data = res.data
    if not data:
        return None
    embedding = np.array(data["embedding"], dtype=float)
    liked_count = data["liked_count"]
    return embedding, liked_count


def upsert_user_profile(user_id: int, embedding: np.ndarray, liked_count: int):
    payload = {
        "user_id": user_id,
        "embedding": embedding.tolist(),  # Supabase expects list
        "liked_count": liked_count,
    }
    supabase.table("users").upsert(payload, on_conflict="user_id").execute()


def update_user_embedding(user_id: int, product_id: int, liked: bool):
    e = get_product_embedding(product_id)

    existing = get_user_profile(user_id)

    direction = 1.0 if liked else -1.0

    if existing is None:
        # First time we see this user: start their vector from this swipe
        u_new = direction * e
        liked_count = 1 if liked else 0
    else:
        u, liked_count = existing
        # Simple exponential moving average
        u_new = (1 - ALPHA) * u + ALPHA * direction * e
        if liked:
            liked_count += 1

    upsert_user_profile(user_id, u_new, liked_count)


@swiped_bp.route("/register-swipe", methods=["POST"])
def swipe():
    data = request.get_json(force=True) or {}
    user_id = USER_ID
    product_id = int(data["product_id"])
    liked = bool(data["liked"])

    supabase.table("user_products").upsert(
        {
            "user_id": user_id,
            "product_id": product_id,
            "liked": liked,
        },
        on_conflict="user_id,product_id",
    ).execute()

    try:
        update_user_embedding(user_id, product_id, liked)
    except Exception as e:
        # log / handle, but don't crash the request
        print("Error updating embedding:", e)

    return jsonify({"status": "ok"})


@swiped_bp.get("/next-product")
def next_product():
    product = get_next_best_product(USER_ID)
    if product is None:
        return jsonify({"product": None, "message": "No more products available"}), 200

    return jsonify({"product": product})

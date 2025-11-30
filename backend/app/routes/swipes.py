from flask import Blueprint, jsonify, request
import numpy as np
from supabase_client import supabase


swiped_bp = Blueprint("swipes", __name__, url_prefix="/")


ALPHA = 0.1  # learning rate; higher = adapt faster


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
    # Supabase returns arrays as Python lists
    return np.array(data["embedding"], dtype=float)


def get_user_profile(user_id: int):
    res = (
        supabase.table("user_profiles")
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
    supabase.table("user_profiles").upsert(payload, on_conflict="user_id").execute()


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


@swiped_bp.get("api/register-swipe")
def swipe():
    data = request.get_json()
    user_id = int(data["user_id"])
    product_id = int(data["product_id"])
    liked = bool(data["liked"])

    supabase.table("swipes").upsert(
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

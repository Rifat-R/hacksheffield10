from flask import Blueprint, jsonify, request
import numpy as np
from postgrest.exceptions import APIError
from supabase_client import supabase
from helpers.algorithm import get_next_best_product


swiped_bp = Blueprint("swipes", __name__)


ALPHA = 0.1  # learning rate; higher = adapt faster
USER_ID = 1


def get_product_embedding(product_id: int) -> np.ndarray | None:
    try:
        res = (
            supabase.table("products")
            .select("embedding")
            .eq("id", product_id)
            .single()
            .execute()
        )
        data = res.data
    except APIError as exc:
        # PostgREST returns 204 when no row matches; treat as missing embedding
        if getattr(exc, "code", None) == "204" or "Missing response" in str(exc):
            print(
                f"[swipes] No product row for id={product_id} when fetching embedding"
            )
            return None
        raise

    if not data or data.get("embedding") is None:
        print(f"[swipes] Product {product_id} has no embedding column/data.")
        return None
    raw = data["embedding"]
    if isinstance(raw, str):
        try:
            import json

            raw = json.loads(raw)
        except Exception:
            raise ValueError(
                "Product embedding is stored as a string that could not be parsed."
            )
    # Supabase returns arrays as Python lists
    return np.array(raw, dtype=float)


def get_user_profile(user_id: int):
    try:
        res = (
            supabase.table("users")
            .select("embedding, total_likes, total_dislikes")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )
        data = res.data
    except APIError as exc:
        if getattr(exc, "code", None) == "204" or "Missing response" in str(exc):
            print(
                f"[swipes] No user row for user_id={user_id}; treating as cold start."
            )
            return None
        raise

    if not data:
        return None
    raw = data.get("embedding")
    if isinstance(raw, str):
        try:
            import json

            raw = json.loads(raw)
        except Exception:
            print(
                f"[swipes] User {user_id} embedding stored as string could not be parsed"
            )
            return None
    embedding = np.array(raw, dtype=float)
    total_likes = data.get("total_likes") or 0
    total_dislikes = data.get("total_dislikes") or 0
    return embedding, total_likes, total_dislikes


def upsert_user_profile(
    user_id: int, embedding: np.ndarray, total_likes: int, total_dislikes: int
):
    payload = {
        "id": user_id,
        "embedding": embedding.tolist(),  # Supabase expects list
        "total_likes": total_likes,
        "total_dislikes": total_dislikes,
    }
    supabase.table("users").upsert(payload, on_conflict="id").execute()


def update_user_embedding(user_id: int, product_id: int, liked: bool):
    print(
        f"[swipes] Updating embedding for user {user_id}, product {product_id}, liked={liked}"
    )
    e = get_product_embedding(product_id)
    if e is None:
        print(
            f"[swipes] Skipping embedding update; product {product_id} missing embedding/row."
        )
        return

    existing = get_user_profile(user_id)

    direction = 1.0 if liked else -1.0

    if existing is None:
        # First time we see this user: start their vector from this swipe
        u_new = direction * e
        total_likes = 1 if liked else 0
        total_dislikes = 0 if liked else 1
    else:
        u, total_likes, total_dislikes = existing
        # Simple exponential moving average
        u_new = (1 - ALPHA) * u + ALPHA * direction * e
        if liked:
            total_likes += 1
        else:
            total_dislikes += 1

    upsert_user_profile(user_id, u_new, total_likes, total_dislikes)


@swiped_bp.route("/register-swipe", methods=["POST"])
def swipe():
    data = request.get_json(force=True) or {}
    user_id = USER_ID
    product_id = int(data["product_id"])
    liked = bool(data["liked"])
    print(
        f"[swipes] Incoming swipe payload user={user_id} product={product_id} liked={liked}"
    )

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
        print(f"[swipes] Error updating embedding for product {product_id}: {e!r}")

    return jsonify({"status": "ok"})


@swiped_bp.get("/next-product")
def next_product():
    product = get_next_best_product(USER_ID)
    if product is None:
        return jsonify({"product": None, "message": "No more products available"}), 200

    return jsonify({"product": product})

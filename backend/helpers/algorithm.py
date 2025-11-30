import numpy as np
from supabase_client import supabase
from postgrest.exceptions import APIError

EMBED_DIM = 768  # set this to match your actual embedding dimension


def parse_embedding(raw) -> np.ndarray | None:
    """Parse embedding that may be stored as list or JSON string."""
    if raw is None:
        return None
    if isinstance(raw, str):
        try:
            import json

            raw = json.loads(raw)
        except Exception:
            return None
    try:
        return np.array(raw, dtype=float)
    except Exception:
        return None


def get_user_profile_embedding(user_id: int) -> np.ndarray | None:
    """Return the user's embedding as a NumPy array, or None if no profile yet."""
    try:
        res = (
            supabase.table("users")
            .select("embedding")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )
        data = res.data
    except APIError as exc:
        # PostgREST may raise 204 "Missing response" when no rows exist; treat as no profile.
        if getattr(exc, "code", None) == "204" or "Missing response" in str(exc):
            return None
        raise

    if not data or data.get("embedding") is None:
        return None
    return parse_embedding(data.get("embedding"))


def get_seen_product_ids(user_id: int) -> set[int]:
    """Return a set of product_ids the user has already swiped on."""
    try:
        res = (
            supabase.table("user_products")
            .select("product_id")
            .eq("user_id", user_id)
            .execute()
        )
        data = res.data or []
    except APIError as exc:
        if getattr(exc, "code", None) == "204" or "Missing response" in str(exc):
            data = []
        else:
            raise
    return {row["product_id"] for row in data}


def get_candidate_products(exclude_ids: list[int], limit: int = 500) -> list[dict]:
    """
    Fetch candidate products the user hasn't seen yet.
    For simplicity we just take up to `limit` items.
    You can add filters (e.g. category, price) here later.
    """
    query = supabase.table("products").select(
        "id, name, price, image_url, embedding, category, description"
    )
    if exclude_ids:
        # Supabase 'not in' filter
        query = query.not_.in_("id", list(exclude_ids))
    res = query.limit(limit).execute()
    return res.data or []


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    if a.shape != b.shape:
        raise ValueError("Vector shapes do not match")
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)


seen = {}


def get_next_best_product(user_id: int) -> dict | None:
    """
    Returns the single best next product for a user as a dict,
    or None if no product is available.

    Strategy:
    - If the user has a profile embedding:
      * fetch unseen products
      * compute cosine similarity to each product embedding in Python
      * return the highest-similarity product
    - If no profile (cold start):
      * just return a random/popular unseen product
    """
    user_embedding = get_user_profile_embedding(user_id)

    # Get candidates (unseen products)
    candidates = get_candidate_products(exclude_ids=seen.keys(), limit=500)  # type: ignore

    if not candidates:
        return None  # no products left to show

    # Compute similarity for each candidate and pick the best
    best_product = None
    best_score = -1.0

    for product in candidates:
        emb_list = parse_embedding(product.get("embedding"))
        if emb_list is None or emb_list.size == 0:
            # skip products without an embedding
            continue
        p_emb = emb_list
        if p_emb.shape[0] != EMBED_DIM:
            # skip if dimension doesn’t match
            continue

        score = cosine_similarity(user_embedding, p_emb)  # type: ignore
        if score > best_score and seen.get(product["id"], False) is False:
            best_score = score
            best_product = product

    if best_product:
        seen[best_product["id"]] = True

    return best_product

from flask import Blueprint, jsonify, request
import requests
from functools import lru_cache
from supabase_client import SUPABASE_URL, SUPABASE_KEY

products_bp = Blueprint("products", __name__, url_prefix="/")

PRODUCTS_URL = "https://dummyjson.com/products"


def parse_product(raw_product: dict) -> dict:
    """Compatible with supabase 'products' table schema."""
    images = raw_product.get("images", [])
    image_url = images[0] if images else None

    return {
        "external_id": raw_product.get("id"),
        "name": raw_product.get("title"),
        # "tags": raw_product.get("tags", []),
        "description": raw_product.get("description"),
        "price": raw_product.get("price"),
        "category": raw_product.get("category"),
        "image_url": image_url,
    }


def _get_raw_products() -> list | tuple:
    try:
        response = requests.get(PRODUCTS_URL, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data.get("products", [])
    except Exception as exc:  # noqa: BLE001
        # Fallback to local data if the external API is unreachable.
        print(f"[products] Falling back to mock data: {exc}")
        return "Something went wrong", 500


def get_products() -> list:
    raw_products = _get_raw_products()
    return [parse_product(prod) for prod in raw_products]


def __add_to_supabase() -> list:
    """Fetch products from external API and add them to Supabase."""
    raw_products = _get_raw_products()
    products = [parse_product(prod) for prod in raw_products]
    from supabase import create_client, Client

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL or Key is not set.")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    for product in products:
        supabase.table("products").insert(product).execute()

    return products


def get_products_from_supabase() -> list:
    """Fetch products data from Supabase."""
    from supabase import create_client, Client

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL or Key is not set.")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = supabase.table("products").select("*").execute()
    return response.data


@lru_cache(maxsize=128)
def get_products_from_supabase_paginated(offset: int, limit: int) -> list:
    """Fetch paginated products from Supabase with caching."""
    from supabase import create_client, Client

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL or Key is not set.")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = supabase.table("products").select("*").range(offset, offset + limit - 1).execute()
    return response.data


@lru_cache(maxsize=1)
def get_products_count() -> int:
    """Get total count of products from Supabase with caching."""
    from supabase import create_client, Client

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL or Key is not set.")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = supabase.table("products").select("*", count='exact').execute()
    return response.count


@products_bp.get("/")
@products_bp.get("")
def list_products():
    """List products from Supabase with pagination"""
    # Get pagination parameters
    limit = request.args.get('limit', default=20, type=int)
    offset = request.args.get('offset', default=0, type=int)
    
    # Limit max to prevent abuse
    limit = min(limit, 100)
    
    products = get_products_from_supabase_paginated(offset, limit)
    total_count = get_products_count()
    
    return jsonify({
        'products': products,
        'total': total_count,
        'limit': limit,
        'offset': offset,
        'hasMore': offset + limit < total_count
    })

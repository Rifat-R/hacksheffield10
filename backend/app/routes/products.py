from flask import Blueprint, jsonify
import requests

products_bp = Blueprint("products", __name__, url_prefix="/")

PRODUCTS_URL = "https://dummyjson.com/products"


temp_cache = []


def get_products() -> list | tuple:
    try:
        response = requests.get(PRODUCTS_URL, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data.get("products", [])
    except Exception as exc:  # noqa: BLE001
        # Fallback to local data if the external API is unreachable.
        print(f"[products] Falling back to mock data: {exc}")
        return "Something went wrong", 500


@products_bp.get("/")
@products_bp.get("")
def list_products():
    if not temp_cache:
        products = get_products()
        temp_cache.extend(products)
    return jsonify(temp_cache)

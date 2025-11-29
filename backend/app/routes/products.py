from flask import Blueprint, jsonify
import requests

products_bp = Blueprint("products", __name__)

MOCK_PRODUCTS = [
    {"id": 1, "name": "Lumen Linen Shirt", "price": 78.0, "currency": "USD"},
    {"id": 2, "name": "Aero Knit Sneakers", "price": 120.0, "currency": "USD"},
]


def get_products() -> list:
    URL = "https://dummyjson.com/products"
    response = requests.get(URL).json()
    products = response.get("products", [])
    return products


@products_bp.get("/")
def list_products():
    products = get_products()
    return jsonify(products)

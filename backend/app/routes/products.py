from flask import Blueprint, jsonify

products_bp = Blueprint("products", __name__)

MOCK_PRODUCTS = [
    {"id": 1, "name": "Lumen Linen Shirt", "price": 78.0, "currency": "USD"},
    {"id": 2, "name": "Aero Knit Sneakers", "price": 120.0, "currency": "USD"},
]


@products_bp.get("/")
def list_products():
    return jsonify(products=MOCK_PRODUCTS)

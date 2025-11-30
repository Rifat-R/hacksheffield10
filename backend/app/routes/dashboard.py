from flask import Blueprint, jsonify, request
from db_service import get_all, get_by_id, create_record, update_record, delete_record
from .products import get_products_from_supabase
from services.embedding_client import embed_product
dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/products", methods=["GET"])
def list_products():
   products = get_products_from_supabase()
   return jsonify(products)


@dashboard_bp.route("/products/<int:product_id>", methods=["GET"])
def fetch_one(product_id):
    data = get_by_id("products", product_id)
    if not data:
        return jsonify({"error": "Not found"}), 404
    return jsonify(data)


@dashboard_bp.route("/products", methods=["POST"])
def create():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        embedding = embed_product(data)
        data["embedding"] = embedding
        record = create_record("products", data)
        return jsonify(record), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@dashboard_bp.route("/products/<int:product_id>", methods=["PUT"])
def update(product_id):
    try:
        updates = request.json
        if not updates:
            return jsonify({"error": "No data provided"}), 400
        embedding = embed_product(updates)
        updates["embedding"] = embedding
        record = update_record("products", product_id, updates)
        if not record:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(record)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@dashboard_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete(product_id):
    try:
        record = delete_record("products", product_id)
        if not record:
            return jsonify({"error": "Product not found"}), 404
        return jsonify({"message": "Product deleted successfully", "data": record})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


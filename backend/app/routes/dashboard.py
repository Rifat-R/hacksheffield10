from flask import Blueprint, jsonify, request
from db_service import get_all, get_by_id, create_record, update_record, delete_record
from .products import get_products_from_supabase
from supabase_client import supabase

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
    data = request.json
    record = create_record("products", data)
    return jsonify(record), 201


@dashboard_bp.route("/products/<int:product_id>", methods=["PUT"])
def update(product_id):
    updates = request.json
    record = update_record("products", product_id, updates)
    return jsonify(record)


@dashboard_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete(product_id):
    record = delete_record("products", product_id)
    return jsonify(record)


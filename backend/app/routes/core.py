from flask import Blueprint, jsonify

core_bp = Blueprint("core", __name__)


@core_bp.get("/api/health")
def health():
    return jsonify(status="ok")

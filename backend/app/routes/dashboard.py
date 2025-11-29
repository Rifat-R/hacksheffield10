from flask import Blueprint, jsonify

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.get("/api/dashboard/summary")
def summary():
    # Static sample metrics for now; swap for real data or service calls.
    metrics = {
        "daily_users": 1280,
        "revenue": 48200,
        "conversion_rate": 3.4,
    }
    return jsonify(metrics)

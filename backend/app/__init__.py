from flask import Flask
from flask_cors import CORS

from .routes import core_bp, products_bp, dashboard_bp, swiped_bp


def create_app(config_name: str | None = None) -> Flask:
    app = Flask(__name__)
    config_name = config_name or "Dev"
    app.config.from_object(f"app.config.{config_name}Config")

    # Allow frontend requests during dev; tighten when deploying.
    CORS(app)

    app.register_blueprint(core_bp)
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(swiped_bp, url_prefix="/api/dashboard")

    return app

from flask import Flask

from .routes import core_bp, products_bp, dashboard_bp


def create_app(config_name: str | None = None) -> Flask:
    app = Flask(__name__)
    config_name = config_name or "Dev"
    app.config.from_object(f"app.config.{config_name}Config")

    app.register_blueprint(core_bp)
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    return app

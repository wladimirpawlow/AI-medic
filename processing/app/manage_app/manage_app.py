from flask import render_template
from flask import Flask, request
from flask_smorest import Api
from app.auth.auth import check_token
from app.manage_app.config import Config
from app.manage_app.logging import configure_logging, processes_logger
from app.model.models import db
from app.manage_app.default_units import ensure_database_exists, create_tables

from app.api.setpoints.feature.routes import blp as feature_blueprint


def create_app(tests=False):
    app = Flask(__name__, template_folder="templates")

    @app.route("/processing/swagger/ui")
    def custom_swagger_ui():
        try:
            return render_template("swagger-ui.html")
        except Exception as e:
            return {"error": str(e)}, 500

    app.config.from_object(Config)
    app.config.update({
        "API_TITLE": "AI-med processing API",
        "API_VERSION": "1.0",
        "OPENAPI_VERSION": "3.0.2",
        "OPENAPI_URL_PREFIX": "/api/processing",

        "API_SPEC_OPTIONS": {
            "components": {
                "securitySchemes": {
                    "BearerAuth": {
                        "type": "http",
                        "scheme": "bearer",
                        "bearerFormat": "JWT",
                        "description": "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'"
                    }
                }
            },
            "security": [{"BearerAuth": []}]
        }
    })

    ensure_database_exists()

    if tests:
        db.init(
            database=app.config['DATABASE_TEST']['name'],
            user=app.config['DATABASE_TEST']['user'],
            password=app.config['DATABASE_TEST']['password'],
            host=app.config['DATABASE_TEST']['host'],
            port=app.config['DATABASE_TEST']['port'],
        )
    else:
        db.init(
            database=app.config['DATABASE']['name'],
            user=app.config['DATABASE']['user'],
            password=app.config['DATABASE']['password'],
            host=app.config['DATABASE']['host'],
            port=app.config['DATABASE']['port'],
        )

    create_tables()

    configure_logging(app)

    @app.before_request
    def log_request_info():
        processes_logger.info(f"Received {request.method} request to {request.path}")

    @app.errorhandler(Exception)
    def handle_exception(e):
        processes_logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
        return {"error": "Internal server error"}, 500

    # @app.before_request
    # def check_jwt():
    #     check_token(app.config['OPEN_ROUTS'])

    api = Api(app)
    api.register_blueprint(feature_blueprint)

    return app

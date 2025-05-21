# routes/__init__.py

from flask import Blueprint

# Import all route modules here
from .chat_routes import chat_bp
from .parser_routes import parser_bp

def register_routes(app):
    # Register each blueprint with the main Flask app
    app.register_blueprint(chat_bp)
    app.register_blueprint(parser_bp)

# routes/__init__.py

# Import all route modules here
from .chat_routes import chat_bp
from .practice_routes import practice_bp

def register_routes(app):
    # Register each blueprint with the main Flask app
    app.register_blueprint(chat_bp)
    app.register_blueprint(practice_bp)

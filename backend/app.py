"""
app.py

Entry point for the Flask web application.  
- Configures Flask and CORS.  
- Registers all route blueprints.  
- Runs the development server.

Usage:
    python app.py

Environment:
    Ensure that any required environment variables (e.g., OPENAI_API_KEY) are set before starting.

@author bbansal-18
"""

from flask import Flask
from flask_cors import CORS

# Import a helper that attaches all route blueprints to the app
from routes import register_routes

# Create the Flask application instance
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for all routes
# This allows browser clients from other domains to make requests to the API.
CORS(app)


# Register all of our route blueprints (e.g., practice, chat) with the app
# register_routes is expected to iterate over each Blueprint and call app.register_blueprint().
register_routes(app)


if __name__ == "__main__":
    """
    If this script is executed directly (not imported), start the Flask
    development server in debug mode on port 5050.
    """
    app.run(debug=True, port=5050)

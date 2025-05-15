#!/bin/bash

mkdir -p backend/{routes,services,utils,data}
touch backend/app.py
touch backend/requirements.txt

# Routes
touch backend/routes/__init__.py
cat > backend/routes/chatbot.py << 'EOF'
from flask import Blueprint, request, jsonify
from services.chatbot_service import generate_response

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('', methods=['POST'])
def handle_query():
    data = request.get_json()
    user_input = data.get("query", "")
    response = generate_response(user_input)
    return jsonify({"response": response})
EOF

cat > backend/routes/topics.py << 'EOF'
from flask import Blueprint, jsonify
from services.topic_service import get_all_topics

topics_bp = Blueprint('topics', __name__)

@topics_bp.route('', methods=['GET'])
def all_topics():
    topics = get_all_topics()
    return jsonify(topics)
EOF

cat > backend/routes/safety.py << 'EOF'
from flask import Blueprint, request, jsonify
from services.safety_filter import is_safe_query

safety_bp = Blueprint('safety', __name__)

@safety_bp.route('', methods=['POST'])
def check_safety():
    data = request.get_json()
    user_input = data.get("query", "")
    safe = is_safe_query(user_input)
    return jsonify({"safe": safe})
EOF

# Services
cat > backend/services/chatbot_service.py << 'EOF'
def generate_response(user_input):
    # Placeholder response logic
    return f"This is a dummy response to: '{user_input}'"
EOF

cat > backend/services/topic_service.py << 'EOF'
import yaml

def get_all_topics():
    with open('data/topics.yaml', 'r') as f:
        topics = yaml.safe_load(f)
    return topics
EOF

cat > backend/services/safety_filter.py << 'EOF'
def is_safe_query(query):
    # Dummy filter for unsafe content
    banned = ["hack", "exploit", "bypass"]
    return not any(word in query.lower() for word in banned)
EOF

# Utils
cat > backend/utils/helpers.py << 'EOF'
# Add helper functions here in future
EOF

# Topics Data
cat > backend/data/topics.yaml << 'EOF'
DSA:
  - Arrays and Strings
  - Linked Lists
  - Stacks and Queues
  - Trees and Graphs
  - Sorting and Searching
  - Recursion and Backtracking

Python:
  - Variables and Data Types
  - Control Flow
  - Functions and Recursion
  - Lists, Tuples, Dictionaries
  - OOP Concepts
  - File Handling
EOF

# Main app.py
cat > backend/app.py << 'EOF'
from flask import Flask
from routes.chatbot import chatbot_bp
from routes.topics import topics_bp
from routes.safety import safety_bp

app = Flask(__name__)

app.register_blueprint(chatbot_bp, url_prefix="/ask")
app.register_blueprint(topics_bp, url_prefix="/topics")
app.register_blueprint(safety_bp, url_prefix="/check-safety")

@app.route('/')
def home():
    return "AI Study Buddy API is live!"

if __name__ == '__main__':
    app.run(debug=True)
EOF

# Requirements
cat > backend/requirements.txt << 'EOF'
Flask
PyYAML
EOF

echo "Backend folder structure and files created successfully."

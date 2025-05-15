from flask import Blueprint, request, jsonify
from services.chatbot_service import generate_response

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('', methods=['POST'])
def handle_query():
    data = request.get_json()
    user_input = data.get("query", "")
    response = generate_response(user_input)
    return jsonify({"response": response})

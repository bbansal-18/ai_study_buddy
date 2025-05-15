from flask import Blueprint, request, jsonify
from services.safety_filter import is_safe_query

safety_bp = Blueprint('safety', __name__)

@safety_bp.route('', methods=['POST'])
def check_safety():
    data = request.get_json()
    user_input = data.get("query", "")
    safe = is_safe_query(user_input)
    return jsonify({"safe": safe})

from flask import Blueprint, request, jsonify
from services.parse_query import parse_query

parser_bp = Blueprint('parser', __name__)

@parser_bp.route('/parse', methods=['POST'])
def parse():
    data = request.get_json()
    query = data.get('query', '')

    if not query:
        return jsonify({"error": "No query provided"}), 400

    result = parse_query(query)
    return jsonify(result)

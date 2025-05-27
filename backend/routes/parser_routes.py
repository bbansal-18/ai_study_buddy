from flask import Blueprint, request, jsonify
from services.parse_query import parse_query

parser_bp = Blueprint('parser', __name__)

@parser_bp.route('/parse', methods=['POST'])
def parse():
    data = request.get_json()
    query = data.get("query", "")

    try:
        result = parse_query(query)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

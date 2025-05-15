from flask import Blueprint, jsonify
from services.topic_service import get_all_topics

topics_bp = Blueprint('topics', __name__)

@topics_bp.route('', methods=['GET'])
def all_topics():
    topics = get_all_topics()
    return jsonify(topics)

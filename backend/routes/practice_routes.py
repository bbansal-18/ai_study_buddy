from flask import Blueprint, jsonify, request
from services.practice_service import load_problems, load_problem, load_testcases

practice_bp = Blueprint('practice', __name__, url_prefix='/practice')

@practice_bp.route('/problems', methods=['GET'])
def get_problems():
    """Return the full list of practice problems."""
    problems = load_problems()
    return jsonify(problems), 200

@practice_bp.route('/problems/<problem_id>', methods=['GET'])
def get_problem(problem_id):
    """Return the metadata for a single problem."""
    problem = load_problem(problem_id)
    if not problem:
        return jsonify({"error": "Problem not found"}), 404
    return jsonify(problem), 200

@practice_bp.route('/problems/<problem_id>/testcases', methods=['GET'])
def get_problem_testcases(problem_id):
    """Return the hidden testcases for a problem."""
    try:
        cases = load_testcases(problem_id)
        return jsonify(cases), 200
    except FileNotFoundError:
        return jsonify({"error": "Testcases not found"}), 404

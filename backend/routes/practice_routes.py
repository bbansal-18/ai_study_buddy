"""
routes/practice_routes.py

Defines the Flask Blueprint and HTTP routes for the “practice” section of the API.
Each route invokes the corresponding service function to load data and returns
JSON responses (including error handling).

Routes:
    GET  /practice/problems
        Returns a list of all practice problems (brief metadata).

    GET  /practice/problems/<problem_id>
        Returns detailed metadata for a single problem.
    
    GET  /practice/problems/<problem_id>/solution/<selectedLang>
        Returns hidden test-wrapper code for executing user submissions in the
        specified language.

@author: github.com/bbansal-18
"""

# Flask imports
from flask import Blueprint, jsonify

# Import service layer functions that handle data loading
from services.practice_service import load_problems, load_problem, load_testcases

# Create a Blueprint named 'practice' with URL prefix '/practice'
practice_bp = Blueprint('practice', __name__, url_prefix='/practice')


@practice_bp.route('/problems', methods=['GET'])
def get_problems():
    """
    GET /practice/problems
    ----------------------
    Fetch and return the list of all practice problems.

    Uses:
        load_problems() -> List[Dict]
            Loads brief metadata for every problem.

    Responses:
        200 OK, JSON list of problem objects.
    """
    problems = load_problems()
    
    # Return JSON-serialized list with HTTP 200 (OK)
    return jsonify(problems), 200


@practice_bp.route('/problems/<problem_id>', methods=['GET'])
def get_problem(problem_id):
    """
    GET /practice/problems/<problem_id>
    -----------------------------------
    Fetch and return detailed information for a single problem ID.

    Parameters:
        problem_id (str): Unique identifier of the problem.

    Uses:
        load_problem(problem_id) -> Dict or None
            Returns problem details or None if not found.

    Responses:
        200 OK      -> JSON object with problem details.
        404 Not Found -> JSON error message if problem_id is invalid.
    """
    
    problem = load_problem(problem_id)
    
    if not problem:
        return jsonify({"error": "Problem not found"}), 404
    
    return jsonify(problem), 200

@practice_bp.route('/problems/<problem_id>/solution/<selectedLang>', methods=['GET'])
def get_problem_testcases(problem_id, selectedLang):
    """
    GET /practice/problems/<problem_id>/solution/<selectedLang>
    ----------------------------------------------------------
    Fetch and return the hidden test-wrapper code for verifying user submissions.

    Parameters:
        problem_id   (str): Identifier of the problem.
        selectedLang (str): Programming language key (e.g., 'python', 'java').

    Uses:
        load_testcases(problem_id, selectedLang) -> str or None
            Returns the code wrapper (boilerplate) or None if missing.

    Responses:
        200 OK      -> JSON object { "wrapper": <code string> }.
        404 Not Found -> JSON error message if either problem_id or language is invalid.
    """
    wrapper = load_testcases(problem_id, selectedLang)
    
    if wrapper is None:
        return jsonify({"error": "Testcases not found"}), 404

    # Return the wrapper code inside a JSON object to ensure proper CORS headers
    return jsonify({"wrapper": wrapper}), 200

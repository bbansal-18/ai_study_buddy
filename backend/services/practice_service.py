import json
import os

# Compute the base path to your data folder
BASE_DIR = os.path.dirname(os.path.dirname(__file__))       # backend/services → backend
DATA_DIR = os.path.join(BASE_DIR, '..', 'data', 'practice')  # → data/practice

def load_problems():
    """Load all problems from problems.json into a Python list."""
    path = os.path.abspath(os.path.join(DATA_DIR, 'problems_brief.json'))
    with open(path, 'r') as f:
        return json.load(f)

def load_problem(problem_id):
    """Return one problem by id, or None if not found."""
    detailed_path = os.path.abspath(os.path.join(DATA_DIR, 'problems_detailed.json'))
    try:
        with open(detailed_path, 'r') as f:
            detailed = json.load(f)
    except (IOError, json.JSONDecodeError):
        # file not found or invalid JSON
        return None

    # detailed is a dict keyed by problem_id
    return detailed.get(problem_id)

def load_testcases(problem_id, selectedLang):
    """Load testcases for a given problem_id."""
    path = os.path.abspath(os.path.join(DATA_DIR, 'problems_gold_code.json'))
    
    try:
        with open(path, 'r') as f:
            code = json.load(f)
    except (IOError, json.JSONDecodeError):
        # file not found or invalid JSON
        return None

    problem_entry = code.get(problem_id)
    if not problem_entry:
        return None

    # use dict access, not attribute
    return problem_entry.get(selectedLang)

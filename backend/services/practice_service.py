import json
import os

# Compute the base path to your data folder
BASE_DIR = os.path.dirname(os.path.dirname(__file__))       # backend/services → backend
DATA_DIR = os.path.join(BASE_DIR, '..', 'data', 'practice')  # → data/practice

def load_problems():
    """Load all problems from problems.json into a Python list."""
    path = os.path.abspath(os.path.join(DATA_DIR, 'problems.json'))
    with open(path, 'r') as f:
        return json.load(f)

def load_problem(problem_id):
    """Return one problem by id, or None if not found."""
    problems = load_problems()
    for p in problems:
        if p['id'] == problem_id:
            return p
    return None

def load_testcases(problem_id):
    """Load testcases for a given problem_id."""
    path = os.path.abspath(os.path.join(DATA_DIR, 'testcases', f'{problem_id}.json'))
    with open(path, 'r') as f:
        return json.load(f)

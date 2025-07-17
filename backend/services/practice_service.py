"""
services/practice_service.py

This file contains all functions that load data from the local database, and 
forwards this data to the routes for the programming practice section of the
webpage.

Functions:
    1. load_problems(): 
        Returns a list of all practice problems (brief metadata)
    
    2. load_problem(problem_id): 
        Returns {problem_id}'s detailed metadata
    
    3. load_testcases(problem_id, selectedLang): 
        Returns hidden test-wrapper code for executing user submissions 
        in the specified language.

@author: github.com/bbansal-18
"""
# imports
import json
import os

# Compute the base path to your data folder
BASE_DIR = os.path.dirname(os.path.dirname(__file__))        # backend
DATA_DIR = os.path.join(BASE_DIR, '..', 'data', 'practice')  # data/practice

def load_problems():
    """
    Load all problems from 'practice/problems_brief.json' into a Python list.
    
    Return the list of JSON objects.
    """
    path = os.path.abspath(os.path.join(DATA_DIR, 'problems_brief.json'))
    with open(path, 'r') as f:
        return json.load(f)

def load_problem(problem_id):
    """
    Return the detailed problem description of {problem_id} from 
    'practice/problems_detailed.json', or None if not found.
    """
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
    """
    Return boilerplate code as a string for a given problem_id and selectedLang
    from 'practice/problems_gold_code.json'.
    """
    path = os.path.abspath(os.path.join(DATA_DIR, 'problems_gold_code.json'))
    
    try:
        with open(path, 'r') as f:
            code = json.load(f)
            
    except (IOError, json.JSONDecodeError):
        return None

    problem_entry = code.get(problem_id)
    
    if not problem_entry:
        return None
    return problem_entry.get(selectedLang)

#!/usr/bin/env bash
set -euo pipefail

INPUT="data/practice/problems.json"
OUTPUT="data/practice/problems_detailed.json"

# Ensure Python3 is available
if ! command -v python3 &> /dev/null; then
  echo "Error: python3 is required but not installed." >&2
  exit 1
fi

python3 <<PYCODE
import json

# Load the original list of problems
with open("${INPUT}", "r") as f:
    problems = json.load(f)

# Re-key by 'id', removing each 'id' field from the value
detailed = {}
for p in problems:
    pid = p.get("id")
    if pid is None:
        continue
    value = {k: v for k, v in p.items() if k != "id"}
    detailed[pid] = value

# Write out the new JSON
with open("${OUTPUT}", "w") as f:
    json.dump(detailed, f, indent=2)

print(f"Wrote re-keyed problems to '{OUTPUT}'")
PYCODE
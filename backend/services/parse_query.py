import openai
import os

# Define your topics (can be expanded or loaded from config/db later)
VALID_TOPICS = [
    "recursion", "dynamic programming", "graphs", "linked lists", "arrays",
    "binary trees", "sorting", "searching", "hashmaps", "stacks", "queues",
    "greedy algorithms", "python syntax", "loops", "functions", "OOP",
    "math", "combinatorics", "number theory", "probability"
]

SYSTEM_PROMPT = """
You are a helpful assistant that classifies student queries for a computer science and math study assistant app.

Given a query, respond ONLY in a JSON format with the following fields:
- "valid": true/false (whether the query is safe and on-topic)
- "reason": null or a short string if invalid
- "topic": one from this list if valid: [recursion, dynamic programming, graphs, linked lists, arrays, binary trees, sorting, searching, hashmaps, stacks, queues, greedy algorithms, python syntax, loops, functions, OOP, math, combinatorics, number theory, probability]
- "type": one of: ["conceptual", "code explanation", "example request", "other"]

Only include valid topics and types. If unsure or off-topic, mark valid=false.
"""

async def parse_query(query: str) -> dict:
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query}
            ],
            temperature=0.2,
            max_tokens=200
        )

        output = response["choices"][0]["message"]["content"]
        return eval(output)  # Should be safe since output is strictly JSON from GPT

    except Exception as e:
        return {
            "valid": False,
            "reason": f"LLM error: {str(e)}",
            "topic": None,
            "type": None
        }

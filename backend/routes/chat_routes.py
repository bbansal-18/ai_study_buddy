from flask import Blueprint, request, jsonify
import os, json
from openai import OpenAI

chat_bp = Blueprint('chat_bp', __name__)
client = OpenAI()  # uses OPENAI_API_KEY from env

@chat_bp.route('/chat', methods=['POST'])
def chat():
    user_query = request.json.get("query", "").strip()
    if not user_query:
        return jsonify({"error": "Missing 'query' in request body"}), 400

    system_prompt = """
        You are an expert computer science and programming tutor assistant. Your job is to interpret each student query in the broad context of computer science, AI, and software development—and whenever possible, connect it to programming concepts or techniques.

        Given a user query, you must respond **only** in JSON with these fields:

        - **valid**: `true` if the query is on-topic (related even loosely to CS/programming/data structures/algorithms), otherwise 'false'.  
        - **reason**: `null` if valid; otherwise, a brief explanation of why it's off-topic.  
        - **topic**: if valid, one of [recursion, dynamic programming, graphs, linked lists, arrays, tree data structure,
                    sorting, searching, hashmaps, stacks, queues, greedy algorithms,
                    python syntax, loops, functions, OOP]
                    If you detect a programming concept not in that list but still relevant, use `"unknown"`.  
        - **answer**:  
        - If the detected **topic** is in the list above,  prioritize a deeper, code-oriented response (e.g. snippet patterns or complexity notes).
        - If **valid** but **topic** = unknown: give a concise (1-2 sentence) response **focused on programming**, even if the question was phrased generally.  
        - If you set **valid** to `false`, this must be `null`.  
        - **keywords**: an array of the most important terms from your **answer**.

        **Special guidance:**
        1. Always try to map the user's question to a programming or algorithmic concept.  
        2. If there's **any** hint of a programming angle (even indirectly), treat it as on-topic and choose the closest relevant topic.  
        3. Only mark `valid: false` when the query truly has no plausible connection to programming/CS.  
        4. For topics in `[recursion, dynamic programming, graphs, …, OOP]`, prioritize a deeper, code-oriented response (e.g. snippet patterns or complexity notes).

        """

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_query}
            ],
            temperature=0.7
        )
        content = resp.choices[0].message.content.strip()

        # parse model's JSON response
        response_json = json.loads(content)
        return jsonify(response_json)

    except json.JSONDecodeError:
        # model didn't return valid JSON
        return jsonify({
            "error": "Failed to parse model response as JSON",
            "raw_response": content
        }), 502

    except Exception as e:
        return jsonify({"error": str(e)}), 500
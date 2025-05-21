from flask import Blueprint, request, jsonify
import os, json
from openai import OpenAI

chat_bp = Blueprint('chat_bp', __name__)
client = OpenAI()  # uses OPENAI_API_KEY from env

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    user_query = request.json.get("query", "").strip()
    if not user_query:
        return jsonify({"error": "Missing 'query' in request body"}), 400

    system_prompt = (
        "You are an expert CS tutor. "
        "Always respond in JSON format with exactly these keys: "
        "query (string), topic (string), keywords (array of strings), answer (string)."
    )

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

        # parse model’s JSON response
        response_json = json.loads(content)
        return jsonify(response_json)

    except json.JSONDecodeError:
        # model didn’t return valid JSON
        return jsonify({
            "error": "Failed to parse model response as JSON",
            "raw_response": content
        }), 502

    except Exception as e:
        return jsonify({"error": str(e)}), 500
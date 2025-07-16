import json
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

INPUT_FILE = "problems_detailed.json"
OUTPUT_FILE = "problems"

SYSTEM_PROMPT = """
You are a brilliant computer programmer who is trying to teach other students to solve programming problems. You are tasked to write a boilerplate for a programming problem. 
Here are your specifications:

Write the code in the following languages: c, cpp, python, java, sml. Finalize at least 5 test cases to check the correctness of the code. Ensure that inputs are within the specified bounds, and make sure that the test cases are checking all edge cases so as to guarantee the correctness of code.
In each language, make sure that you define a main function that uses asserts (or similar in the given language) to test the correctness of the function implementation. DO NOT WRITE THE IMPLEMENTATION OF THE FUNCTION.
YOU ARE ONLY TASKED TO WRITE THE CODE SUCH THAT, IF I ADD THE CORRECT FUNCTION IMPLEMENTATION, THEN THE CODE RUNS SUCCESSFULLY. You must design careful, safe, and strict test cases to test the robustness and correctness of my code.



Your Code's format:

// imports
{define any necessary imports here}

// function implementation
{leave blank}

// main function
{as defined above}


Once you do this for all coding languages, you need to output a json object with the following format:
{problemName}: {
      "python": ..., 
      "c": ..., 
      "cpp": ...,
      "java": ...,
      "sml": ...
}

You are to return the JSON object only. Make sure that your code is formatted correctly. Here is a sample for you:

query: "recursion_easy_1": {
    "title": "Factorial of a Number",
    "topic": "recursion",
    "difficulty": "easy",
    "function": "factorial",
    "inputs": [
      "n: int"
    ],
    "return": "int",
    "statement": "Given a non-negative integer n, return n! (the product of all positive integers less than or equal to n). Assume n ≥ 0.",
    "sample_input": "5",
    "sample_output": "120"
  },
  
Output:
"recursion_easy_1": {
    "python": "# imports\nimport sys\n\n# function implementation\n\n\n# main function\ndef main():\n    test_cases = [(0,1), (1,1), (5,120), (10,3628800), (12,479001600)]\n    for n, expected in test_cases:\n        assert factorial(n) == expected, f\"factorial({n}) should be {expected}\"\n    print(\"All tests passed.\")\n\nif __name__ == \"__main__\":\n    main()",
    "c": "// imports\n#include <stdio.h>\n#include <assert.h>\n\n// function implementation\n\n// main function\nint main(void) {\n    struct { int n, expected; } tests[] = {{0,1}, {1,1}, {5,120}, {10,3628800}, {12,479001600}};\n    for (int i = 0; i < 5; i++) {\n        assert(factorial(tests[i].n) == tests[i].expected);\n    }\n    printf(\"All tests passed.\\n\");\n    return 0;\n}",
    "cpp": "// imports\n#include <iostream>\n#include <cassert>\n\n// function implementation\n\n// main function\nint main() {\n    std::pair<int,int> tests[] = {{0,1}, {1,1}, {5,120}, {10,3628800}, {12,479001600}};\n    for (auto &t : tests) {\n        assert(factorial(t.first) == t.second);\n    }\n    std::cout << \"All tests passed.\\n\";\n    return 0;\n}",
    "java": "// imports\nimport static java.lang.System.out;\n\npublic class Main {\n    //function implementation\n\n    // main function\n    public static void main(String[] args) {\n        int[][] tests = {{0,1}, {1,1}, {5,120}, {10,3628800}, {12,479001600}};\n        for (int[] t : tests) {\n            assert factorial(t[0]) == t[1] : \"Test failed for n=\" + t[0];\n        }\n        out.println(\"All tests passed.\");\n    }\n}",
    "sml": "(* imports *)\n(* function implementation *)\n\n\n(* main function *)\nval _ =\n    let\n        val tests = [(0,1), (1,1), (5,120), (10,3628800), (12,479001600)]\n        fun check [] = print \"All tests passed.\\n\"\n          | check ((n,exp)::rest) =\n                if factorial n = exp\n                then check rest\n                else raise Fail (\"Test failed for n=\" ^ Int.toString n)\n    in\n        check tests\n    end"
  }
  
Make sure that your response is JSON Safe:
Use only double quotes (") for JSON—never single quotes.
Escape:
Inner double-quotes as \"
Backslashes as \\
Newlines as \n
"""


def parse_query(query: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query}
            ],
            temperature=0.2,
            max_tokens=2000
        )

        output = response.choices[0].message.content.strip()
        return json.loads(output)

    except Exception as e:
        return {
            "error": True,
            "reason": f"{str(e)}",
        }



def main():
    # Load whatever’s in input.json
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # If it's a dict, pull out its values into a list
    if isinstance(data, dict):
        # If you also want to keep the original keys, use items():
        items = [
            {"id": key, **value}
            for key, value in data.items()
        ]
    elif isinstance(data, list):
        items = data
    else:
        raise ValueError(f"{INPUT_FILE} must contain a JSON object or array")

    results = []
    for idx, obj in enumerate(items):
        query = json.dumps(obj, ensure_ascii=False)
        try:
            response_obj = parse_query(query)
        except Exception as e:
            print(f"Error on item {idx}: {e}")
            continue
        results.append(response_obj)
        print(f"{idx}: correctly finished")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Processed {len(results)} items; wrote {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

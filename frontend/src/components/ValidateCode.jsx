/**
 * src/utils/ValidateCode.js
 *
 * Utility functions to integrate user-submitted code with a test harness and
 * execute it on the Judge0 API. Exports a single async function to validate
 * code by merging and submitting to Judge0.
 * 
 * @author bbansal-18
 */

// Mapping from language keys to Judge0 language IDs
const judgeLangIds = {
  python: 71,
  java:   62,
  c:      50,
  cpp:    54,
};

// Language-specific placeholder text in the test harness
const placeholderMap = {
  python: "# function implementation",
  java:   "// function implementation",
  c:      "// function implementation",
  cpp:    "// function implementation",
};

/**
 * Merge user code into the provided wrapper template at the language placeholder.
 *
 * @param {string} wrapperCode   - Template code containing a placeholder comment.
 * @param {string} userCode      - Implementation code provided by the user.
 * @param {string} selectedLang  - One of 'python','java','c','cpp'.
 * @returns {string}             - Final source code ready for execution.
 * @throws {Error}               - If no placeholder is defined for the language.
 */
function mergeUserCode(wrapperCode, userCode, selectedLang) {
  const placeholder = placeholderMap[selectedLang];
  if (!placeholder) {
    throw new Error(`No placeholder defined for language "${selectedLang}"`);
  }
  return wrapperCode.replace(placeholder, userCode);
}

/**
 * Submit code to the Judge0 API for execution and return the result.
 *
 * @param {string} sourceCode     - Complete source code to submit.
 * @param {string} selectedLang   - Language key to resolve Judge0 language ID.
 * @returns {Promise<object>}     - Parsed JSON result from Judge0.
 * @throws {Error}                - On network failure or non-OK response.
 */
async function submitToJudge0(sourceCode, selectedLang) {
  const language_id = judgeLangIds[selectedLang];
  if (!language_id) {
    throw new Error(`Unsupported language "${selectedLang}"`);
  }

  const response = await fetch(
    'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Judge0 submission failed: ${text}`);
  }

  return response.json();
}

/**
 * Validate user-submitted code by merging it into a test harness and executing.
 *
 * @param {string} userCode      - User's implementation snippet.
 * @param {string} wrapperCode   - Test harness containing placeholder.
 * @param {string} selectedLang  - Target language ('python','java','c','cpp').
 * @returns {Promise<{ result: object, source: string }>}  - Execution result and final source.
 */
export default async function validateCode(userCode, wrapperCode, selectedLang) {
  const source = mergeUserCode(wrapperCode, userCode, selectedLang);
  
  const result = await submitToJudge0(source, selectedLang);
  return { result, source };
}

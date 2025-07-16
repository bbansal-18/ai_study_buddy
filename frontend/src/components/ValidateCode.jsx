// src/utils/ValidateCode.js
const judgeLangIds = {
  python: 71,
  java:   62,
  c:      50,
  cpp:    54
};

const replaceText = {
  python: "# function implementation",
  java:   "// function implementation",
  c:      "// function implementation",
  cpp:    "// function implementation"
};

/**
 * Replace the language-specific placeholder in wrapperCode
 * with the user’s implementation, then run via Judge0.
 *
 * @param {string} userCode      - the code the user typed
 * @param {string} wrapperCode   - the test harness + placeholder
 * @param {string} selectedLang  - one of 'python','java','c','cpp'
 * @returns {Promise<{ result: object, source: string }>}
 */
export default async function ValidateCode(userCode, wrapperCode, selectedLang) {
  // 1) Merge user code into wrapper
  const placeholder = replaceText[selectedLang];
  if (!placeholder) throw new Error(`No placeholder defined for language "${selectedLang}"`);

  const finalSource = wrapperCode.replace(
    placeholder,
    userCode
  );

  console.log(finalSource);

  // 2) Submit to Judge0
  const response = await fetch(
    'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key':   "e36ea24853msh15a637a55ad3d10p1eb57ajsn4f166c8c4843",
        'X-RapidAPI-Host':  'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: finalSource,
        language_id: judgeLangIds[selectedLang],
        // optionally you can include "stdin" or "expected_output" here
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Judge0 submission failed: ${text}`);
  }

  const result = await response.json();

  // 3) Return both the raw Judge0 JSON and the source we ran
  return { result, source: finalSource };
}

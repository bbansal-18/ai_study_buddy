/**
 * src/pages/ProblemDetail.jsx
 *
 * Renders the detailed problem-solving page:
 * - Fetches problem metadata and sample cases from backend on mount.
 * - Manages per-language code drafts stored in localStorage (24h retention).
 * - Generates initial boilerplate stubs via generateBoilerplate for supported languages.
 * - Provides editor UI, submit and restart controls.
 * - Submits code for validation and displays results via ValidateCode and Result components.
 *
 * Supported Languages:
 *   - python, java, c, cpp
 *   - sml: TODO (add support in ValidateCode)
 *
 * Helper Functions:
 *   - formatWithLineBreaks(text): string       // Inserts line breaks after '; '
 *   - loadProblem(id): Promise<Object>        // Fetches problem data or redirects
 *   - initStubs(problem): Object<string, string> // Generates initial stubs for each language
 *
 * @author bbansal-18
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateBoilerplate } from '../components/boilerplateGenerator';
import ValidateCode from '../components/ValidateCode';
import Result from '../components/Result';

const Editor = React.lazy(() => import('@monaco-editor/react'));

const supportedLanguages = [
  { label: 'Python', value: 'python' },
  { label: 'Java',   value: 'java'   },
  { label: 'C',      value: 'c'      },
  { label: 'C++',    value: 'cpp'    },
  // SML support TODO
];

/**
 * Insert line breaks after each '; ' for display in <pre> blocks.
 *
 * @param {string} text - Raw sample string with '; ' separators
 * @returns {string}    - Formatted string with '\n' inserted
 */
function formatWithLineBreaks(text) {
  return text.replace(/; /g, ';\n');
}

/**
 * Fetch problem details by ID, redirect if not found.
 *
 * @param {string} id - Problem identifier
 * @param {Function} navigate - React Router navigate
 * @returns {Promise<Object>} - Resolves to problem data
 */
async function loadProblem(id, navigate) {
  const res = await fetch(`http://localhost:5050/practice/problems/${id}`);
  if (!res.ok) {
    navigate('/notfound');
    throw new Error('Problem not found');
  }
  return res.json();
}

/**
 * Generate boilerplate stubs for each supported language.
 *
 * @param {Object} problem - Problem spec with function, inputs, return
 * @returns {Object<string, string>} - Map of language value to stub code
 */
function initStubs(problem) {
  return supportedLanguages.reduce((acc, { value }) => {
    acc[value] = generateBoilerplate({
      function: problem.function,
      inputs: problem.inputs,
      returnType: problem.return,
      language: value,
    });
    return acc;
  }, {});
}

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [codes, setCodes] = useState({});
  const [selectedLang, setSelectedLang] = useState('python');
  const [output, setOutput] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storageKey = `draft-${id}-${selectedLang}`;

  // Load problem data and initialize code stubs
  useEffect(() => {
    loadProblem(id, navigate)
      .then(data => {
        setProblem(data);
        setCodes(initStubs(data));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Load or generate code stub for selected language
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCodes(c => ({ ...c, [selectedLang]: saved }));
    } else if (problem) {
      setCodes(c => ({ ...c, [selectedLang]: initStubs(problem)[selectedLang] }));
    }
  }, [problem, selectedLang, storageKey]);

  // Persist code drafts
  useEffect(() => {
    const cur = codes[selectedLang];
    if (cur) localStorage.setItem(storageKey, cur);
  }, [codes, selectedLang, storageKey]);

  
  const handleCodeChange = v => setCodes(c => ({ ...c, [selectedLang]: v || '' }));

  // Submission: Fetch wrapper code, validate user code, set output.
  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput(null);
    try {
      const wrapRes = await fetch(
        `http://localhost:5050/practice/problems/${id}/solution/${selectedLang}`
      );
      if (!wrapRes.ok) throw new Error(`Failed to load wrapper: ${wrapRes.statusText}`);
      const { wrapper } = await wrapRes.json();
      const { result } = await ValidateCode(codes[selectedLang], wrapper, selectedLang);
      setOutput(result);
    } catch (err) {
      setOutput({ error: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Reset drafts and stubs for this problem.
   */
  const handleRestart = () => {
    if (window.confirm('Restart and clear all drafts for this problem?')) {
      supportedLanguages.forEach(({ value }) =>
        localStorage.removeItem(`draft-${id}-${value}`)
      );
      if (problem) setCodes(initStubs(problem));
      setOutput(null);
    }
  };

  const handleNextProblem = () => {
    navigate('/practice');
  };

  if (loading) return <div className="flex items-center justify-center h-full"><p className="text-gray-500">Loading…</p></div>;
  if (error)   return <div className="p-6"><p className="text-red-500">Error: {error}</p></div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{problem.title}</h1>
      <div className="flex items-center space-x-4">
        <span className="uppercase text-sm text-gray-500">{problem.topic}</span>
        <span className={
          problem.difficulty === 'easy'? 'text-green-600 font-semibold'
          : problem.difficulty === 'moderate'? 'text-yellow-600 font-semibold'
          : 'text-red-600 font-semibold'
        }>{problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}</span>
      </div>

      {/* Problem Statement and Goal */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Problem Statement</h2>
        <p className="whitespace-pre-wrap text-gray-800">{problem.statement}</p>
        <p className="mt-4 text-gray-700">Goal: write the function <code className="bg-gray-200 px-2 rounded">{problem.function}</code> returning <code className="bg-gray-200 px-2 rounded">{problem.return}</code>
          {problem.inputs.length > 0 && (
            <> taking <code className="bg-gray-200 px-2 rounded">{problem.inputs.join(', ')}</code></>
          )}.
        </p>
      </section>

      {/* Sample I/O */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-1">Sample Input</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{formatWithLineBreaks(problem.sample_input)}</pre>
        </div>
        <div>
          <h3 className="font-medium mb-1">Sample Output</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{formatWithLineBreaks(problem.sample_output)}</pre>
        </div>
      </section>

      {/* Code Editor or Result */}
      <div style={{ flex: '0 0 100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {output && (
          <div style={{ paddingTop: '30px' }}>
            <Result result={output} />
            {output.status && output.status.id === 3 && (
              <div className="flex items-center">
                <button
                  onClick={handleRestart}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                >
                  Restart
                </button>
                <div className="ml-auto">
                  <button
                    onClick={handleNextProblem}
                    className={`flex items-center gap-2 px-6 py-2 rounded text-white transition bg-blue-500 hover:bg-blue-600`}
                  >
                    Next Problem
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {(output===null || (output.status && output.status.id !== 3)) && (
          <>
            {/* Language Tabs */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Your Solution</h2>
              <div className="flex space-x-2 border-b mb-4">
                {supportedLanguages.map(({label, value}) => (
                  <button
                    key={value}
                    onClick={() => setSelectedLang(value)}
                    className={`px-4 py-2 -mb-px font-medium ${
                      selectedLang===value
                        ? 'border-b-4 border-blue-500 text-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Editor Wrapper */}
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <Suspense fallback={
                  <div className="p-6 text-center text-gray-500">Loading editor…</div>
                }>
                  <Editor
                    height="400px"
                    language={selectedLang}
                    value={codes[selectedLang]}
                    onChange={handleCodeChange}
                    theme="vs-light"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </Suspense>
              </div>
            </section>
              {/* Submit + Restart */}
              <div className="flex items-center">
                <button
                  onClick={handleRestart}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                >
                  Restart
                </button>
                <div className="ml-auto">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`flex items-center gap-2 px-6 py-2 rounded text-white transition
                      ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                    `}
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Running…
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
          </>
        )} 
      </div>
    </div>
  );
}

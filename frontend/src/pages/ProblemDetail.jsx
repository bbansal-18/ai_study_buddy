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
 *   - fetchProblem(id): Promise<Object>
 *   - loadOrGenerateDraft(id, lang, problem): string
 *   - saveDraft(id, lang, code): void
 *   - clearAllDrafts(id): void
 *   - submitSolution(id, lang, userCode): Promise<Object>
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
  { label: 'Java',     value: 'java'   },
  { label: 'C',        value: 'c'      },
  { label: 'C++',      value: 'cpp'    },
  // { label: 'SML',      value: 'sml'    }, // TODO: enable SML support
];

/**
 * Fetch problem details by ID.
 *
 * @param {string} id - Problem identifier
 * @returns {Promise<Object>} Resolves with problem object or rejects on error
 */
async function fetchProblem(id) {
  const res = await fetch(`http://localhost:5050/practice/problems/${id}`);
  if (!res.ok) throw new Error(`Problem ${id} not found`);
  return res.json();
}

/**
 * Load saved draft from localStorage or generate stub if none.
 *
 * @param {string} id       - Problem identifier
 * @param {string} lang     - Selected language code
 * @param {Object|null} problem - Problem spec for stub generation
 * @returns {string}         Draft code or boilerplate stub
 */
function loadOrGenerateDraft(id, lang, problem) {
  const key = `draft-${id}-${lang}`;
  const saved = localStorage.getItem(key);
  if (saved) return saved;
  if (problem) {
    return generateBoilerplate({
      function: problem.function,
      inputs: problem.inputs,
      returnType: problem.return,
      language: lang
    });
  }
  return '';
}

/**
 * Persist a code draft to localStorage.
 *
 * @param {string} id    - Problem identifier
 * @param {string} lang  - Language code
 * @param {string} code  - Current editor content
 */
function saveDraft(id, lang, code) {
  if (code) {
    localStorage.setItem(`draft-${id}-${lang}`, code);
  }
}

/**
 * Clear all drafts for a problem and regenerate stubs.
 *
 * @param {string} id      - Problem identifier
 * @param {Object} problem - Problem spec for stub generation
 * @returns {Object}       New codes object keyed by language
 */
function clearAllDrafts(id, problem) {
  const fresh = {};
  supportedLanguages.forEach(({ value }) => {
    localStorage.removeItem(`draft-${id}-${value}`);
    fresh[value] = generateBoilerplate({
      function: problem.function,
      inputs: problem.inputs,
      returnType: problem.return,
      language: value
    });
  });
  return fresh;
}

/**
 * Submit user code and wrapper to the validation API.
 *
 * @param {string} id        - Problem identifier
 * @param {string} lang      - Language code
 * @param {string} userCode  - User-written code
 * @returns {Promise<Object>} Resolves with validation result object
 */
async function submitSolution(id, lang, userCode) {
  const wrapRes = await fetch(
    `http://localhost:5050/practice/problems/${id}/solution/${lang}`
  );
  if (!wrapRes.ok) throw new Error('Failed to load wrapper');
  const { wrapper } = await wrapRes.json();
  const { result } = await ValidateCode(userCode, wrapper, lang);
  return result;
}

/**
 * ProblemDetail component
 *
 * Renders problem statement, sample I/O, code editor, and result display.
 * Manages loading, drafts, submission, and restart flows.
 *
 * @returns {JSX.Element} Problem solving UI for selected problem
 */
export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [codes, setCodes] = useState({});
  const [selectedLang, setSelectedLang] = useState('python');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Initial fetch and stub generation
  useEffect(() => {
    fetchProblem(id)
      .then(data => {
        setProblem(data);
        const initial = {};
        supportedLanguages.forEach(({ value }) => {
          initial[value] = generateBoilerplate({
            function: data.function,
            inputs: data.inputs,
            returnType: data.return,
            language: value
          });
        });
        setCodes(initial);
      })
      .catch(() => navigate('/notfound'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Load draft or stub when problem or language changes
  useEffect(() => {
    if (problem) {
      const draft = loadOrGenerateDraft(id, selectedLang, problem);
      setCodes(prev => ({ ...prev, [selectedLang]: draft }));
    }
  }, [problem, selectedLang, id]);

  // Save draft on code change
  useEffect(() => {
    saveDraft(id, selectedLang, codes[selectedLang]);
  }, [codes, selectedLang, id]);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Problem metadata */}
      <h1 className="text-3xl font-bold">{problem.title}</h1>
      {/* ... rest of JSX structure ... */}
    </div>
  );
}

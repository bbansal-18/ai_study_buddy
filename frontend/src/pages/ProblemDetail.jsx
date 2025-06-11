// src/pages/ProblemDetail.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';

// Lazy-load Monaco Editor
const Editor = React.lazy(() => import('@monaco-editor/react'));

const supportedLanguages = [
  { label: 'Python',      value: 'python' },
  { label: 'JavaScript',  value: 'javascript' },
  { label: 'Java',        value: 'java' },
  { label: 'C',           value: 'c' },
  { label: 'C++',         value: 'cpp' },
  { label: 'SML',         value: 'sml' },
];

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // track code for each language
  const [codes, setCodes] = useState(
    supportedLanguages.reduce((acc, lang) => {
      acc[lang.value] = '';
      return acc;
    }, {})
  );
  const [selectedLang, setSelectedLang] = useState('python');

  // localStorage key for current problem + language
  const storageKey = `draft-${id}-${selectedLang}`;

  // 1) LOAD: try storage first, then fallback to boilerplate
useEffect(() => {
  const saved = localStorage.getItem(storageKey)
  if (saved !== null) {
    setCodes(prev => ({ ...prev, [selectedLang]: saved }))
  } else if (problem?.boilerplate?.[selectedLang]) {
    setCodes(prev => ({ ...prev, [selectedLang]: problem.boilerplate[selectedLang] }))
  }
}, [problem, selectedLang, storageKey])

// 2) SAVE: only persist non‐empty buffers
useEffect(() => {
  const current = codes[selectedLang];
  if (current && current.length > 0) {
    localStorage.setItem(storageKey, current);
  }
}, [codes, storageKey, selectedLang]);

  // fetch problem, then seed codes with boilerplate
  useEffect(() => {
    fetch(`http://localhost:5050/practice/problems/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Problem ${id} not found`);
        return res.json();
      })
      .then(data => {
        setProblem(data);
        if (data.boilerplate) {
          setCodes(prev => ({ ...prev, ...data.boilerplate }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Loading problem…</p>
    </div>
  );
  if (error) return (
    <div className="p-6">
      <p className="text-red-500">Error: {error}</p>
    </div>
  );

  const formatWithLineBreaks = text => text.replace(/; /g, ';\n');
  const handleCodeChange = value => {
    setCodes(prev => ({ ...prev, [selectedLang]: value || '' }));
  };

  const handleRestart = () => {
    if (
      window.confirm(
        "Are you sure you want to restart? This will delete all your saved drafts for this problem."
      )
    ) {
      // remove every draft for this problem
      supportedLanguages.forEach(({ value }) => {
        localStorage.removeItem(`draft-${id}-${value}`);
      });

      // reset codes in state back to boilerplate (or empty if none)
      setCodes(prev => {
        const fresh = {};
        supportedLanguages.forEach(({ value }) => {
          fresh[value] =
            problem.boilerplate?.[value] != null
              ? problem.boilerplate[value]
              : "";
        });
        return fresh;
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Title, Topic & Difficulty */}
      <h1 className="text-3xl font-bold">{problem.title}</h1>
      <div className="flex items-center space-x-4">
        <span className="uppercase text-sm text-gray-500">{problem.topic}</span>
        <span className={
          problem.difficulty === 'easy'      ? 'text-green-600 font-semibold' :
          problem.difficulty === 'moderate'  ? 'text-yellow-600 font-semibold' :
                                              'text-red-600 font-semibold'
        }>
          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
        </span>
      </div>

      {/* Statement & Goal */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Problem Statement</h2>
        <p className="whitespace-pre-wrap text-gray-800">{problem.statement}</p>
        <p className="mt-4 text-gray-700">
          Goal: write the function{' '}
          <code className="bg-gray-200 px-2 rounded">{problem.function}</code>{' '}
          with return type{' '}
          <code className="bg-gray-200 px-2 rounded">{problem.return}</code>, making sure it takes in{' '}
          <code className="bg-gray-200 px-2 rounded">
            {problem.inputs.join(', ')}
          </code>{' '}
          in said order.
        </p>
      </section>

      {/* Samples */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-1">Sample Input</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {formatWithLineBreaks(problem.sample_input)}
          </pre>
        </div>
        <div>
          <h3 className="font-medium mb-1">Sample Output</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {formatWithLineBreaks(problem.sample_output)}
          </pre>
        </div>
      </section>

      {/* Language Selector + Editor */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Your Solution</h2>

        {/* dropdown */}
        <div className="mb-4">
          <label htmlFor="language" className="mr-2 font-medium">Language:</label>
          <select
            id="language"
            value={selectedLang}
            onChange={e => setSelectedLang(e.target.value)}
            className="border rounded p-1"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* editor */}
        <div className="border rounded overflow-hidden">
          <Suspense fallback={
            <div className="p-6 text-center text-gray-500">
              Loading editor…
            </div>
          }>
            <Editor
              height="300px"
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
      <div className="flex items-center w-full">
        {/* Restart on the left */}
        <button
          onClick={handleRestart}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Restart
        </button>

        {/* Push Submit to the right edge */}
        <div className="ml-auto">
          <button
            onClick={() =>
              console.log('Submit code for', id, selectedLang, codes[selectedLang])
            }
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    
  );
}

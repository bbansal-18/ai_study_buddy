// src/pages/ProblemDetail.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { generateBoilerplate } from '../components/boilerplateGenerator';

const Editor = React.lazy(() => import('@monaco-editor/react'));

const supportedLanguages = [
  { label: 'Python',     value: 'python' },
  { label: 'Java',       value: 'java' },
  { label: 'C',          value: 'c'    },
  { label: 'C++',        value: 'cpp'  },
  { label: 'SML',        value: 'sml'  },
];

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codes, setCodes] = useState(
    supportedLanguages.reduce((acc, {value}) => ({ ...acc, [value]: '' }), {})
  );
  const [selectedLang, setSelectedLang] = useState('python');
  const storageKey = `draft-${id}-${selectedLang}`;

  // LOAD draft or generated stub
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved != null) {
      setCodes(c => ({ ...c, [selectedLang]: saved }));
    } else if (problem) {
      const stub = generateBoilerplate({
        function: problem.function,
        inputs: problem.inputs,
        returnType: problem.return,
        language: selectedLang
      });
      setCodes(c => ({ ...c, [selectedLang]: stub }));
    }
  }, [problem, selectedLang, storageKey]);

  // SAVE non-empty drafts
  useEffect(() => {
    const cur = codes[selectedLang];
    if (cur && cur.length > 0) {
      localStorage.setItem(storageKey, cur);
    }
  }, [codes, storageKey, selectedLang]);

  // Fetch problem + seed all stubs
  useEffect(() => {
    fetch(`http://localhost:5050/practice/problems/${id}`)
      .then(r => {
        if (!r.ok) throw new Error(`Problem ${id} not found`);
        return r.json();
      })
      .then(data => {
        setProblem(data);
        const initial = {};
        supportedLanguages.forEach(({value}) => {
          initial[value] = generateBoilerplate({
            function: data.function,
            inputs: data.inputs,
            returnType: data.return,
            language: value
          });
        });
        setCodes(initial);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-full"><p className="text-gray-500">Loading…</p></div>;
  if (error)   return <div className="p-6"><p className="text-red-500">Error: {error}</p></div>;

  const formatWithLineBreaks = txt => txt.replace(/; /g, ';\n');
  const handleCodeChange = v => setCodes(c => ({ ...c, [selectedLang]: v || '' }));

  const handleRestart = () => {
    if (window.confirm("Restart and clear all drafts for this problem?")) {
      supportedLanguages.forEach(({value}) =>
        localStorage.removeItem(`draft-${id}-${value}`)
      );
      // reset all stubs
      const fresh = {};
      supportedLanguages.forEach(({value}) => {
        fresh[value] = generateBoilerplate({
          function: problem.function,
          inputs: problem.inputs,
          returnType: problem.return,
          language: value
        });
      });
      setCodes(fresh);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Title & Meta */}
      <h1 className="text-3xl font-bold">{problem.title}</h1>
      <div className="flex items-center space-x-4">
        <span className="uppercase text-sm text-gray-500">{problem.topic}</span>
        <span className={
          problem.difficulty==='easy'      ? 'text-green-600 font-semibold'
          : problem.difficulty==='moderate'? 'text-yellow-600 font-semibold'
          : 'text-red-600 font-semibold'
        }>
          {problem.difficulty.charAt(0).toUpperCase()+problem.difficulty.slice(1)}
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
          <code className="bg-gray-200 px-2 rounded">{problem.return}</code>
          {problem.inputs.length > 0 && (
            <>, taking in{' '}
            <code className="bg-gray-200 px-2 rounded">
              {problem.inputs.join(', ')}
            </code>{' '}in that order.</>
          )}
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
            onClick={() => console.log('Submit', id, selectedLang, codes[selectedLang])}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

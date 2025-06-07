import React, { useState } from 'react';

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      // Step 1: Call /parse
      const parseRes = await fetch('http://localhost:5050/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (!parseRes.ok) throw new Error('Failed to parse query');
      const parseData = await parseRes.json();

      // Step 2: Call /chat
      const chatRes = await fetch('http://localhost:5050/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: parseData.topic,
          task: parseData.task,
          query
        })
      });

      if (!chatRes.ok) throw new Error('Failed to fetch chat response');
      const chatData = await chatRes.json();

      setResponse(chatData);
    } catch (err) {
      setResponse({ error: err.message });
    }

    setLoading(false);
    setQuery('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 bg-white rounded shadow">
        {loading ? (
          <p className="text-gray-500 italic">Processing...</p>
        ) : response ? (
          response.error ? (
            <p className="text-red-500">Error: {response.error}</p>
          ) : (
            <pre>{JSON.stringify(response, null, 2)}</pre>
          )
        ) : (
          <p className="text-gray-500">Ask me anything...</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 mr-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

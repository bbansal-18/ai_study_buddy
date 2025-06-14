// formatChatResponse.jsx
import React from 'react';
import { TextWithInlineQuotes } from './TextWithInlineQuotes';

/**
 * Splits a response string into an array of React nodes,
 * converting fenced code blocks and inline-quoted text.
 *
 * @param {string} text  The raw response string (may contain ```lang ... ``` blocks).
 * @returns {React.ReactNode[]}  Array of <p> and <pre><code> nodes ready to render.
 */
export function formatChatResponse(text) {
  const nodes = [];
  let lastIndex = 0;

  // Regex to find fenced code blocks: ```lang\n...```
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [fullMatch, lang = '', codeContent] = match;
    const idx = match.index;

    // 1) Push any plain text before this code block
    if (idx > lastIndex) {
      const plain = text.slice(lastIndex, idx);
      nodes.push(<TextWithInlineQuotes key={lastIndex} text={plain} />);
    }

    // 2) Push the code block
    nodes.push(
      <pre key={idx} className="my-4 overflow-auto bg-gray-200 rounded">
        <div className="px-2 py-1 bg-gray-800 text-xs text-gray-200">
          {lang || 'plaintext'}
        </div>
        <code className={`block p-4 language-${lang} text-gray-800`}>
          {codeContent}
        </code>
      </pre>
    );

    lastIndex = idx + fullMatch.length;
  }

  // 3) Push any trailing text after the last code block
  if (lastIndex < text.length) {
    const tail = text.slice(lastIndex);
    nodes.push(<TextWithInlineQuotes key={lastIndex} text={tail} />);
  }

  return nodes;
}

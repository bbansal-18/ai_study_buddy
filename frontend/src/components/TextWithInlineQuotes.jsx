//components/TextWithInlineQuotes.jsx
import React from 'react';

/**
 * Helper component to wrap inline single-quoted segments in a styled <span>.
 *
 * Splits the text on /'([^']+)'/ and wraps each 'quoted' part.
 */
export function TextWithInlineQuotes({ text }) {
  const nodes = [];
  let lastIndex = 0;

  // Regex for inline code spans: `code here`
  const codeSpanRe = /`([^`]+)`/g;
  let match;

  /**
   * Splits on single‐quoted segments and wraps those in a <span>.
   */
  function splitSingleQuotes(str) {
    const out = [];
    let last = 0;
    const re = /'([^']+)'/g;
    let m, idx = 0;

    while ((m = re.exec(str)) !== null) {
      const [full, quoted] = m;
      const start = m.index;

      // text before the quote
      if (start > last) {
        out.push(str.slice(last, start));
      }

      // the quoted span
      out.push(
        <span
          key={`q-${idx}`}
          className="bg-gray-300 text-grey-900 px-2 rounded"
        >
          {quoted}
        </span>
      );

      last = start + full.length;
      idx++;
    }

    // any remaining text
    if (last < str.length) {
      out.push(str.slice(last));
    }

    return out;
  }


  while ((match = codeSpanRe.exec(text)) !== null) {
    const [full, code] = match;
    const idx = match.index;

    // push preceding text
    if (idx > lastIndex) {
      nodes.push(text.slice(lastIndex, idx));
    }

    // push the code span
    nodes.push(
      <code
        key={`code-${idx}`}
        className="bg-gray-300 text-grey-900 font-mono px-2 rounded"
      >
        {code}
      </code>
    );

    lastIndex = idx + full.length;
  }

  // trailing text after last backtick code span
  const tail = text.slice(lastIndex);
  if (tail) {
    nodes.push(...splitSingleQuotes(tail));
  }

  return <p className="my-2">{nodes}</p>;
}

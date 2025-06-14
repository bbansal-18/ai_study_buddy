// /boilerplateGenerator.js

/**
 * Given a problem signature, returns a boilerplate stub in the requested language.
 * 
 * @param {Object} spec
 * @param {string} spec.function   - the function name
 * @param {string[]} spec.inputs   - array of "name: type" strings
 * @param {string} spec.returnType - the return type
 * @param {string} spec.language   - one of 'python','javascript','java','c','cpp','sml'
 * @returns {string}               - the complete boilerplate, or '' if error
 */
export function generateBoilerplate({ function: fn, inputs, returnType, language }) {
  // parse inputs into [{ name, type }]
  const params = inputs.map(str => {
    const [name, type] = str.split(':').map(s => s.trim());
    return { name, type };
  });

  // helper: map a spec-type to lang-specific
  function mapType(type) {
    // basic builtin mapping
    const base = {
      int:    { python: 'int',        javascript: '',       java: 'int',      c: 'int',       cpp: 'int',       sml: 'int' },
      str:    { python: 'str',        javascript: '',       java: 'String',   c: 'char*',    cpp: 'std::string', sml: 'string' },
      'list': { python: 'list',       javascript: '',       java: 'String[]', c: 'int*',     cpp: 'std::vector', sml: '' },
    };
    // list[...] case
    const listMatch = type.match(/^list\[(.+)\]$/);
    if (listMatch) {
      const inner = listMatch[1].trim();
      const m = mapType(inner);
      if (!m) return null;
      switch (language) {
        case 'python':     return `list[${m}]`;
        case 'javascript': return '';
        case 'java':       return `${m}[]`;
        case 'c':          return `${m}*`;
        case 'cpp':        return `std::vector<${m}>`;
        case 'sml':        return `list`; 
      }
    }
    // direct builtin or struct name
    if (base[type]) {
      return base[type][language];
    }
    // assume user-defined struct/class name
    // use same name in Java/C/C++/JS, Python/SML no hint
    if (['java','c','cpp','javascript'].includes(language)) {
      return type;
    }
    if (language === 'python') return type;
    if (language === 'sml') return type;
    return null;
  }

  // build parameter list or bail
  const mappedParams = params.map(({ name, type }) => {
    const mt = mapType(type);
    return mt == null ? null : { name, type: mt };
  });
  if (mappedParams.includes(null)) return '';

  // build boilerplate per language
  switch (language) {
    case 'python': {
      const sig = mappedParams.map(p => `${p.name}: ${p.type}`).join(', ');
      return [
        `def ${fn}(${sig}) -> ${returnType}:`,
        `    # TODO: implement`,
        `    raise NotImplementedError()`,
      ].join('\n');
    }
    case 'javascript': {
      const sig = mappedParams.map(p => p.name).join(', ');
      return [
        `// TODO: implement ${fn}`,
        `function ${fn}(${sig}) {`,
        `  // ...`,
        `  throw new Error('Not implemented');`,
        `}`,
      ].join('\n');
    }
    case 'java': {
      const sig = mappedParams.map(p => `${p.type} ${p.name}`).join(', ');
      // map returnType
      const ret = mapType(returnType);
      if (ret == null) return '';
      return [
        `public ${ret} ${fn}(${sig}) {`,
        `    // TODO: implement`,
        `    throw new UnsupportedOperationException("Not implemented");`,
        `}`,
      ].join('\n');
    }
    case 'c': {
      const sig = mappedParams.map(p => `${p.type} ${p.name}`).join(', ');
      const ret = mapType(returnType);
      if (ret == null) return '';
      return [
        `#include <stdio.h>`,
        ``,
        `${ret} ${fn}(${sig}) {`,
        `    // TODO: implement`,
        `    // not implemented`,
        `    return ((${ret})0);`,
        `}`,
      ].join('\n');
    }
    case 'cpp': {
      const sig = mappedParams.map(p => `${p.type} ${p.name}`).join(', ');
      const ret = mapType(returnType);
      if (ret == null) return '';
      return [
        `#include <iostream>`,
        `#include <vector>`,
        ``,
        `${ret} ${fn}(${sig}) {`,
        `    // TODO: implement`,
        `    throw std::runtime_error("Not implemented");`,
        `}`,
      ].join('\n');
    }
    case 'sml': {
      const sig = mappedParams.map(p => `${p.name}: ${p.type}`).join(' * ');
      const ret = mapType(returnType);
      if (ret == null) return '';
      return [
        `fun ${fn} (${sig}) : ${ret} =`,
        `    (* TODO: implement *)`,
        `    raise Fail "Not implemented"`,
      ].join('\n');
    }
    default:
      return '';
  }
}

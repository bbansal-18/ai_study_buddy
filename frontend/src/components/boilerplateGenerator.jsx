/**
 * components/boilerplateGenerator.js
 *
 * Generates boilerplate code stubs for various programming languages
 * based on a provided function signature specification.
 *
 * Exported Functions:
 *   - generateBoilerplate(spec): string
 *
 * Supported Languages:
 *   python, java, c, cpp, sml
 * 
 * @author bbansal-18
 */

/**
 * Map a generic type specifier to a language-specific type.
 *
 * @param {string} typeStr - The type string (e.g., 'int', 'list[int]', 'MyClass').
 * @param {string} language - Target language key ('python','java','c','cpp','sml').
 * @returns {string|null}   - Mapped type string or null on failure.
 */
function mapType(typeStr, language) {
  const baseTypes = {
    int:  { python: 'int',   java: 'int',         c: 'int',       cpp: 'int',           sml: 'int' },
    str:  { python: 'str',   java: 'String',      c: 'char*',    cpp: 'std::string',   sml: 'string' },
    list: { python: 'list',  java: 'String[]',    c: 'int*',     cpp: 'std::vector',    sml: '' }
  };

  const listMatch = typeStr.match(/^list\[(.+)\]$/);
  if (listMatch) {
    const inner = listMatch[1].trim();
    const innerType = mapType(inner, language);
    if (!innerType) return null;
    switch (language) {
      case 'python': return `list[${innerType}]`;
      case 'java':   return `${innerType}[]`;
      case 'c':      return `${innerType}*`;
      case 'cpp':    return `std::vector<${innerType}>`;
      case 'sml':    return 'list';
      default:       return null;
    }
  }

  if (baseTypes[typeStr]) {
    return baseTypes[typeStr][language] || null;
  }

  // Fallback: assume user-defined type works in all remaining languages
  if (['python','java','c','cpp','sml'].includes(language)) {
    return typeStr;
  }

  return null;
}

/**
 * Parse input specifications into parameter objects.
 *
 * @param {string[]} inputs - Array of "name: type" strings.
 * @returns {{name: string, type: string}[]} - Parsed parameters.
 */
function parseParams(inputs) {
  return inputs.map(input => {
    const [name, type] = input.split(':').map(s => s.trim());
    return { name, type };
  });
}

/**
 * Generate a function boilerplate stub based on a specification.
 *
 * @param {Object} spec
 * @param {string} spec.function   - The name of the function.
 * @param {string[]} spec.inputs   - Parameter list as "name: type" strings.
 * @param {string} spec.returnType - The return type string.
 * @param {string} spec.language   - Target language ('python','java','c','cpp','sml').
 * @returns {string}               - Generated boilerplate or empty string on error.
 */
export function generateBoilerplate({ function: fn, inputs, returnType, language }) {
  const params = parseParams(inputs);
  const mapped = params.map(({ name, type }) => {
    const t = mapType(type, language);
    return t ? { name, type: t } : null;
  });
  if (mapped.includes(null)) return '';

  switch (language) {
    case 'python': {
      const sig = mapped.map(p => `${p.name}: ${p.type}`).join(', ');
      return [
        `def ${fn}(${sig}) -> ${returnType}:`,
        '    # TODO: implement',
        '    raise NotImplementedError()'
      ].join('\n');
    }
    case 'java': {
      const sig = mapped.map(p => `${p.type} ${p.name}`).join(', ');
      const ret = mapType(returnType, language);
      return ret ? [
        `public ${ret} ${fn}(${sig}) {`,
        '    // TODO: implement',
        '    throw new UnsupportedOperationException("Not implemented");',
        '}'
      ].join('\n') : '';
    }
    case 'c': {
      const sig = mapped.map(p => `${p.type} ${p.name}`).join(', ');
      const ret = mapType(returnType, language);
      return ret ? [
        '#include <stdio.h>',
        `${ret} ${fn}(${sig}) {`,
        '    // TODO: implement',
        '    return ((' + ret + ')0);',
        '}'
      ].join('\n') : '';
    }
    case 'cpp': {
      const sig = mapped.map(p => `${p.type} ${p.name}`).join(', ');
      const ret = mapType(returnType, language);
      return ret ? [
        '#include <iostream>',
        '#include <vector>',
        `${ret} ${fn}(${sig}) {`,
        '    // TODO: implement',
        '    throw std::runtime_error("Not implemented");',
        '}'
      ].join('\n') : '';
    }
    case 'sml': {
      const sig = mapped.map(p => `${p.name}: ${p.type}`).join(' * ');
      const ret = mapType(returnType, language);
      return ret ? [
        `fun ${fn} (${sig}) : ${ret} =`,
        '    (* TODO: implement *)',
        '    raise Fail "Not implemented"'
      ].join('\n') : '';
    }
    default:
      return '';
  }
}

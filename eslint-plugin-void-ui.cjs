/**
 * eslint-plugin-void-ui
 * Local ESLint plugin for void-ui code conventions.
 */

'use strict'

// ─── no-single-line-block ─────────────────────────────────────────────────────
// Block body must not be on a single line.
// Bad:  if (!isOpen) { return }
// Good: if (!isOpen) {
//         return
//       }
const noSingleLineBlock = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    messages: {
      singleLine: 'Block body must not be on a single line. Use multiple lines.',
    },
  },
  create(context) {
    const src = context.getSourceCode()

    function check(node) {
      const body = node.consequent ?? node.body

      if (!body || body.type !== 'BlockStatement') {
        return
      }

      const open = src.getFirstToken(body)
      const close = src.getLastToken(body)

      if (open.loc.start.line !== close.loc.start.line) {
        return
      }

      context.report({
        node: body,
        messageId: 'singleLine',
        fix(fixer) {
          const inner = src.getTokensBetween(open, close)

          if (inner.length === 0) {
            return null
          }

          // Use the parent node's indentation (column of the if/for/while keyword)
          const parentIndent = ' '.repeat(node.loc.start.column)
          const bodyIndent = parentIndent + '  '
          const innerSource = src.getText().slice(inner[0].range[0], inner[inner.length - 1].range[1])

          return fixer.replaceText(body, `{\n${bodyIndent}${innerSource}\n${parentIndent}}`)
        },
      })
    }

    return {
      IfStatement: check,
      ForStatement: check,
      ForInStatement: check,
      ForOfStatement: check,
      WhileStatement: check,
    }
  },
}

// ─── no-short-callback-params ─────────────────────────────────────────────────
// Callback/arrow function parameters must be descriptive (min 3 chars).
// Bad:  arr.map(e => e.name)   arr.filter((p) => p.active)
// Good: arr.map(item => item.name)   arr.filter((product) => product.active)
const noShortCallbackParams = {
  meta: {
    type: 'suggestion',
    fixable: null,
    messages: {
      shortParam: 'Parameter "{{name}}" is too short. Use a descriptive name (min 3 characters).',
    },
  },
  create(context) {
    function checkParams(params) {
      for (const param of params) {
        if (param.type === 'Identifier' && param.name.length < 3 && param.name !== '_') {
          context.report({
            node: param,
            messageId: 'shortParam',
            data: { name: param.name },
          })
        }

        if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
          if (param.left.name.length < 3 && param.left.name !== '_') {
            context.report({
              node: param.left,
              messageId: 'shortParam',
              data: { name: param.left.name },
            })
          }
        }
      }
    }

    return {
      ArrowFunctionExpression(node) {
        checkParams(node.params)
      },
      FunctionExpression(node) {
        checkParams(node.params)
      },
    }
  },
}

// ─── no-react-named-imports ───────────────────────────────────────────────────
// React hooks and APIs must be accessed via namespace import, not named imports.
// Bad:  import { useState, useEffect } from 'react'
// Good: import * as React from 'react'  →  React.useState, React.useEffect
const noReactNamedImports = {
  meta: {
    type: 'suggestion',
    fixable: null,
    messages: {
      namedImport: 'Named React import "{{name}}" is not allowed. Use "import * as React from \'react\'" and access as React.{{name}}.',
    },
  },
  create(context) {
    // Hooks and APIs that must go through the React namespace
    const REACT_NAMESPACE_APIS = new Set([
      'useState', 'useEffect', 'useRef', 'useCallback', 'useMemo',
      'useContext', 'useReducer', 'useId', 'useLayoutEffect',
      'useImperativeHandle', 'useDebugValue', 'useDeferredValue',
      'useInsertionEffect', 'useSyncExternalStore', 'useTransition',
      'createContext', 'createRef', 'forwardRef', 'memo', 'lazy',
      'Suspense', 'Fragment', 'StrictMode', 'Children', 'cloneElement',
      'createElement', 'isValidElement',
    ])

    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'react') {
          return
        }

        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            REACT_NAMESPACE_APIS.has(specifier.imported.name)
          ) {
            context.report({
              node: specifier,
              messageId: 'namedImport',
              data: { name: specifier.imported.name },
            })
          }
        }
      },
    }
  },
}

module.exports = {
  rules: {
    'no-single-line-block': noSingleLineBlock,
    'no-short-callback-params': noShortCallbackParams,
    'no-react-named-imports': noReactNamedImports,
  },
}

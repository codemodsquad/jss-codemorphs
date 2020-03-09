import {
  FileInfo,
  API,
  Options,
  ObjectProperty,
  ObjectExpression,
  Identifier,
  StringLiteral,
  NumericLiteral,
  ArrayExpression,
} from 'jscodeshift'
import j from 'jscodeshift'
import * as recast from 'recast'
import * as postcss from 'postcss'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import defaultUnits from './defaultUnits'
import {
  LiteralKind,
  IdentifierKind,
  ExpressionKind,
} from 'ast-types/gen/kinds'
import selectorParser from 'postcss-selector-parser'

export default function cssToJss(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const selectionStart = options.selectionStart
    ? parseInt(options.selectionStart)
    : 0
  const selectionEnd = options.selectionEnd
    ? parseInt(options.selectionEnd)
    : fileInfo.source.length

  const before = fileInfo.source.substring(0, selectionStart)
  const rawCss = fileInfo.source.substring(selectionStart, selectionEnd)
  const after = fileInfo.source.substring(selectionEnd)
  const root = postcss.parse(rawCss)

  const converted = convertNodes(root.nodes || [])

  convertSelectors(converted)
  const animationNames = collectAnimationNames(root.nodes || [])
  convertAnimationNames(converted, animationNames)
  convertFallbacks(converted)

  const rawConverted = converted.properties
    .map(p => recast.prettyPrint(p).code)
    .join(',\n')

  return `${before}${rawConverted}${after}`
}

export function collectAnimationNames(nodes: postcss.Node[]): Set<string> {
  const names: Set<string> = new Set()

  for (const node of nodes) {
    if (node.type !== 'atrule') continue
    const { name, params } = node
    if (name !== 'keyframes') continue
    const match = /^\S+/.exec(params)
    if (match) names.add(match[0])
  }
  return names
}

const getRawKey = (
  key: LiteralKind | IdentifierKind | ExpressionKind
): string | null =>
  key.type === 'Identifier'
    ? key.name
    : key.type === 'StringLiteral'
    ? key.value
    : null

const processDeep = (iteratee: (node: ObjectExpression) => any) => (
  node: ObjectExpression
): void => {
  const handle = (node: ObjectExpression): void => {
    iteratee(node)
    for (const prop of node.properties) {
      if (prop.type !== 'ObjectProperty') continue
      if (prop.value.type === 'ObjectExpression') handle(prop.value)
    }
  }
  handle(node)
}

const baseSelectorParser = selectorParser()
const parseSelector = (selector: string): selectorParser.Root =>
  baseSelectorParser.astSync(selector)

export function splitGlobals(selector: string): [string | null, string | null] {
  const ast = parseSelector(selector)
  const locals: selectorParser.Node[] = []
  const globals: selectorParser.Node[] = []
  ast.each(node => {
    if (
      node.type === 'selector' &&
      node.first.type !== 'class' &&
      node.first.type !== 'nesting' &&
      (node.first.type !== 'tag' || !node.first.value.startsWith('@'))
    )
      globals.push(node)
    else locals.push(node)
  })
  return [
    locals.length
      ? selectorParser.root({ nodes: locals } as any).toString()
      : null,
    globals.length
      ? selectorParser.root({ nodes: globals } as any).toString()
      : null,
  ]
}

export function convertSelectors(root: ObjectExpression): void {
  const replacements: Map<string, string> = new Map()

  const processRootSelector = selectorParser(root => {
    if (root.length !== 1) return
    const { first } = root
    if (first?.type !== 'selector' || first.length !== 1) {
      return
    }
    if (first.first?.type !== 'class') return
    const className = first.first.value
    const replacement = camelCase(className)
    replacements.set(className, `$${replacement}`)
    first.first.replaceWith(selectorParser.tag({ value: replacement }))
  })

  const processSelector = selectorParser(root => {
    root.each(node => {
      if (node.type === 'selector' && node.at(0)?.value !== '&') {
        node.insertBefore(node.at(0), selectorParser.combinator({ value: ' ' }))
        node.insertBefore(node.at(0), selectorParser.nesting({}))
      }
    })
    root.walkClasses(classNode => {
      if (!classNode.value) return
      const replacement = replacements.get(classNode.value)
      if (replacement) {
        classNode.replaceWith(selectorParser.tag({ value: replacement }))
      }
    })
  })

  const processSelectorInMediaOrGlobal = selectorParser(root => {
    root.walkClasses(classNode => {
      if (!classNode.value) return
      const replacement = replacements.get(classNode.value)
      if (replacement) {
        classNode.replaceWith(selectorParser.tag({ value: replacement }))
      }
    })
  })

  const processNode = (
    parentKey: string | null,
    node: ObjectExpression
  ): void => {
    const globals: ObjectProperty[] = []
    if (!parentKey || !/^@(keyframes|global)/.test(parentKey)) {
      node.properties = node.properties.filter(
        (prop: ObjectExpression['properties'][0]): boolean => {
          if (prop.type !== 'ObjectProperty') return true
          const { value } = prop
          const key = getRawKey(prop.key)
          if (!key || value.type !== 'ObjectExpression') return true
          const [localSelector, globalSelector] = splitGlobals(key)
          if (!parentKey) {
            if (key.startsWith('@')) return true
            if (localSelector) {
              const newKey = processRootSelector.processSync(localSelector)
              if (newKey !== key) prop.key = objectPropertyKey(newKey)
            }
          } else {
            if (localSelector) {
              const replaced =
                parentKey.startsWith('@media') || parentKey === '@global'
                  ? processSelectorInMediaOrGlobal.processSync(localSelector)
                  : processSelector.processSync(localSelector)
              if (replaced !== key) {
                prop.key = objectPropertyKey(replaced)
              }
            }
          }
          if (globalSelector) {
            globals.push(
              j.objectProperty(
                objectPropertyKey(
                  processSelectorInMediaOrGlobal.processSync(globalSelector)
                ),
                value
              )
            )
          }
          return localSelector != null
        }
      )
    }
    if (globals.length) {
      node.properties.push(
        j.objectProperty(
          j.stringLiteral('@global'),
          j.objectExpression(globals)
        )
      )
    }
    for (const prop of node.properties) {
      if (prop.type !== 'ObjectProperty') continue
      const { value } = prop
      const key = getRawKey(prop.key)
      if (!key || value.type !== 'ObjectExpression') continue
      processNode(key, value)
    }
  }

  processNode(null, root)
}

export function convertAnimationNames(
  root: ObjectExpression,
  animationNames: Set<string>
): void {
  processDeep((node: ObjectExpression): void => {
    for (const prop of node.properties) {
      if (prop.type !== 'ObjectProperty') continue
      const { value } = prop
      switch (getRawKey(prop.key)) {
        case 'animationName': {
          if (
            value.type === 'StringLiteral' &&
            animationNames.has(value.value)
          ) {
            value.value = `$${value.value}`
          }
          break
        }
        case 'animation': {
          if (value.type === 'StringLiteral') {
            value.value = value.value.replace(/\S+/g, word =>
              animationNames.has(word) ? `$${word}` : word
            )
          }
        }
      }
    }
  })(root)
}

const convertFallbacks = processDeep((node: ObjectExpression): void => {
  const { properties } = node
  const fallbacks: ObjectExpression[] = []
  const encountered: Set<string> = new Set()
  for (let i = properties.length - 1; i >= 0; i--) {
    const prop = properties[i]
    if (prop.type !== 'ObjectProperty') continue
    const key = getRawKey(prop.key)
    if (!key) continue
    if (encountered.has(key)) {
      fallbacks.unshift(j.objectExpression([prop]))
      properties.splice(i, 1)
    } else {
      encountered.add(key)
    }
  }
  if (fallbacks.length)
    properties.push(
      j.objectProperty(j.identifier('fallbacks'), j.arrayExpression(fallbacks))
    )
})

export function convertNodes(nodes: postcss.Node[]): ObjectExpression {
  const properties: ObjectProperty[] = []

  for (const node of nodes) {
    switch (node.type) {
      case 'atrule':
        properties.push(convertAtRule(node))
        break
      case 'rule':
        properties.push(convertRule(node))
        break
      case 'decl':
        properties.push(convertDecl(node))
        break
    }
  }

  return j.objectExpression(properties)
}

function convertAtRule(atrule: postcss.AtRule): ObjectProperty {
  const { name, params, nodes } = atrule
  return j.objectProperty(
    j.stringLiteral(params ? `@${name} ${params}` : `@${name}`),
    convertNodes(nodes || [])
  )
}

function convertRule(rule: postcss.Rule): ObjectProperty {
  const { selector, nodes } = rule
  const key = convertSelector(selector)
  const value = convertNodes(nodes || [])

  return j.objectProperty(key, value)
}

function convertSelector(selector: string): Identifier | StringLiteral {
  return j.stringLiteral(selector)
}

const objectPropertyKey = (s: string): Identifier | StringLiteral =>
  /^[_a-z][_a-z0-9]*$/i.test(s) ? j.identifier(s) : j.stringLiteral(s)

function convertDeclValue(value: string): string {
  value = value
    .replace(/^'|'$/g, '')
    .replace(/^|$/g, '"')
    .replace(/\\\\\\n/g, '\\n')
    .replace(/url\('([^)]+)'\)/g, 'url($1)')
  return JSON.parse(value)
}

function convertDecl(decl: postcss.Declaration): ObjectProperty {
  const key = convertProp(decl.prop)
  const declValue = convertDeclValue(decl.value)
  let value: StringLiteral | NumericLiteral | ArrayExpression
  if (decl.prop === 'content') {
    value = j.stringLiteral(JSON.stringify(declValue))
  } else {
    const defaultUnit = defaultUnits[decl.prop]
    value = j.stringLiteral(declValue)
    if (defaultUnit) {
      const match = new RegExp(`^(\\d+)${defaultUnit}$`).exec(declValue)
      if (match) value = j.numericLiteral(parseFloat(match[1]))
    }
  }
  if (decl.important) {
    value = j.arrayExpression([
      j.arrayExpression([value]),
      j.stringLiteral('!important'),
    ])
  }
  return j.objectProperty(key, value)
}

function convertProp(prop: string): Identifier | StringLiteral {
  const result = camelCase(prop)
  return objectPropertyKey(/^-(?!ms-)/.test(prop) ? upperFirst(result) : result)
}

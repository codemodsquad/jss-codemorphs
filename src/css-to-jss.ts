import {
  FileInfo,
  API,
  Options,
  ObjectProperty,
  ObjectExpression,
  Identifier,
  StringLiteral,
  NumericLiteral,
} from 'jscodeshift'
import j from 'jscodeshift'
import * as recast from 'recast'
import * as postcss from 'postcss'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import defaultUnits from './defaultUnits'

module.exports = function example(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const selectionStart = parseInt(options.selectionStart)
  const selectionEnd = parseInt(options.selectionEnd)

  if (!Number.isFinite(selectionStart)) {
    throw new Error('options.selectionStart must be a number')
  }
  if (!Number.isFinite(selectionEnd)) {
    throw new Error('options.selectionEnd must be a number')
  }

  const before = fileInfo.source.substring(0, selectionStart)
  const rawCss = fileInfo.source.substring(selectionStart, selectionEnd)
  const after = fileInfo.source.substring(selectionEnd)
  const root = postcss.parse(rawCss)

  const converted = convertNodes(root.nodes || [])

  convertSelectors(converted)

  const rawConverted = converted.properties
    .map(p => recast.prettyPrint(p).code)
    .join(',\n')

  return `${before}${rawConverted}${after}`
}

export function convertSelectors(root: ObjectExpression): void {
  const replacements: Map<string, string> = new Map()
  for (const prop of root.properties) {
    if (prop.type !== 'ObjectProperty') continue
    const { key, value } = prop
    const rawKey =
      key.type === 'Identifier'
        ? key.name
        : key.type === 'StringLiteral'
        ? key.value
        : null
    if (!rawKey || value.type !== 'ObjectExpression') continue
    const match = /^\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)$/.exec(rawKey)
    if (match) {
      const replacement = camelCase(match[1])
      replacements.set(match[0], `$${replacement}`)
      prop.key = objectPropertyKey(replacement)
    }
  }

  const replaceDeep = (node: ObjectExpression): void => {
    for (const prop of node.properties) {
      if (prop.type !== 'ObjectProperty') continue
      const { key, value } = prop
      const rawKey =
        key.type === 'Identifier'
          ? key.name
          : key.type === 'StringLiteral'
          ? key.value
          : null
      if (value.type !== 'ObjectExpression') continue
      if (rawKey && !rawKey.startsWith('@')) {
        const replaced = rawKey.replace(
          /\.\S+/g,
          match => replacements.get(match) || match
        )
        if (replaced !== rawKey) {
          prop.key = objectPropertyKey(replaced)
        }
      }
      replaceDeep(value)
    }
  }
  replaceDeep(root)
}

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
    j.stringLiteral(`@${name} ${params}`),
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

function convertDecl(decl: postcss.Declaration): ObjectProperty {
  const key = convertProp(decl.prop)
  const defaultUnit = defaultUnits[decl.prop]
  let value: StringLiteral | NumericLiteral = j.stringLiteral(decl.value)
  if (defaultUnit) {
    const match = new RegExp(`^(\\d+)${defaultUnit}$`).exec(decl.value)
    if (match) value = j.numericLiteral(parseFloat(match[1]))
  }
  return j.objectProperty(key, value)
}

function convertProp(prop: string): Identifier | StringLiteral {
  const result = camelCase(prop)
  return objectPropertyKey(/^-(?!ms-)/.test(prop) ? upperFirst(result) : result)
}

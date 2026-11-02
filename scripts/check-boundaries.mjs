import ts from 'typescript'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
const root = resolve('src/packages')
const names = readdirSync(root)
const manifests = Object.fromEntries(
  names.map((n) => [
    n,
    JSON.parse(readFileSync(resolve(root, n, 'package.json'), 'utf8')),
  ]),
)
const graph = Object.fromEntries(names.map((n) => [n, new Set()]))
const errors = []
const owner = (file) => {
  const path = relative(root, file)
  return !path.startsWith('..') && names.includes(path.split('/')[0])
    ? path.split('/')[0]
    : null
}
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((x) =>
    x.name === 'node_modules' || x.name.startsWith('.')
      ? []
      : x.isDirectory()
        ? walk(resolve(dir, x.name))
        : [resolve(dir, x.name)],
  )
}
for (const file of [...walk(resolve('src')), ...walk(resolve('server'))].filter(
  (f) => /\.(ts|vue|mjs)$/.test(f),
)) {
  const source = readFileSync(file, 'utf8')
  const from = owner(file)
  const content = file.endsWith('.vue')
    ? [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
        .map((x) => x[1])
        .join('\n')
    : source
  const ast = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true)
  function check(spec) {
    if (spec.startsWith('@org/')) {
      const [name, ...tail] = spec.slice(5).split('/')
      const target = manifests[name]
      if (!target) {
        errors.push(`${file}: invalid export ${spec}`)
        return
      }
      const key = tail.length ? './' + tail.join('/') : '.'
      if (!(key in target.exports))
        errors.push(`${file}: private import ${spec}`)
      if (from && from !== name) {
        graph[from].add(name)
        if (!manifests[from].dependencies?.['@org/' + name])
          errors.push(`${file}: undeclared dependency ${spec}`)
      }
    } else if (
      spec.startsWith('.') ||
      spec.startsWith('~/') ||
      spec.startsWith('@/')
    ) {
      const target = owner(
        spec.startsWith('.')
          ? resolve(dirname(file), spec)
          : resolve('src', spec.slice(2)),
      )
      if (from && target !== from)
        errors.push(`${file}: cross-boundary relative/alias import ${spec}`)
    }
  }
  function visit(n) {
    if (
      (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) &&
      n.moduleSpecifier &&
      ts.isStringLiteral(n.moduleSpecifier)
    )
      check(n.moduleSpecifier.text)
    if (
      ts.isCallExpression(n) &&
      n.expression.kind === ts.SyntaxKind.ImportKeyword &&
      n.arguments[0] &&
      ts.isStringLiteral(n.arguments[0])
    )
      check(n.arguments[0].text)
    ts.forEachChild(n, visit)
  }
  visit(ast)
}
for (const [name, targets] of Object.entries(graph))
  for (const target of targets) {
    if (
      name === 'shared' ||
      (name === 'api-core' && target !== 'shared') ||
      (name === 'design-system' && !['shared'].includes(target))
    )
      errors.push(`${name} cannot depend on ${target}`)
  }
function visit(name, stack = []) {
  if (stack.includes(name)) {
    errors.push(`Cycle: ${[...stack, name].join(' -> ')}`)
    return
  }
  for (const next of graph[name]) visit(next, [...stack, name])
}
for (const name of names) {
  visit(name)
  for (const entry of Object.values(manifests[name].exports))
    if (!existsSync(resolve(root, name, entry)))
      errors.push(`${name}: missing export ${entry}`)
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`Package boundaries passed (${names.length} packages)`)

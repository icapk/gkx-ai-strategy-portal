import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
const root = fileURLToPath(new URL('..', import.meta.url))
const require = createRequire(import.meta.url)
const { build } = createRequire(require.resolve('vite/package.json'))('esbuild')
const output = path.join(root, '.local', 'verify-model.mjs')
await build({ entryPoints: [path.join(root, 'src/audit/model.ts')], outfile: output, bundle: true, format: 'esm', platform: 'node' })
const model = await import(pathToFileURL(output).href)
const raw = JSON.parse(fs.readFileSync(path.join(root, 'src/audit/requirements.json'), 'utf8'))
const assessments = JSON.parse(fs.readFileSync(path.join(root, 'src/audit/assessments.json'), 'utf8'))
const reviews = JSON.parse(fs.readFileSync(path.join(root, 'src/audit/requirementReviews.json'), 'utf8'))
const source = path.resolve(root, '..', raw.source)
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'), raw.sha256, 'Requirement source has changed')
const points = model.leaves.flatMap(l => l.points)
assert.equal(points.length, new Set(points.map(p => p.code)).size)
assert.equal(points.length, Object.keys(assessments).length)
assert.equal(points.length, raw.leaves.flatMap(l => l.points).length)
for (const leaf of model.leaves) {
  assert.ok(reviews[leaf.id], `Missing parent review ${leaf.id}`)
  for (const p of leaf.points) {
    assert.deepEqual(p.assessment, assessments[p.code], `Fallback detected ${p.code}`)
    assert.ok(p.assessment.reason.trim() && p.assessment.evidence.trim(), `Empty evidence: ${p.code}`)
    assert.ok(p.sourceText.includes(p.code) && p.sourceText.includes(p.title))
  }
}
// Exhaustive cross-scope union/intersection combinations, compared with a separate set computation.
const filters = Array.from({length:8}, (_,mask) => model.statuses.filter((_,bit) => mask & (1 << bit)))
for (const leaf of model.leaves) for (const global of filters) for (const level4 of filters) for (const level5 of filters) {
  const expected = leaf.points.filter(p => [global,level4,level5].every(scope => scope.length === 0 || new Set(scope).has(p.assessment.status)))
  assert.deepEqual(model.filterLeaf(leaf,global,level4,level5,''), expected)
}
for (const leaf of model.leaves) {
  assert.equal(model.filterLeaf(leaf,[],[],[],leaf.points[0].code.toLowerCase()).length,1)
  assert.equal(model.filterLeaf(leaf,[],[],[],leaf.pages[0]).length,leaf.points.length)
  assert.equal(model.filterLeaf(leaf,[],[],[],'NO_MATCH_987654321').length,0)
}
assert.deepEqual(model.toggleStatus(['pending'],'noncompliant'),['pending','noncompliant'])
assert.deepEqual(model.toggleStatus(['pending'],'pending'),[])
assert.deepEqual(model.toggleStatus(['pending','noncompliant'],'all'),[])
const totals = {}
for (const module of ['research','reading']) {
  const leaves = model.leaves.filter(l => l.module === module)
  totals[module] = model.countPoints(leaves.flatMap(l=>l.points))
  assert.equal(Object.values(totals[module]).slice(1).reduce((a,b)=>a+b,0), totals[module].all)
}
console.log(JSON.stringify({points:points.length,leaves:model.leaves.length,filterCombinations:model.leaves.length*512,totals,sourceUnchanged:true,result:'PASS'},null,2))

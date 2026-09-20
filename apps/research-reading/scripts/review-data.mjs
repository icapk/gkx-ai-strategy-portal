import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
export const root = fileURLToPath(new URL('..', import.meta.url))
export const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8').replace(/^\uFEFF/, ''))
export const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n')
export const requirements = read('src/audit/requirements.json')
export const pointMap = new Map(requirements.leaves.flatMap(leaf => leaf.points.map(point => [point.code, point])))
const targetSource = fs.readFileSync(path.join(root, 'src/audit/targets.ts'), 'utf8')
const knownTargets = new Set([...targetSource.matchAll(/^  '([^']+)': \{ product:/gm)].map(match => match[1]))
export function validateDecisions(decisions) {
  assert.equal(Object.keys(decisions).length, pointMap.size, 'Assessment coverage mismatch')
  for (const [code, decision] of Object.entries(decisions)) {
    assert.ok(pointMap.has(code), `Unknown code ${code}`)
    assert.ok(['compliant', 'pending', 'noncompliant'].includes(decision.status), `Invalid status ${code}`)
    for (const key of ['reason', 'targetId', 'evidence']) assert.ok(typeof decision[key] === 'string' && decision[key].trim(), `Missing ${key}: ${code}`)
    assert.ok(knownTargets.has(decision.targetId), `Unknown navigation target ${code}`)
  }
}
export function validateLocation(code, location) {
  assert.ok(location?.navigationTarget && location?.description?.trim(), `Missing location ${code}`)
  assert.ok(knownTargets.has(location.navigationTarget), `Unknown navigation target ${code}`)
  assert.equal(typeof location.contextOnly, 'boolean', `Missing contextOnly ${code}`)
  assert.ok(Array.isArray(location.selectors) && location.selectors.length, `Missing selectors ${code}`)
  for (const selector of location.selectors) {
    assert.ok(typeof selector === 'string' && selector.trim(), `Empty selector ${code}`)
    assert.ok(!/:nth-|:first-|:last-/.test(selector), `Position-based selector rejected ${code}`)
  }
}

export function validateOpinion(point) {
  assert.ok(pointMap.has(point.code), `Unknown opinion ${point.code}`)
  const nonempty = value => typeof value === 'string' && Boolean(value.trim())
  for (const key of ['requirement','reason','actual']) assert.ok(nonempty(point[key]), `Incomplete opinion ${point.code}/${key}`)
  assert.equal(point.requirement.trim().replaceAll('\r\n','\n'), pointMap.get(point.code).sourceText.trim().replaceAll('\r\n','\n'), `Requirement wording mismatch: ${point.code}`)
  assert.ok(Array.isArray(point.steps) && point.steps.length && point.steps.every(nonempty), `Incomplete steps ${point.code}`)
  assert.ok(Array.isArray(point.evidence) && point.evidence.length, `Incomplete code evidence ${point.code}`)
  for (const evidence of point.evidence) {
    assert.ok(evidence && nonempty(evidence.file) && Number.isInteger(evidence.line) && evidence.line > 0 && nonempty(evidence.function), `Code reference must contain file, line and behavior: ${point.code}`)
  }
  assert.ok(['compliant','pending','noncompliant'].includes(point.status), `Invalid opinion status ${point.code}`)
}

export function parentReviewReason(batch) {
  const parent = batch.requirementLevelReview
  const reason = typeof parent?.reason === 'string' ? parent.reason.trim() : [parent?.present, ...(parent?.gaps ?? [])].filter(value => typeof value === 'string' && value.trim()).join('\n')
  assert.ok(reason, `Missing parent requirement review: ${batch.batchId}`)
  return reason
}

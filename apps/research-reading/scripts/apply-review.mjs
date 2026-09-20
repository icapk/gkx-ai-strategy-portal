import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { root, read, write, pointMap, validateDecisions, validateLocation, validateOpinion, parentReviewReason } from './review-data.mjs'

const [batchFile, locationFile] = process.argv.slice(2)
assert.ok(batchFile, 'Usage: node scripts/apply-review.mjs audit/reviews/SRR-NNN.json [resolved-locations.json]')
const batch = read(batchFile)
const batchId = batch.batchId
assert.match(batchId, /^SRR-\d{3}$/)
assert.ok(batch.sourceHashes && Object.keys(batch.sourceHashes).length, 'Reviewed source version required')
const snapshots = []
for (const [file, expected] of Object.entries(batch.sourceHashes)) {
  const relative = file.replaceAll('\\', '/').replace(/^.*review-baseline\//, '')
  const baseline = path.resolve(root, '.local/review-baseline', relative)
  assert.ok(baseline.startsWith(path.resolve(root, '.local/review-baseline') + path.sep), 'Invalid snapshot path')
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(baseline)).digest('hex'), expected.toLowerCase(), `Source changed: ${file}`)
  const archive = path.resolve(root, 'audit/reviews/source-baseline', relative)
  if (fs.existsSync(archive)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex'), expected.toLowerCase(), `Archive conflict: ${file}`)
  snapshots.push({baseline,archive})
}
const expectedCodes = [...pointMap.keys()].filter(code => code.startsWith(batchId + '-')).sort()
assert.deepEqual(batch.points.map(p => p.code).sort(), expectedCodes, 'Batch must contain each source point exactly once')
const resolved = locationFile ? read(locationFile) : {}
const decisions = read('src/audit/review/decisions.json')
const locations = read('src/audit/review/locators.json')
const progress = read('src/audit/review/progress.json')
const parentReviews = read('src/audit/requirementReviews.json')
const parentChange = { before: parentReviews[batchId], after: parentReviewReason(batch) }
const historyPath = `audit/reviews/${batchId}-applied.json`
assert.ok(!fs.existsSync(path.join(root, historyPath)), 'Batch already applied; use a versioned correction rather than overwriting history')
const changes = []
for (const point of batch.points) {
  validateOpinion(point)
  const location = resolved[point.code] ?? point.locator
  validateLocation(point.code, location)
  const evidence = typeof point.evidence === 'string' ? point.evidence : point.evidence.map(item => typeof item === 'string' ? item : `${item.file}:${item.line ?? ''} · ${item.function ?? ''}`).join('；')
  const next = { status: point.status, reason: point.reason, targetId: location.navigationTarget, evidence }
  changes.push({ code: point.code, before: decisions[point.code], after: next, statusChanged: decisions[point.code].status !== next.status, locator: location })
  decisions[point.code] = next
  locations[point.code] = location
  progress[point.code] = { state: 'applied', batchId, source: batchFile, reviewer: '01a07ab8-e3fe-74c2-a26f-b9e690e2d6aa' }
}
validateDecisions(decisions)
// All validation precedes writes. The generated application data comes only from decisions.json.
for (const {baseline,archive} of snapshots) { fs.mkdirSync(path.dirname(archive),{recursive:true}); if (!fs.existsSync(archive)) fs.copyFileSync(baseline,archive) }
write(historyPath, { batchId, appliedAt: new Date().toISOString(), sourceHashes: batch.sourceHashes, changes, parentChange })
write('src/audit/review/decisions.json', decisions)
write('src/audit/review/locators.json', locations)
write('src/audit/review/progress.json', progress)
write('src/audit/assessments.json', decisions)
parentReviews[batchId] = parentChange.after
write('src/audit/requirementReviews.json', parentReviews)
console.log(JSON.stringify({batchId,points:changes.length,statusChanges:changes.filter(c=>c.statusChanged).length},null,2))

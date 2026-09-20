import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { root, read, write, validateOpinion, validateLocation, validateDecisions, parentReviewReason } from './review-data.mjs'

const [correctionFile, locationFile] = process.argv.slice(2)
assert.ok(correctionFile,'Pass a versioned independent correction JSON')
const correction = read(correctionFile)
assert.match(correction.batchId ?? '',/^SRR-\d{3}$/)
const sourceHashes = correction.sourceHashes ?? correction.sourceHashesAtReport
const sourceVersionKind = correction.sourceHashes ? 'baseline' : 'current-implementation'
assert.ok(correction.points?.length && sourceHashes && Object.keys(sourceHashes).length,'Correction requires evidence and a fixed source version')
assert.equal(new Set(correction.points.map(p=>p.code)).size,correction.points.length,'Duplicate correction point')
for (const [relative,expected] of Object.entries(sourceHashes)) {
  const normalized = relative.replaceAll('\\','/').replace(/^.*review-baseline\//,'')
  assert.ok(normalized.startsWith('src/') && !normalized.split('/').includes('..'))
  const source = sourceVersionKind === 'baseline' ? path.join(root,'.local/review-baseline',normalized) : path.join(root,normalized)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),expected.toLowerCase(),`Source mismatch: ${relative}`)
}
const decisions = read('src/audit/review/decisions.json'), locations = read('src/audit/review/locators.json'), progress = read('src/audit/review/progress.json')
const overrides = locationFile ? read(locationFile) : {}
const historyFile = correctionFile.replace(/\.json$/,'-applied.json')
assert.notEqual(historyFile,correctionFile)
assert.ok(!fs.existsSync(path.join(root,historyFile)),'Correction already applied; retain history and create a new correction version')
const changes = []
for (const point of correction.points) {
  validateOpinion(point)
  assert.ok(point.code.startsWith(correction.batchId+'-') && progress[point.code]?.batchId === correction.batchId,'Correction must belong to an applied batch')
  if (point.before?.status) assert.equal(decisions[point.code].status,point.before.status,`Opinion conflicts with current status: ${point.code}`)
  const locator = overrides[point.code] ?? point.locator ?? locations[point.code]
  validateLocation(point.code,locator)
  const after = {status:point.status,reason:point.reason,targetId:locator.navigationTarget,evidence:point.evidence.map(e=>`${e.file}:${e.line} · ${e.function}`).join('；')}
  changes.push({code:point.code,before:decisions[point.code],after,previousReview:progress[point.code],previousLocator:locations[point.code],locator,statusChanged:decisions[point.code].status!==after.status})
  decisions[point.code] = after
  locations[point.code] = locator
  progress[point.code] = {state:'applied',batchId:correction.batchId,source:correctionFile,reviewer:correction.reviewerTaskId ?? '01a07ab8-e3fe-74c2-a26f-b9e690e2d6aa',correction:true}
}
validateDecisions(decisions)
const parents = read('src/audit/requirementReviews.json')
const parentChange = correction.requirementLevelReview ? {before:parents[correction.batchId],after:parentReviewReason(correction)} : null
write(historyFile,{batchId:correction.batchId,appliedAt:new Date().toISOString(),source:correctionFile,sourceHashes,sourceVersionKind,changes,parentChange})
write('src/audit/review/decisions.json',decisions)
write('src/audit/assessments.json',decisions)
write('src/audit/review/locators.json',locations)
write('src/audit/review/progress.json',progress)
const locationArchiveFile = `audit/reviews/${correction.batchId}-locations.json`
const locationArchive = read(locationArchiveFile)
for (const change of changes) locationArchive[change.code] = change.locator
write(locationArchiveFile,locationArchive)
if (parentChange) {parents[correction.batchId] = parentChange.after;write('src/audit/requirementReviews.json',parents)}
console.log(`Applied independent correction: ${correction.batchId}, ${changes.length} points; requires re-verification`)

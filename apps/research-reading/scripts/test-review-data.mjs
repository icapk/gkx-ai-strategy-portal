import assert from 'node:assert/strict'
import { read, validateDecisions, validateLocation, validateOpinion, parentReviewReason } from './review-data.mjs'
const decisions = read('src/audit/review/decisions.json')
validateDecisions(decisions)
const code = 'SRR-034-001'
for (const key of ['reason','evidence','targetId']) {
  const invalid = structuredClone(decisions)
  delete invalid[code][key]
  assert.throws(()=>validateDecisions(invalid))
}
const missing = structuredClone(decisions)
delete missing[code]
assert.throws(()=>validateDecisions(missing))
const invalidStatus = structuredClone(decisions)
invalidStatus[code].status = 'unreviewed'
assert.throws(()=>validateDecisions(invalidStatus), 'Review lifecycle cannot be used as compliance status')
const valid = { navigationTarget:'reading-header', selectors:['[data-audit-focus="reading-save"]'], contextOnly:false, description:'保存按钮' }
validateLocation(code, valid)
assert.throws(()=>validateLocation(code,{...valid,selectors:[]}))
assert.throws(()=>validateLocation(code,{...valid,selectors:['button:nth-child(1)']}))
assert.throws(()=>validateLocation(code,{...valid,navigationTarget:'made-up'}))
assert.throws(()=>validateLocation(code,{...valid,contextOnly:undefined}))
assert.deepEqual(decisions, read('src/audit/assessments.json'), 'Generated assessment is stale')
const opinions = read('audit/reviews/SRR-034.json').points
opinions.forEach(validateOpinion)
for (const replacement of [{steps:[' ']},{evidence:[{}]},{evidence:[{file:'a.ts',line:0,function:'test'}]},{actual:' '},{requirement:'different requirement'}]) {
  assert.throws(()=>validateOpinion({...opinions[0],...replacement}), 'Incomplete independent opinions must not enter formal data')
}
const locations = read('src/audit/review/locators.json')
const progress = read('src/audit/review/progress.json')
const parentReviews = read('src/audit/requirementReviews.json')
for (const batchId of new Set(Object.values(progress).map(p=>p.batchId))) {
  const batch = read(`audit/reviews/${batchId}.json`)
  batch.points.forEach(validateOpinion)
  assert.equal(parentReviews[batchId], parentReviewReason(batch), `Parent review has not been synchronized: ${batchId}`)
}
for (const [code, location] of Object.entries(locations)) {
  validateLocation(code, location)
  assert.ok(decisions[code] && progress[code])
  assert.equal(location.navigationTarget, decisions[code].targetId)
}
console.log(`PASS: review validation, missing evidence rejection, lifecycle separation, ${Object.keys(locations).length} reviewed locators`)

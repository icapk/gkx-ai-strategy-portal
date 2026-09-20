import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { read, write, root } from './review-data.mjs'
const reportFiles = process.argv.slice(2)
assert.ok(reportFiles.length, 'Pass independent verification report paths')
const progress = read('src/audit/review/progress.json')
const verifiedCodes = new Set()
const pending = []
// Validate every report against the same source version before updating progress.
for (const reportFile of reportFiles) {
const report = read(reportFile)
assert.equal(report.result, 'PASS', 'Independent verification did not pass')
assert.ok(report.checks?.length && report.sourceHashes && Object.keys(report.sourceHashes).length, 'Verification must contain checks and implementation version')
for (const [relative, hash] of Object.entries(report.sourceHashes)) {
  const file = path.resolve(root, relative)
  assert.ok(file.startsWith(path.resolve(root) + path.sep), 'Invalid source path')
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), hash.toLowerCase(), `Implementation changed after verification: ${relative}`)
}
const expected = Object.keys(progress).filter(code=>progress[code].batchId===report.batchId && (report.scope !== 'correction' || progress[code].state === 'applied')).sort()
assert.ok(expected.length)
assert.deepEqual([...report.codes].sort(),expected)
for (const code of expected) {
  assert.ok(!verifiedCodes.has(code), `Overlapping verification reports: ${code}`)
  verifiedCodes.add(code)
}
pending.push({ reportFile, batchId: report.batchId, codes: expected })
}
for (const { reportFile, codes } of pending) {
  for (const code of codes) progress[code] = {...progress[code],state:'verified',verification:reportFile}
}
write('src/audit/review/progress.json',progress)
for (const { batchId, codes } of pending) console.log(`Verified ${batchId}: ${codes.length} points`)

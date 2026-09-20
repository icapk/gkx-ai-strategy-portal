import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { root, read, write } from './review-data.mjs'

const manifestFile = process.argv[2]
assert.ok(manifestFile, 'Pass an implementation manifest path')
const manifest = read(manifestFile)
assert.match(manifest.batchId, /^SRR-\d{3}$/)
const revision = String(manifest.revision ?? 1)
assert.match(revision, /^\d+$/)
const directory = `audit/reviews/implementation-versions/${manifest.batchId}-r${revision}`
const copies = Object.entries(manifest.sourceHashes).map(([relative, expected]) => {
  assert.ok(relative.startsWith('src/') && !relative.split('/').includes('..'))
  const source = path.join(root,relative), destination = path.join(root,directory,relative)
  const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  assert.equal(hash(source),expected, `Implementation no longer matches manifest: ${relative}`)
  if (fs.existsSync(destination)) assert.equal(hash(destination),expected, `Snapshot conflict: ${relative}`)
  return {source,destination}
})
for (const {source,destination} of copies) {
  fs.mkdirSync(path.dirname(destination),{recursive:true})
  if (!fs.existsSync(destination)) fs.copyFileSync(source,destination)
}
const saved = `${directory}/manifest.json`
if (!fs.existsSync(path.join(root,saved))) write(saved, {...manifest, sourceManifest:manifestFile, archivedAt:new Date().toISOString()})
console.log(`Archived immutable implementation: ${directory} (${copies.length} files)`)

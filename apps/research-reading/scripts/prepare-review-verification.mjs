import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { root, read, write } from './review-data.mjs'

const [batchId, revisionText = '1'] = process.argv.slice(2)
assert.match(batchId ?? '', /^SRR-\d{3}$/)
assert.match(revisionText,/^[1-9]\d*$/)
const revision = Number(revisionText)
const manifestFile = `audit/reviews/${batchId}-implementation.json`
const src = path.join(root,'src')
const files = fs.readdirSync(src,{recursive:true}).filter(file=>fs.statSync(path.join(src,file)).isFile()).map(file=>'src/'+file.replaceAll('\\','/')).sort()
const sourceHashes = Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]))
if (fs.existsSync(path.join(root,manifestFile))) {
  const previous = read(manifestFile)
  assert.ok(revision >= (previous.revision ?? 1),'Do not decrease implementation revision')
  if (revision === (previous.revision ?? 1)) assert.deepEqual(sourceHashes,previous.sourceHashes,'Changed implementation requires a new revision number')
}
write(manifestFile,{batchId,revision,sourceHashes})
execFileSync(process.execPath,[path.join(root,'scripts/snapshot-implementation.mjs'),manifestFile],{stdio:'inherit'})
console.log(`Ready for independent verification: ${manifestFile}`)

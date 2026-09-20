import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { root, read, write, requirements, validateDecisions, validateLocation } from './review-data.mjs'

const final = process.argv.includes('--final')
const decisions = read('src/audit/review/decisions.json')
const progress = read('src/audit/review/progress.json')
const locations = read('src/audit/review/locators.json')
const legacy = read('audit/reviews/legacy-assessments.json')
validateDecisions(decisions)
assert.deepEqual(decisions, read('src/audit/assessments.json'))
const counts = points => points.reduce((acc, point) => { acc.total++; acc[decisions[point.code].status]++; return acc }, { total: 0, compliant: 0, pending: 0, noncompliant: 0 })
const all = requirements.leaves.flatMap(leaf => leaf.points)
const batches = requirements.leaves.map(leaf => {
  const reviewed = leaf.points.filter(point => progress[point.code])
  const verified = reviewed.filter(point => progress[point.code].state === 'verified')
  for (const point of reviewed) {
    validateLocation(point.code, locations[point.code])
    assert.equal(locations[point.code].navigationTarget, decisions[point.code].targetId)
    if (progress[point.code].state === 'verified') {
      const report = read(progress[point.code].verification)
      assert.equal(report.result, 'PASS')
      assert.ok(report.codes.includes(point.code))
      assert.equal(report.batchId, leaf.id)
    }
  }
  if (final) assert.equal(verified.length, leaf.points.length, `Independent verification incomplete: ${leaf.id}`)
  return { id: leaf.id, module: leaf.module, name: [leaf.level5,leaf.level6].filter(value=>value !== '/').join(' / '), ...counts(leaf.points), reviewed: reviewed.length, verified: verified.length, unreviewed: leaf.points.length-reviewed.length }
})
const changes = all.filter(point => progress[point.code] && legacy[point.code].status !== decisions[point.code].status).map(point => ({ code: point.code, requirement: point.sourceText, before: legacy[point.code], after: decisions[point.code], source: progress[point.code].source, verification: progress[point.code].verification ?? null }))
const unresolved = all.filter(point => progress[point.code] && decisions[point.code].status !== 'compliant').map(point => ({ code: point.code, requirement: point.sourceText, ...decisions[point.code], locator: locations[point.code], review: progress[point.code] }))
const report = { generatedAt: new Date().toISOString(), complete: batches.every(batch=>batch.verified === batch.total), scope: '前端原型验收；模拟数据本身不判错，实际交互须产生正确结果。后端、AI及持久化能力另列。', requirementSource: {file:requirements.source,sha256:requirements.sha256}, totals: counts(all), modules: Object.fromEntries(['research','reading'].map(module=>[module,counts(requirements.leaves.filter(leaf=>leaf.module===module).flatMap(leaf=>leaf.points))])), batches, changes, unresolved, outOfPrototypeGaps: batches.filter(batch=>batch.reviewed).map(batch=>({batchId:batch.id,gaps:read(`audit/reviews/${batch.id}.json`).outOfPrototypeGaps ?? []})) }
fs.mkdirSync(path.join(root,'audit/reports'),{recursive:true})
write('audit/reports/independent-review.json', report)
write('audit/reports/status-changes.json',changes)
write('audit/reports/unresolved.json',unresolved)
const names={compliant:'已合规',pending:'待定',noncompliant:'不合规'}
const safe=value=>String(value).replaceAll('|','｜').replaceAll('\n',' ')
const lines=['# 独立复审交付记录','',report.scope,'',`审核进度：${batches.reduce((n,b)=>n+b.reviewed,0)} / ${all.length} 项已独立复审，${batches.reduce((n,b)=>n+b.verified,0)} 项已完成修改复验。${report.complete ? '本轮全部完成。' : '本轮尚未完成，未复审项目仍显示旧结论；下列全量统计不可视为全量独立复审结果。'}`,'','| 分支 | 功能数 | 已合规 | 待定 | 不合规 | 已复审 | 已复验 |','| --- | ---: | ---: | ---: | ---: | ---: | ---: |',...batches.map(b=>`| ${b.id} ${b.name} | ${b.total} | ${b.compliant} | ${b.pending} | ${b.noncompliant} | ${b.reviewed} | ${b.verified} |`),'','## 状态变更','',`共 ${changes.length} 项状态发生变化，完整前后理由与审核来源见 status-changes.json。`,'','| 功能编号 | 修改前 | 修改后 | 当前理由 |','| --- | --- | --- | --- |',...changes.map(c=>`| ${c.code} | ${names[c.before.status]} | ${names[c.after.status]} | ${safe(c.after.reason)} |`),'','## 未决问题','',`已复审项目中的 ${unresolved.length} 项待定或不合规见 unresolved.json。本轮只修改审核结论及标注，业务缺陷保留。`,'','每批原始意见、修改历史、固定源码版本、复验报告保存在 audit/reviews；运行时唯一评估源为 src/audit/review/decisions.json。','']
fs.writeFileSync(path.join(root,'audit/reports/independent-review.md'),lines.join('\n'))
console.log(JSON.stringify({complete:report.complete,reviewed:batches.reduce((n,b)=>n+b.reviewed,0),verified:batches.reduce((n,b)=>n+b.verified,0),statusChanges:changes.length,totals:report.totals},null,2))

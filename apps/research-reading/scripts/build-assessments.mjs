import { read, write, requirements, validateDecisions } from './review-data.mjs'
const decisions = read('src/audit/review/decisions.json')
validateDecisions(decisions)
write('src/audit/assessments.json', decisions)
for (const module of ['research','reading']) {
  const points = requirements.leaves.filter(l=>l.module===module).flatMap(l=>l.points)
  console.log(module, Object.fromEntries(['compliant','pending','noncompliant'].map(status=>[status,points.filter(p=>decisions[p.code].status===status).length])), 'total', points.length)
}

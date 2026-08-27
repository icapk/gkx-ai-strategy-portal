import test from 'node:test'
import assert from 'node:assert/strict'
import { getPaperAnalysis, searchPaperAnalysis } from '../src/readingAnalysis.ts'

test('文档 1 至 6 均提供可追溯的结构化论文解析结果', () => {
  const analyses = Array.from({ length: 6 }, (_, index) => getPaperAnalysis(index + 1))

  analyses.forEach((analysis, index) => {
    assert.equal(analysis.documentId, index + 1)
    assert.ok(analysis.metadata.title.length > 0)
    assert.ok(analysis.metadata.abstract.length > 20)
    assert.ok(analysis.metadata.authors.length > 0)
    assert.ok(analysis.metadata.authors.every((author) => author.affiliationIds.length > 0))
    assert.ok(analysis.metadata.affiliations.length > 0)
    assert.ok(analysis.metadata.keywords.length > 0)
    assert.ok(analysis.metadata.publicationDate.length > 0)
    assert.ok(analysis.metadata.journal.length > 0)
    assert.ok(analysis.metadata.doi.length > 0)

    assert.ok(analysis.outline.some((section) => section.kind === 'abstract'))
    assert.ok(analysis.outline.some((section) => section.kind === 'body'))
    assert.ok(analysis.outline.some((section) => section.kind === 'references'))

    const sectionIds = new Set(analysis.outline.map((section) => section.id))
    analysis.references.forEach((reference) => {
      assert.ok(reference.authors.length > 0)
      assert.ok(reference.abstract.length > 0)
      assert.ok(reference.publicationDate.length > 0)
      assert.ok(reference.journal.length > 0)
      assert.ok(reference.doi.length > 0)
      assert.ok(reference.citationAnchors.length > 0)
      assert.ok(reference.citationAnchors.every((anchor) => anchor.referenceId === reference.id))
      assert.ok(reference.citationAnchors.every((anchor) => sectionIds.has(anchor.sectionId)))
    })

    assert.ok(analysis.figures.length > 0)
    assert.ok(analysis.figures.every((figure) => figure.page > 0 && sectionIds.has(figure.sectionId)))
    assert.ok(analysis.graph.nodes.length > 0)
    assert.ok(analysis.graph.edges.length > 0)
  })

  assert.ok(new Set(analyses.map((analysis) => analysis.references.length)).size > 1)
  assert.ok(new Set(analyses.map((analysis) => analysis.figures.length)).size > 1)
})

test('语义检索覆盖标题、摘要、关键词、作者、机构与图谱节点', () => {
  const analysis = getPaperAnalysis(1)

  assert.ok(searchPaperAnalysis(analysis, '锂硫电池').some((result) => result.kind === 'title'))
  assert.ok(searchPaperAnalysis(analysis, '长循环稳定性').some((result) => result.kind === 'abstract'))
  assert.ok(searchPaperAnalysis(analysis, '穿梭效应').some((result) => result.kind === 'keyword'))
  assert.ok(searchPaperAnalysis(analysis, '刘建国').some((result) => result.kind === 'author'))
  assert.ok(
    searchPaperAnalysis(analysis, '中国科学院深圳先进技术研究院').some(
      (result) => result.kind === 'institution',
    ),
  )
  const graphHit = searchPaperAnalysis(analysis, '吸附 催化').find((result) => result.kind === 'graph-node')
  assert.equal(graphHit?.target.nodeId, 'graph-interface-adsorption')
  assert.equal(graphHit?.target.sectionId, 'results')
  assert.equal(graphHit?.target.page, 8)
})

test('不同文档的数据互相隔离且每次读取均返回独立快照', () => {
  const first = getPaperAnalysis(1)
  const second = getPaperAnalysis(2)

  assert.notEqual(first.metadata.title, second.metadata.title)
  assert.notDeepEqual(first.metadata.keywords, second.metadata.keywords)
  assert.notEqual(first.metadata.affiliations[0].name, second.metadata.affiliations[0].name)

  first.metadata.keywords.push('不应泄漏')
  first.references[0].authors[0] = '被修改的作者'

  const firstAgain = getPaperAnalysis(1)
  assert.equal(firstAgain.metadata.keywords.includes('不应泄漏'), false)
  assert.notEqual(firstAgain.references[0].authors[0], '被修改的作者')
})

test('未知或新导入文档使用传入标题生成完整回退解析', () => {
  const analysis = getPaperAnalysis(99, '用户上传的量子传感综述')

  assert.equal(analysis.metadata.title, '用户上传的量子传感综述')
  assert.equal(analysis.graph.nodes.find((node) => node.type === 'paper')?.label, '用户上传的量子传感综述')
  assert.ok(analysis.references.every((reference) => reference.citationAnchors.length > 0))
})

test('空查询或纯空白查询不会产生伪命中', () => {
  const analysis = getPaperAnalysis(2)

  assert.deepEqual(searchPaperAnalysis(analysis, ''), [])
  assert.deepEqual(searchPaperAnalysis(analysis, '   '), [])
  assert.deepEqual(searchPaperAnalysis(analysis, '\n\t'), [])
})

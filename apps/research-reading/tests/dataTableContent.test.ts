import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DATA_TABLE_IMPORT_LIMITS,
  createBlankResearchDataTable,
  createClinicalSurveyDataTable,
  createDemoResearchDataTable,
  createMaterialsExperimentDataTable,
  exportResearchDataTableCsv,
  getResearchDataTableSearchText,
  initialResearchDataTables,
  loadResearchDataTables,
  parseDelimitedData,
  persistResearchDataTable,
  removeResearchDataTable,
  sanitizeResearchDataTable,
} from '../src/dataTableContent.ts'

test('空白表格按科研场景生成稳定字段结构', () => {
  const projectTable = createBlankResearchDataTable(20, 'project-progress', '李四', '2026-08-25 10:00')
  const researchTable = createBlankResearchDataTable(21, 'research-data', '王五', '2026-08-25 10:00')

  assert.deepEqual(projectTable.columns.map((column) => column.id), [
    'project',
    'owner',
    'status',
    'progress',
    'dueDate',
    'dataFile',
  ])
  assert.equal(projectTable.rows.length, 0)
  assert.equal(projectTable.share.access, 'private')
  assert.deepEqual(researchTable.columns.map((column) => column.id), [
    'sample',
    'category',
    'value',
    'unit',
    'owner',
    'collectedAt',
    'dataFile',
  ])
})

test('示例表格包含六条非零项目进度和多人上传信息', () => {
  const table = createDemoResearchDataTable(7)

  assert.equal(table.documentId, 7)
  assert.equal(table.rows.length, 6)
  assert.deepEqual(table.rows.map((row) => row.values.status), [
    '进行中',
    '进行中',
    '有风险',
    '未开始',
    '已完成',
    '进行中',
  ])
  assert.equal(table.attachments.length, 3)
  assert.deepEqual(new Set(table.attachments.map((attachment) => attachment.uploadedBy)), new Set(['张三', '李四', '王五']))
  assert.equal(table.share.access, 'team-edit')
})

test('默认数据包含材料实验、临床调研两类跨表科研场景', () => {
  const materialsTable = createMaterialsExperimentDataTable()
  const clinicalTable = createClinicalSurveyDataTable()

  assert.deepEqual(initialResearchDataTables.map((table) => table.documentId), [7, 9, 10])
  for (const table of [materialsTable, clinicalTable]) {
    assert.equal(table.rows.length, 6)
    assert.equal(table.attachments.length, 6)
    assert.ok(table.rows.every((row) => Object.values(row.values).every((value) => value.trim().length > 0)))
    assert.ok(table.rows.every((row) => Number(row.values.progress) > 0))
    assert.ok(table.attachments.every((attachment) => attachment.size > 0 && attachment.rowCount > 0))
    assert.ok(new Set(table.attachments.map((attachment) => attachment.uploadedBy)).size >= 3)
    assert.equal(table.share.access, 'team-edit')
    assert.ok(table.share.collaborators.length >= 3)
  }

  assert.match(materialsTable.columns.map((column) => column.name).join(' '), /材料体系.*离子电导率.*实验状态/)
  assert.match(materialsTable.rows.map((row) => row.values.material).join(' '), /Li₆PS₅Cl.*LLZO-Ta0\.2/)
  assert.match(clinicalTable.columns.map((column) => column.name).join(' '), /队列.*已纳入样本.*项目状态/)
  assert.match(clinicalTable.rows.map((row) => row.values.project).join(' '), /高血压.*糖尿病.*AI 使用调查/)
})

test('跨表默认数据可产生非零聚合总览', () => {
  const rows = initialResearchDataTables.flatMap((table) => table.rows)
  const attachments = initialResearchDataTables.flatMap((table) => table.attachments)
  const completedCount = rows.filter((row) => /完成|已归档/.test(row.values.status ?? '')).length
  const totalProgress = rows.reduce((sum, row) => sum + Number(row.values.progress ?? 0), 0)

  assert.equal(initialResearchDataTables.length, 3)
  assert.equal(rows.length, 18)
  assert.equal(attachments.length, 15)
  assert.equal(completedCount, 3)
  assert.equal(totalProgress, 1_178)
  assert.equal(Math.round(totalProgress / rows.length), 65)
  assert.ok(new Set(attachments.map((attachment) => attachment.uploadedBy)).size >= 10)
})

test('损坏数据会被限量清洗且不会保留未知列和危险附件地址', () => {
  const table = sanitizeResearchDataTable({
    documentId: 88,
    template: 'unsupported-template',
    columns: [
      { id: 'name', name: '名称', type: 'text', required: true },
      { id: 'name', name: '负责人', type: 'select', options: ['张三', '张三', '李四'] },
      { id: 'ignored', name: '名称', type: 'text' },
      { id: 'invalid', name: '非法字段', type: 'script' },
    ],
    rows: [{
      id: 'one',
      values: { name: 'A'.repeat(DATA_TABLE_IMPORT_LIMITS.maxCellCharacters + 20), unknown: 'drop me' },
      updatedAt: '',
      updatedBy: '',
    }],
    attachments: [{
      id: 'file-one',
      name: 'data.csv',
      size: 42,
      mimeType: 'text/csv',
      uploadedAt: '2026-08-25 10:00',
      uploadedBy: '张三',
      rowCount: 2,
      source: 'import',
      dataUrl: 'javascript:alert(1)',
    }],
    share: { access: 'unknown', collaborators: [' 李四 ', '李四', '王五'] },
    createdAt: '',
    updatedAt: '',
    updatedBy: '',
  })

  assert.ok(table)
  assert.equal(table.template, 'project-progress')
  assert.deepEqual(table.columns.map((column) => column.id), ['name', 'name-2'])
  assert.deepEqual(table.columns[1].options, ['张三', '李四'])
  assert.equal(table.rows[0].values.name.length, DATA_TABLE_IMPORT_LIMITS.maxCellCharacters)
  assert.equal('unknown' in table.rows[0].values, false)
  assert.equal(table.attachments[0].dataUrl, undefined)
  assert.equal(table.share.access, 'private')
  assert.deepEqual(table.share.collaborators, ['李四', '王五'])
})

test('CSV 解析支持 BOM、逗号、换行与双引号转义', () => {
  const result = parseDelimitedData('\uFEFF名称,说明,数值\r\n样本 A,"第一行\n第二行",12\r\n"样本, B","包含""引号""",18')

  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(result.headers, ['名称', '说明', '数值'])
  assert.deepEqual(result.rows, [
    ['样本 A', '第一行\n第二行', '12'],
    ['样本, B', '包含"引号"', '18'],
  ])
})

test('TSV 可自动识别并补齐缺失单元格', () => {
  const result = parseDelimitedData('项目\t负责人\t状态\n语义检索\t张三\n知识图谱\t李四\t进行中')

  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.delimiter, '\t')
  assert.deepEqual(result.rows, [
    ['语义检索', '张三', ''],
    ['知识图谱', '李四', '进行中'],
  ])
})

test('导入校验覆盖重复表头、超限、列错位和未闭合引号', () => {
  const duplicate = parseDelimitedData('名称,名称\nA,B')
  const tooManyRows = parseDelimitedData([
    '名称',
    ...Array.from({ length: DATA_TABLE_IMPORT_LIMITS.maxRows + 1 }, (_, index) => `第${index + 1}行`),
  ].join('\n'))
  const tooManyColumns = parseDelimitedData(
    Array.from({ length: DATA_TABLE_IMPORT_LIMITS.maxColumns + 1 }, (_, index) => `字段${index + 1}`).join(','),
  )
  const extraCell = parseDelimitedData('名称,数值\nA,1,extra')
  const unclosedQuote = parseDelimitedData('名称,说明\nA,"尚未闭合')
  const longCell = parseDelimitedData(`名称\n${'A'.repeat(DATA_TABLE_IMPORT_LIMITS.maxCellCharacters + 1)}`)

  assert.deepEqual(duplicate, { ok: false, error: '表头名称不能重复，请修改后重试。' })
  assert.equal(tooManyRows.ok, false)
  assert.equal(tooManyColumns.ok, false)
  assert.equal(extraCell.ok, false)
  assert.equal(unclosedQuote.ok, false)
  assert.equal(longCell.ok, false)
})

test('CSV 导出可被同一解析器无损读取', () => {
  const table = createBlankResearchDataTable(30, 'research-data', '张三', '2026-08-25 10:00')
  table.rows = [{
    id: 'row-one',
    values: {
      sample: '样本, A',
      category: '实验数据',
      value: '包含"引号"与\n换行',
      unit: 'mg/L',
      owner: '张三',
      collectedAt: '2026-08-25',
      dataFile: 'sample-a.csv',
    },
    updatedAt: '2026-08-25 10:00',
    updatedBy: '张三',
  }]

  const parsed = parseDelimitedData(exportResearchDataTableCsv(table))
  assert.equal(parsed.ok, true)
  if (!parsed.ok) return
  assert.deepEqual(parsed.headers, table.columns.map((column) => column.name))
  assert.deepEqual(parsed.rows[0], table.columns.map((column) => table.rows[0].values[column.id] ?? ''))
})

test('全文索引覆盖字段、记录、文件和协作者', () => {
  const searchText = initialResearchDataTables.map(getResearchDataTableSearchText).join(' ')

  assert.match(searchText, /项目进度/)
  assert.match(searchText, /实验组样本质量核验/)
  assert.match(searchText, /entity-annotation\.xlsx/)
  assert.match(searchText, /赵敏/)
  assert.match(searchText, /室温离子电导率/)
  assert.match(searchText, /MSE-2608-06-stability\.csv/)
  assert.match(searchText, /社区高血压基线队列/)
  assert.match(searchText, /吴老师/)
})

test('持久化前会拒绝超限内容而不是静默截断', () => {
  const table = createBlankResearchDataTable(40)
  table.rows = Array.from({ length: DATA_TABLE_IMPORT_LIMITS.maxRows + 1 }, (_, index) => ({
    id: `row-${index}`,
    values: { project: `项目 ${index}` },
    updatedAt: table.updatedAt,
    updatedBy: '张三',
  }))

  const result = persistResearchDataTable(table)
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /最多支持 500 条记录/)
})

test('本地存储按文档编号覆盖、加载并用删除墓碑阻止示例回流', () => {
  const memory = new Map<string, string>()
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => memory.get(key) ?? null,
        setItem: (key: string, value: string) => memory.set(key, value),
      },
    },
  })

  try {
    const personalizedDefault = createMaterialsExperimentDataTable()
    personalizedDefault.rows[0].values.material = '用户保存的材料体系'
    assert.deepEqual(persistResearchDataTable(personalizedDefault), { ok: true })
    const mergedDefaults = loadResearchDataTables()
    assert.deepEqual(mergedDefaults.map((table) => table.documentId), [7, 9, 10])
    assert.equal(mergedDefaults.find((table) => table.documentId === 9)?.rows[0].values.material, '用户保存的材料体系')
    assert.equal(mergedDefaults.find((table) => table.documentId === 10)?.rows.length, 6)

    memory.clear()
    const table = createBlankResearchDataTable(42, 'project-progress', '张三', '2026-08-25 10:00')
    table.rows = [{ id: 'stored-row', values: { project: '已保存项目' }, updatedAt: table.updatedAt, updatedBy: '张三' }]
    assert.deepEqual(persistResearchDataTable(table), { ok: true })
    assert.equal(loadResearchDataTables([])[0].rows[0].values.project, '已保存项目')

    const serialized = [...memory.values()][0]
    assert.match(serialized, /"version":1/)
    assert.match(serialized, /"42":/)

    assert.deepEqual(removeResearchDataTable(42), { ok: true })
    assert.deepEqual(loadResearchDataTables([table]), [])
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})

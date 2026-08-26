import type {
  DataTableAttachment,
  DataTableColumn,
  DataTableColumnType,
  DataTableShareAccess,
  DataTableShareSettings,
  DataTableTemplate,
  ResearchDataRow,
  ResearchDataTable,
} from './types'

const STORAGE_KEY = 'intelligent-research-portal:data-tables:v1'
const STORAGE_VERSION = 1
const MAX_STORAGE_CHARACTERS = 4_200_000
const MAX_ATTACHMENTS = 30
const MAX_COLLABORATORS = 50
const MAX_DATA_URL_CHARACTERS = 2_900_000
const safeAttachmentDataUrl = /^data:(?:text\/(?:csv|tab-separated-values|plain)|application\/(?:json|csv|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|octet-stream))(?:;[^,]*)?;base64,[a-z0-9+/=]+$/i

export const DATA_TABLE_IMPORT_LIMITS = {
  maxFileBytes: 2 * 1024 * 1024,
  maxRows: 500,
  maxColumns: 30,
  maxCellCharacters: 2_000,
} as const

type StoredResearchDataTables = {
  version: number
  tables: Record<string, ResearchDataTable>
  deletedDocumentIds: number[]
}

type StoredResearchDataTableState = Omit<StoredResearchDataTables, 'version'>

export type DataTableStorageResult = { ok: true } | { ok: false; error: string }

export type ParsedDelimitedData = {
  ok: true
  headers: string[]
  rows: string[][]
  delimiter: ',' | '\t'
} | {
  ok: false
  error: string
}

const columnTypes = new Set<DataTableColumnType>(['text', 'number', 'select', 'date', 'percent', 'file'])
const shareAccessValues = new Set<DataTableShareAccess>(['private', 'team-view', 'team-edit'])
let generatedIdCounter = 0

const cleanString = (value: unknown, maximum: number) => (
  typeof value === 'string' ? value.slice(0, maximum) : ''
)

const cleanTimestamp = (value: unknown, fallback: string) => {
  const candidate = cleanString(value, 40).trim()
  return candidate || fallback
}

const formatTimestamp = (date = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const createId = (prefix: string) => {
  generatedIdCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${generatedIdCounter.toString(36)}`
}

const uniqueStrings = (values: unknown, maximum: number, itemMaximum: number) => {
  if (!Array.isArray(values)) return []
  const seen = new Set<string>()
  return values.slice(0, maximum).flatMap((value) => {
    const candidate = cleanString(value, itemMaximum).trim()
    const key = candidate.toLocaleLowerCase()
    if (!candidate || seen.has(key)) return []
    seen.add(key)
    return [candidate]
  })
}

const projectProgressColumns = (): DataTableColumn[] => [
  { id: 'project', name: '项目 / 任务', type: 'text', required: true },
  { id: 'owner', name: '负责人', type: 'text', required: true },
  { id: 'status', name: '状态', type: 'select', required: true, options: ['未开始', '进行中', '有风险', '已完成'] },
  { id: 'progress', name: '进度', type: 'percent', required: true },
  { id: 'dueDate', name: '截止日期', type: 'date', required: false },
  { id: 'dataFile', name: '数据文件', type: 'file', required: false },
]

const researchDataColumns = (): DataTableColumn[] => [
  { id: 'sample', name: '数据 / 样本名称', type: 'text', required: true },
  { id: 'category', name: '数据类型', type: 'select', required: true, options: ['原始数据', '实验数据', '分析结果', '其他'] },
  { id: 'value', name: '数值 / 结果', type: 'text', required: false },
  { id: 'unit', name: '单位', type: 'text', required: false },
  { id: 'owner', name: '记录人', type: 'text', required: true },
  { id: 'collectedAt', name: '采集日期', type: 'date', required: false },
  { id: 'dataFile', name: '数据文件', type: 'file', required: false },
]

const cloneResearchDataTable = (table: ResearchDataTable): ResearchDataTable => ({
  ...table,
  columns: table.columns.map((column) => ({
    ...column,
    options: column.options ? [...column.options] : undefined,
  })),
  rows: table.rows.map((row) => ({ ...row, values: { ...row.values } })),
  attachments: table.attachments.map((attachment) => ({ ...attachment })),
  share: { ...table.share, collaborators: [...table.share.collaborators] },
})

const sanitizeColumns = (value: unknown) => {
  if (!Array.isArray(value)) return []
  const usedIds = new Set<string>()
  const usedNames = new Set<string>()

  return value.slice(0, DATA_TABLE_IMPORT_LIMITS.maxColumns).flatMap((entry, index): DataTableColumn[] => {
    if (!entry || typeof entry !== 'object') return []
    const column = entry as Partial<DataTableColumn> & Record<string, unknown>
    const name = cleanString(column.name, 80).trim()
    const nameKey = name.toLocaleLowerCase()
    if (!name || usedNames.has(nameKey) || !columnTypes.has(column.type as DataTableColumnType)) return []

    const rawId = cleanString(column.id, 80).trim() || `column-${index + 1}`
    let id = rawId
    let suffix = 2
    while (usedIds.has(id)) {
      id = `${rawId}-${suffix}`
      suffix += 1
    }
    usedIds.add(id)
    usedNames.add(nameKey)

    const type = column.type as DataTableColumnType
    const options = type === 'select' ? uniqueStrings(column.options, 30, 60) : undefined
    return [{ id, name, type, required: Boolean(column.required), ...(options?.length ? { options } : {}) }]
  })
}

const sanitizeRows = (value: unknown, columns: DataTableColumn[], fallbackTimestamp: string) => {
  if (!Array.isArray(value)) return []
  const usedIds = new Set<string>()
  const allowedColumnIds = new Set(columns.map((column) => column.id))

  return value.slice(0, DATA_TABLE_IMPORT_LIMITS.maxRows).flatMap((entry, index): ResearchDataRow[] => {
    if (!entry || typeof entry !== 'object') return []
    const row = entry as Partial<ResearchDataRow> & Record<string, unknown>
    const rawId = cleanString(row.id, 100).trim() || `row-${index + 1}`
    let id = rawId
    let suffix = 2
    while (usedIds.has(id)) {
      id = `${rawId}-${suffix}`
      suffix += 1
    }
    usedIds.add(id)

    const rawValues = row.values && typeof row.values === 'object'
      ? row.values as Record<string, unknown>
      : {}
    const values = Object.fromEntries(
      Object.entries(rawValues)
        .filter(([columnId]) => allowedColumnIds.has(columnId))
        .map(([columnId, cell]) => [columnId, cleanString(cell, DATA_TABLE_IMPORT_LIMITS.maxCellCharacters)]),
    )

    return [{
      id,
      values,
      updatedAt: cleanTimestamp(row.updatedAt, fallbackTimestamp),
      updatedBy: cleanString(row.updatedBy, 60).trim() || '未知用户',
    }]
  })
}

const sanitizeAttachment = (value: unknown, fallbackTimestamp: string): DataTableAttachment | null => {
  if (!value || typeof value !== 'object') return null
  const attachment = value as Partial<DataTableAttachment> & Record<string, unknown>
  const name = cleanString(attachment.name, 180).trim()
  const size = Number(attachment.size)
  if (!name || !Number.isFinite(size) || size < 0 || size > DATA_TABLE_IMPORT_LIMITS.maxFileBytes) return null

  const rawDataUrl = cleanString(attachment.dataUrl, MAX_DATA_URL_CHARACTERS)
  const dataUrl = safeAttachmentDataUrl.test(rawDataUrl)
    ? rawDataUrl
    : undefined
  const source = attachment.source === 'import' ? 'import' : 'upload'

  return {
    id: cleanString(attachment.id, 100).trim() || createId('attachment'),
    name,
    size,
    mimeType: cleanString(attachment.mimeType, 120).trim() || 'application/octet-stream',
    uploadedAt: cleanTimestamp(attachment.uploadedAt, fallbackTimestamp),
    uploadedBy: cleanString(attachment.uploadedBy, 60).trim() || '未知用户',
    rowCount: Math.max(0, Math.min(DATA_TABLE_IMPORT_LIMITS.maxRows, Math.trunc(Number(attachment.rowCount) || 0))),
    source,
    ...(dataUrl ? { dataUrl } : {}),
    ...(typeof attachment.previewText === 'string'
      ? { previewText: attachment.previewText.slice(0, 20_000) }
      : {}),
  }
}

const sanitizeShare = (value: unknown, fallbackTimestamp: string, fallbackActor: string): DataTableShareSettings => {
  const share = value && typeof value === 'object'
    ? value as Partial<DataTableShareSettings> & Record<string, unknown>
    : {}
  const access = shareAccessValues.has(share.access as DataTableShareAccess)
    ? share.access as DataTableShareAccess
    : 'private'

  return {
    access,
    collaborators: uniqueStrings(share.collaborators, MAX_COLLABORATORS, 60),
    updatedAt: cleanTimestamp(share.updatedAt, fallbackTimestamp),
    updatedBy: cleanString(share.updatedBy, 60).trim() || fallbackActor,
  }
}

export const sanitizeResearchDataTable = (value: unknown): ResearchDataTable | null => {
  if (!value || typeof value !== 'object') return null
  const table = value as Partial<ResearchDataTable> & Record<string, unknown>
  const documentId = Number(table.documentId)
  if (!Number.isInteger(documentId) || documentId <= 0) return null

  const template: DataTableTemplate = table.template === 'research-data' ? 'research-data' : 'project-progress'
  const columns = sanitizeColumns(table.columns)
  if (!columns.length) return null

  const fallbackTimestamp = formatTimestamp()
  const updatedBy = cleanString(table.updatedBy, 60).trim() || '未知用户'
  const attachments = Array.isArray(table.attachments)
    ? table.attachments
      .slice(0, MAX_ATTACHMENTS)
      .map((attachment) => sanitizeAttachment(attachment, fallbackTimestamp))
      .filter((attachment): attachment is DataTableAttachment => attachment != null)
    : []

  return {
    documentId,
    template,
    columns,
    rows: sanitizeRows(table.rows, columns, fallbackTimestamp),
    attachments,
    share: sanitizeShare(table.share, fallbackTimestamp, updatedBy),
    createdAt: cleanTimestamp(table.createdAt, fallbackTimestamp),
    updatedAt: cleanTimestamp(table.updatedAt, fallbackTimestamp),
    updatedBy,
  }
}

export const createBlankResearchDataTable = (
  documentId: number,
  template: DataTableTemplate = 'project-progress',
  actor = '张三',
  timestamp = formatTimestamp(),
): ResearchDataTable => {
  if (!Number.isInteger(documentId) || documentId <= 0) {
    throw new Error('数据表格必须关联有效文档。')
  }
  const safeActor = actor.trim().slice(0, 60) || '未知用户'
  return {
    documentId,
    template,
    columns: template === 'research-data' ? researchDataColumns() : projectProgressColumns(),
    rows: [],
    attachments: [],
    share: {
      access: 'private',
      collaborators: [],
      updatedAt: timestamp,
      updatedBy: safeActor,
    },
    createdAt: timestamp,
    updatedAt: timestamp,
    updatedBy: safeActor,
  }
}

export const createDemoResearchDataTable = (documentId = 7): ResearchDataTable => {
  const timestamp = '2026-08-25 10:30'
  const table = createBlankResearchDataTable(documentId, 'project-progress', '张三', '2026-08-18 09:20')
  const rows: ResearchDataRow[] = [
    {
      id: 'progress-row-1',
      values: { project: '文献语义检索模型复现', owner: '张三', status: '进行中', progress: '72', dueDate: '2026-09-12', dataFile: 'retrieval-evaluation.csv' },
      updatedAt: timestamp,
      updatedBy: '张三',
    },
    {
      id: 'progress-row-2',
      values: { project: '医学知识图谱实体标注', owner: '李四', status: '进行中', progress: '58', dueDate: '2026-09-20', dataFile: 'entity-annotation.xlsx' },
      updatedAt: '2026-08-24 16:10',
      updatedBy: '李四',
    },
    {
      id: 'progress-row-3',
      values: { project: '实验组样本质量核验', owner: '王五', status: '有风险', progress: '41', dueDate: '2026-08-30', dataFile: 'sample-qc.csv' },
      updatedAt: '2026-08-24 11:45',
      updatedBy: '王五',
    },
    {
      id: 'progress-row-4',
      values: { project: '消融实验与误差分析', owner: '赵敏', status: '未开始', progress: '0', dueDate: '2026-10-08', dataFile: '' },
      updatedAt: '2026-08-23 14:20',
      updatedBy: '赵敏',
    },
    {
      id: 'progress-row-5',
      values: { project: '基线数据清洗与去重', owner: '陈晨', status: '已完成', progress: '100', dueDate: '2026-08-22', dataFile: 'baseline-clean-v3.csv' },
      updatedAt: '2026-08-22 18:05',
      updatedBy: '陈晨',
    },
    {
      id: 'progress-row-6',
      values: { project: '阶段成果评审材料整理', owner: '张三', status: '进行中', progress: '86', dueDate: '2026-08-28', dataFile: 'review-materials.xlsx' },
      updatedAt: '2026-08-25 09:35',
      updatedBy: '张三',
    },
  ]

  return {
    ...table,
    rows,
    attachments: [
      {
        id: 'demo-attachment-1',
        name: 'retrieval-evaluation.csv',
        size: 184_320,
        mimeType: 'text/csv',
        uploadedAt: '2026-08-25 09:40',
        uploadedBy: '张三',
        rowCount: 126,
        source: 'import',
        previewText: 'query_id,precision,recall\nQ001,0.86,0.82\nQ002,0.91,0.88',
      },
      {
        id: 'demo-attachment-2',
        name: 'entity-annotation.xlsx',
        size: 842_752,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadedAt: '2026-08-24 16:10',
        uploadedBy: '李四',
        rowCount: 238,
        source: 'upload',
      },
      {
        id: 'demo-attachment-3',
        name: 'sample-qc.csv',
        size: 96_256,
        mimeType: 'text/csv',
        uploadedAt: '2026-08-24 11:45',
        uploadedBy: '王五',
        rowCount: 64,
        source: 'import',
        previewText: 'sample_id,completeness,quality_flag\nS001,98.4,pass\nS002,72.1,review',
      },
    ],
    share: {
      access: 'team-edit',
      collaborators: ['李四', '王五', '赵敏', '陈晨'],
      updatedAt: '2026-08-25 09:50',
      updatedBy: '张三',
    },
    updatedAt: timestamp,
    updatedBy: '张三',
  }
}

export const createMaterialsExperimentDataTable = (documentId = 9): ResearchDataTable => {
  const table = createBlankResearchDataTable(documentId, 'research-data', '周岚', '2026-07-28 09:10')
  const columns: DataTableColumn[] = [
    { id: 'batch', name: '实验批次', type: 'text', required: true },
    { id: 'material', name: '材料体系', type: 'text', required: true },
    { id: 'temperature', name: '烧结温度（℃）', type: 'number', required: true },
    { id: 'conductivity', name: '室温离子电导率（mS/cm）', type: 'number', required: true },
    { id: 'owner', name: '负责人', type: 'text', required: true },
    { id: 'status', name: '实验状态', type: 'select', required: true, options: ['样品制备', '性能测试', '数据复核', '有风险', '已完成'] },
    { id: 'progress', name: '实验进度', type: 'percent', required: true },
    { id: 'testDate', name: '测试日期', type: 'date', required: true },
    { id: 'dataFile', name: '数据文件', type: 'file', required: true },
  ]
  const rows: ResearchDataRow[] = [
    {
      id: 'material-row-1',
      values: { batch: 'MSE-2608-01', material: 'Li₆PS₅Cl', temperature: '550', conductivity: '3.82', owner: '周岚', status: '已完成', progress: '100', testDate: '2026-08-03', dataFile: 'MSE-2608-01-impedance.csv' },
      updatedAt: '2026-08-04 10:20',
      updatedBy: '周岚',
    },
    {
      id: 'material-row-2',
      values: { batch: 'MSE-2608-02', material: 'Li₆PS₅Cl-0.2LiI', temperature: '520', conductivity: '4.31', owner: '孙昊', status: '数据复核', progress: '92', testDate: '2026-08-08', dataFile: 'MSE-2608-02-cycle.xlsx' },
      updatedAt: '2026-08-24 15:45',
      updatedBy: '孙昊',
    },
    {
      id: 'material-row-3',
      values: { batch: 'MSE-2608-03', material: 'LLZO-Ta0.2', temperature: '1180', conductivity: '0.86', owner: '周岚', status: '性能测试', progress: '68', testDate: '2026-08-15', dataFile: 'MSE-2608-03-eis.csv' },
      updatedAt: '2026-08-25 11:30',
      updatedBy: '周岚',
    },
    {
      id: 'material-row-4',
      values: { batch: 'MSE-2608-04', material: 'LATP-Al0.3', temperature: '850', conductivity: '1.24', owner: '韩梅', status: '性能测试', progress: '55', testDate: '2026-08-18', dataFile: 'MSE-2608-04-xrd.csv' },
      updatedAt: '2026-08-25 14:10',
      updatedBy: '韩梅',
    },
    {
      id: 'material-row-5',
      values: { batch: 'MSE-2608-05', material: 'LPSCl-CPE 复合电解质', temperature: '180', conductivity: '2.16', owner: '孙昊', status: '样品制备', progress: '34', testDate: '2026-08-22', dataFile: 'MSE-2608-05-formulation.xlsx' },
      updatedAt: '2026-08-25 16:25',
      updatedBy: '孙昊',
    },
    {
      id: 'material-row-6',
      values: { batch: 'MSE-2608-06', material: 'LGPS-Si0.1', temperature: '620', conductivity: '5.02', owner: '韩梅', status: '有风险', progress: '47', testDate: '2026-08-24', dataFile: 'MSE-2608-06-stability.csv' },
      updatedAt: '2026-08-26 08:50',
      updatedBy: '韩梅',
    },
  ]
  const attachments: DataTableAttachment[] = [
    { id: 'material-file-1', name: 'MSE-2608-01-impedance.csv', size: 286_720, mimeType: 'text/csv', uploadedAt: '2026-08-04 10:20', uploadedBy: '周岚', rowCount: 96, source: 'import', previewText: 'frequency_hz,z_real,z_imag\n1000000,12.4,-1.8\n100000,13.1,-3.2' },
    { id: 'material-file-2', name: 'MSE-2608-02-cycle.xlsx', size: 1_248_256, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadedAt: '2026-08-24 15:45', uploadedBy: '孙昊', rowCount: 220, source: 'upload' },
    { id: 'material-file-3', name: 'MSE-2608-03-eis.csv', size: 338_944, mimeType: 'text/csv', uploadedAt: '2026-08-25 11:30', uploadedBy: '周岚', rowCount: 112, source: 'import', previewText: 'frequency_hz,z_real,z_imag\n1000000,18.2,-2.1\n100000,19.7,-4.6' },
    { id: 'material-file-4', name: 'MSE-2608-04-xrd.csv', size: 724_992, mimeType: 'text/csv', uploadedAt: '2026-08-25 14:10', uploadedBy: '韩梅', rowCount: 360, source: 'import', previewText: 'two_theta,intensity\n10.00,126\n10.02,131' },
    { id: 'material-file-5', name: 'MSE-2608-05-formulation.xlsx', size: 958_464, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadedAt: '2026-08-25 16:25', uploadedBy: '孙昊', rowCount: 48, source: 'upload' },
    { id: 'material-file-6', name: 'MSE-2608-06-stability.csv', size: 412_672, mimeType: 'text/csv', uploadedAt: '2026-08-26 08:50', uploadedBy: '韩梅', rowCount: 144, source: 'import', previewText: 'time_h,conductivity,retention\n0,5.02,100\n24,4.76,94.8' },
  ]

  return {
    ...table,
    columns,
    rows,
    attachments,
    share: {
      access: 'team-edit',
      collaborators: ['孙昊', '韩梅', '林工'],
      updatedAt: '2026-08-26 09:00',
      updatedBy: '周岚',
    },
    updatedAt: '2026-08-26 09:00',
    updatedBy: '周岚',
  }
}

export const createClinicalSurveyDataTable = (documentId = 10): ResearchDataTable => {
  const table = createBlankResearchDataTable(documentId, 'project-progress', '李医生', '2026-07-15 08:30')
  const columns: DataTableColumn[] = [
    { id: 'project', name: '队列 / 调研任务', type: 'text', required: true },
    { id: 'site', name: '中心 / 地区', type: 'text', required: true },
    { id: 'sampleSize', name: '已纳入样本', type: 'number', required: true },
    { id: 'owner', name: '负责人', type: 'text', required: true },
    { id: 'status', name: '项目状态', type: 'select', required: true, options: ['招募中', '随访中', '数据清洗', '有风险', '已完成'] },
    { id: 'progress', name: '项目进度', type: 'percent', required: true },
    { id: 'dueDate', name: '阶段截止日期', type: 'date', required: true },
    { id: 'dataFile', name: '数据文件', type: 'file', required: true },
  ]
  const rows: ResearchDataRow[] = [
    {
      id: 'clinical-row-1',
      values: { project: '社区高血压基线队列', site: '上海中心', sampleSize: '326', owner: '李医生', status: '数据清洗', progress: '82', dueDate: '2026-09-05', dataFile: 'hypertension-baseline-sh.xlsx' },
      updatedAt: '2026-08-25 17:20',
      updatedBy: '李医生',
    },
    {
      id: 'clinical-row-2',
      values: { project: '2 型糖尿病生活方式随访', site: '江苏中心', sampleSize: '248', owner: '王医生', status: '随访中', progress: '64', dueDate: '2026-10-15', dataFile: 'diabetes-followup-js.csv' },
      updatedAt: '2026-08-25 13:40',
      updatedBy: '王医生',
    },
    {
      id: 'clinical-row-3',
      values: { project: '老年睡眠质量横断面调查', site: '浙江中心', sampleSize: '412', owner: '陈研究员', status: '已完成', progress: '100', dueDate: '2026-08-20', dataFile: 'sleep-quality-zj.xlsx' },
      updatedAt: '2026-08-21 09:15',
      updatedBy: '陈研究员',
    },
    {
      id: 'clinical-row-4',
      values: { project: '青少年屏幕使用行为调查', site: '广东调研组', sampleSize: '587', owner: '刘老师', status: '数据清洗', progress: '76', dueDate: '2026-09-18', dataFile: 'screen-time-gd.csv' },
      updatedAt: '2026-08-24 16:35',
      updatedBy: '刘老师',
    },
    {
      id: 'clinical-row-5',
      values: { project: '慢阻肺用药依从性队列', site: '四川中心', sampleSize: '193', owner: '赵医生', status: '招募中', progress: '45', dueDate: '2026-11-30', dataFile: 'copd-adherence-sc.xlsx' },
      updatedAt: '2026-08-25 10:55',
      updatedBy: '赵医生',
    },
    {
      id: 'clinical-row-6',
      values: { project: '基层医务人员 AI 使用调查', site: '华北五省', sampleSize: '765', owner: '吴老师', status: '有风险', progress: '58', dueDate: '2026-09-28', dataFile: 'primary-care-ai-north.csv' },
      updatedAt: '2026-08-26 09:05',
      updatedBy: '吴老师',
    },
  ]
  const attachments: DataTableAttachment[] = [
    { id: 'clinical-file-1', name: 'hypertension-baseline-sh.xlsx', size: 1_462_272, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadedAt: '2026-08-25 17:20', uploadedBy: '李医生', rowCount: 326, source: 'upload' },
    { id: 'clinical-file-2', name: 'diabetes-followup-js.csv', size: 684_032, mimeType: 'text/csv', uploadedAt: '2026-08-25 13:40', uploadedBy: '王医生', rowCount: 248, source: 'import', previewText: 'subject_id,visit_month,hba1c\nJS001,6,6.8\nJS002,6,7.1' },
    { id: 'clinical-file-3', name: 'sleep-quality-zj.xlsx', size: 1_826_816, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadedAt: '2026-08-21 09:15', uploadedBy: '陈研究员', rowCount: 412, source: 'upload' },
    { id: 'clinical-file-4', name: 'screen-time-gd.csv', size: 1_205_248, mimeType: 'text/csv', uploadedAt: '2026-08-24 16:35', uploadedBy: '刘老师', rowCount: 487, source: 'import', previewText: 'participant_id,daily_screen_hours,sleep_hours\nGD001,4.6,7.2\nGD002,6.1,6.5' },
    { id: 'clinical-file-5', name: 'copd-adherence-sc.xlsx', size: 912_384, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadedAt: '2026-08-25 10:55', uploadedBy: '赵医生', rowCount: 193, source: 'upload' },
    { id: 'clinical-file-6', name: 'primary-care-ai-north.csv', size: 1_548_288, mimeType: 'text/csv', uploadedAt: '2026-08-26 09:05', uploadedBy: '吴老师', rowCount: 465, source: 'import', previewText: 'respondent_id,province,usage_frequency\nHB001,河北,weekly\nSX001,山西,daily' },
  ]

  return {
    ...table,
    columns,
    rows,
    attachments,
    share: {
      access: 'team-edit',
      collaborators: ['王医生', '陈研究员', '刘老师', '赵医生', '吴老师'],
      updatedAt: '2026-08-26 09:10',
      updatedBy: '李医生',
    },
    updatedAt: '2026-08-26 09:10',
    updatedBy: '李医生',
  }
}

export const initialResearchDataTables: ResearchDataTable[] = [
  createDemoResearchDataTable(7),
  createMaterialsExperimentDataTable(9),
  createClinicalSurveyDataTable(10),
]

const emptyStoredState = (): StoredResearchDataTableState => ({
  tables: {},
  deletedDocumentIds: [],
})

const readStoredState = (): StoredResearchDataTableState => {
  if (typeof window === 'undefined') return emptyStoredState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStoredState()
    const parsed = JSON.parse(raw) as Partial<StoredResearchDataTables>
    if (parsed.version !== STORAGE_VERSION || !parsed.tables || typeof parsed.tables !== 'object') {
      return emptyStoredState()
    }

    const tables = Object.fromEntries(
      Object.values(parsed.tables).flatMap((candidate) => {
        const table = sanitizeResearchDataTable(candidate)
        return table ? [[String(table.documentId), table] as const] : []
      }),
    )
    const tableIds = new Set(Object.keys(tables).map(Number))
    const deletedDocumentIds = Array.from(new Set(
      (Array.isArray(parsed.deletedDocumentIds) ? parsed.deletedDocumentIds : [])
        .filter((id): id is number => Number.isInteger(id) && id > 0 && !tableIds.has(id)),
    ))
    return { tables, deletedDocumentIds }
  } catch {
    return emptyStoredState()
  }
}

const writeStoredState = (state: StoredResearchDataTableState): DataTableStorageResult => {
  if (typeof window === 'undefined') {
    return { ok: false, error: '当前环境不支持本地存储，数据尚未保存。' }
  }
  try {
    const serialized = JSON.stringify({ version: STORAGE_VERSION, ...state } satisfies StoredResearchDataTables)
    if (serialized.length > MAX_STORAGE_CHARACTERS) {
      return { ok: false, error: '数据文件占用空间较大，请移除部分文件后重试。' }
    }
    window.localStorage.setItem(STORAGE_KEY, serialized)
    return { ok: true }
  } catch {
    return { ok: false, error: '当前浏览器存储空间不足，数据尚未保存。' }
  }
}

export const loadResearchDataTables = (
  fallbackTables: ResearchDataTable[] = initialResearchDataTables,
): ResearchDataTable[] => {
  const sanitizedFallbacks = fallbackTables
    .map(sanitizeResearchDataTable)
    .filter((table): table is ResearchDataTable => table != null)
  if (typeof window === 'undefined') return sanitizedFallbacks.map(cloneResearchDataTable)

  const stored = readStoredState()
  const deletedIds = new Set(stored.deletedDocumentIds)
  const fallbackIds = new Set(sanitizedFallbacks.map((table) => table.documentId))
  const persistedNewTables = Object.values(stored.tables)
    .filter((table) => !fallbackIds.has(table.documentId) && !deletedIds.has(table.documentId))
  const mergedFallbacks = sanitizedFallbacks
    .filter((table) => !deletedIds.has(table.documentId))
    .map((table) => stored.tables[String(table.documentId)] ?? table)

  return [...persistedNewTables, ...mergedFallbacks].map(cloneResearchDataTable)
}

export const persistResearchDataTable = (table: ResearchDataTable): DataTableStorageResult => {
  if (table.columns.length > DATA_TABLE_IMPORT_LIMITS.maxColumns) {
    return { ok: false, error: `数据表格最多支持 ${DATA_TABLE_IMPORT_LIMITS.maxColumns} 个字段，请精简后重试。` }
  }
  if (table.rows.length > DATA_TABLE_IMPORT_LIMITS.maxRows) {
    return { ok: false, error: `数据表格最多支持 ${DATA_TABLE_IMPORT_LIMITS.maxRows} 条记录，请精简后重试。` }
  }
  if (table.attachments.length > MAX_ATTACHMENTS) {
    return { ok: false, error: `单个数据表格最多保留 ${MAX_ATTACHMENTS} 条文件记录，请移除部分文件后重试。` }
  }
  if (table.rows.some((row) => Object.values(row.values).some(
    (cell) => cell.length > DATA_TABLE_IMPORT_LIMITS.maxCellCharacters,
  ))) {
    return { ok: false, error: `单元格内容不能超过 ${DATA_TABLE_IMPORT_LIMITS.maxCellCharacters} 字，请精简后重试。` }
  }
  if (table.attachments.some((attachment) => attachment.size > DATA_TABLE_IMPORT_LIMITS.maxFileBytes)) {
    return { ok: false, error: '存在超过 2 MiB 的数据文件记录，请移除后重试。' }
  }
  const sanitized = sanitizeResearchDataTable(table)
  if (!sanitized) return { ok: false, error: '数据表格结构无效，操作尚未保存。' }
  const stored = readStoredState()
  return writeStoredState({
    tables: { ...stored.tables, [String(sanitized.documentId)]: sanitized },
    deletedDocumentIds: stored.deletedDocumentIds.filter((id) => id !== sanitized.documentId),
  })
}

export const removeResearchDataTable = (documentId: number): DataTableStorageResult => {
  if (!Number.isInteger(documentId) || documentId <= 0) {
    return { ok: false, error: '无法识别要删除的数据表格。' }
  }
  const stored = readStoredState()
  const tables = { ...stored.tables }
  delete tables[String(documentId)]
  return writeStoredState({
    tables,
    deletedDocumentIds: [documentId, ...stored.deletedDocumentIds.filter((id) => id !== documentId)],
  })
}

export const getResearchDataTableSearchText = (table: ResearchDataTable) => [
  table.template === 'project-progress' ? '科研项目 项目进度 数据表格' : '科研数据 实验数据 数据表格',
  ...table.columns.flatMap((column) => [column.name, ...(column.options ?? [])]),
  ...table.rows.flatMap((row) => [row.updatedBy, ...Object.values(row.values)]),
  ...table.attachments.flatMap((attachment) => [attachment.name, attachment.uploadedBy]),
  ...table.share.collaborators,
].map((value) => value.trim()).filter(Boolean).join(' ')

const escapeDelimitedCell = (value: string) => (
  /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
)

export const exportResearchDataTableCsv = (table: ResearchDataTable) => {
  const header = table.columns.map((column) => escapeDelimitedCell(column.name)).join(',')
  const rows = table.rows.map((row) => (
    table.columns.map((column) => escapeDelimitedCell(row.values[column.id] ?? '')).join(',')
  ))
  return `\uFEFF${[header, ...rows].join('\r\n')}`
}

const inferDelimiter = (input: string): ',' | '\t' => {
  let commas = 0
  let tabs = 0
  let inQuotes = false
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    if (character === '"') {
      if (inQuotes && input[index + 1] === '"') index += 1
      else inQuotes = !inQuotes
    } else if (!inQuotes && (character === '\n' || character === '\r')) {
      break
    } else if (!inQuotes && character === ',') {
      commas += 1
    } else if (!inQuotes && character === '\t') {
      tabs += 1
    }
  }
  return tabs > commas ? '\t' : ','
}

const parseDelimitedRows = (input: string, delimiter: ',' | '\t'): string[][] | string => {
  const parsedRows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false
  let quoteClosed = false
  let rowHasSyntax = false

  const finishCell = () => {
    row.push(cell)
    cell = ''
    quoteClosed = false
  }
  const finishRow = () => {
    finishCell()
    parsedRows.push(row)
    row = []
    rowHasSyntax = false
  }

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    if (inQuotes) {
      if (character === '"') {
        if (input[index + 1] === '"') {
          cell += '"'
          index += 1
        } else {
          inQuotes = false
          quoteClosed = true
        }
      } else {
        cell += character
      }
    } else if (quoteClosed) {
      if (character === delimiter) {
        finishCell()
        rowHasSyntax = true
      } else if (character === '\n' || character === '\r') {
        if (character === '\r' && input[index + 1] === '\n') index += 1
        finishRow()
      } else if (character !== ' ' && character !== '\t') {
        return `第 ${parsedRows.length + 1} 行的引号后存在无效字符。`
      }
    } else if (character === '"') {
      if (cell.length > 0) return `第 ${parsedRows.length + 1} 行存在位置错误的引号。`
      inQuotes = true
      rowHasSyntax = true
    } else if (character === delimiter) {
      finishCell()
      rowHasSyntax = true
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && input[index + 1] === '\n') index += 1
      finishRow()
    } else {
      cell += character
      rowHasSyntax = true
    }

    if (cell.length > DATA_TABLE_IMPORT_LIMITS.maxCellCharacters) {
      return `第 ${parsedRows.length + 1} 行存在超过 ${DATA_TABLE_IMPORT_LIMITS.maxCellCharacters} 字的单元格。`
    }
  }

  if (inQuotes) return `第 ${parsedRows.length + 1} 行存在未闭合的引号。`
  if (rowHasSyntax || row.length > 0 || cell.length > 0 || quoteClosed) finishRow()
  return parsedRows
}

export const parseDelimitedData = (
  source: string,
  preferredDelimiter?: ',' | '\t',
): ParsedDelimitedData => {
  const input = source.replace(/^\uFEFF/, '')
  if (!input.trim()) return { ok: false, error: '文件内容为空，未导入任何数据。' }

  const delimiter = preferredDelimiter ?? inferDelimiter(input)
  const result = parseDelimitedRows(input, delimiter)
  if (typeof result === 'string') return { ok: false, error: result }

  const nonEmptyRows = result.filter((row) => row.some((cell) => cell.trim()))
  if (!nonEmptyRows.length) return { ok: false, error: '文件内容为空，未导入任何数据。' }

  const headers = nonEmptyRows[0].map((header) => header.trim())
  if (headers.length > DATA_TABLE_IMPORT_LIMITS.maxColumns) {
    return { ok: false, error: `最多支持 ${DATA_TABLE_IMPORT_LIMITS.maxColumns} 列，请精简后重试。` }
  }
  if (headers.some((header) => !header)) {
    return { ok: false, error: '表头存在空名称，请补齐后重试。' }
  }
  const normalizedHeaders = headers.map((header) => header.toLocaleLowerCase())
  if (new Set(normalizedHeaders).size !== normalizedHeaders.length) {
    return { ok: false, error: '表头名称不能重复，请修改后重试。' }
  }

  const rows = nonEmptyRows.slice(1)
  if (rows.length > DATA_TABLE_IMPORT_LIMITS.maxRows) {
    return { ok: false, error: `单次最多导入 ${DATA_TABLE_IMPORT_LIMITS.maxRows} 行，请拆分文件后重试。` }
  }
  const normalizedRows: string[][] = []
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]
    if (row.length > headers.length) {
      return { ok: false, error: `第 ${index + 2} 行的列数超过表头，请检查分隔符或内容。` }
    }
    const cells = Array.from({ length: headers.length }, (_, columnIndex) => row[columnIndex] ?? '')
    if (cells.some((cell) => cell.length > DATA_TABLE_IMPORT_LIMITS.maxCellCharacters)) {
      return { ok: false, error: `第 ${index + 2} 行存在超过 ${DATA_TABLE_IMPORT_LIMITS.maxCellCharacters} 字的单元格。` }
    }
    normalizedRows.push(cells)
  }

  return { ok: true, headers, rows: normalizedRows, delimiter }
}

export const estimateResearchDataTableSize = (table: ResearchDataTable) => {
  const bytes = new TextEncoder().encode(JSON.stringify(table)).byteLength
  if (bytes < 1024) return `${Math.max(1, bytes)} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

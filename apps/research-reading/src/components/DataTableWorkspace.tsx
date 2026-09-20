import {displayMinute} from '../displayFormat'
import { SpreadsheetGrid } from './SpreadsheetGrid'
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'

import { usePrototypeFocus } from '../prototypeFocus/FocusContext'
import type {
  DataTableColumn,
  DataTableColumnType,
  DataTableShareAccess,
  ResearchDataRow,
  ResearchDataTable,
  ResearchDocument,
} from '../types'

import { Modal } from './Modal'

type ViewMode = 'table' | 'form'
type SaveState = 'saved' | 'dirty' | 'saving' | 'error'
type SortDirection = 'asc' | 'desc'

interface DataTableWorkspaceProps {
  documentItem: ResearchDocument
  table: ResearchDataTable
  currentUser: string
  teamName: string
  onShareMove?: () => void
  collaboratorOptions: string[]
  initialSearchQuery?: string
  initialAction?: 'import' | 'share' | 'files'
  onClose: () => void
  onSave: (value: { title: string; table: ResearchDataTable }) => string | null
  onToast: (message: string) => void
  onNavigationGuardChange: (guard: (() => boolean) | null) => void
}

interface FieldDraft {
  mode: 'add' | 'edit'
  columnId?: string
  name: string
  type: DataTableColumnType
  required: boolean
  options: string
  error: string
}

interface UndoState {
  table: ResearchDataTable
  message: string
}

const columnTypeLabels: Record<DataTableColumnType, string> = {
  text: '文本',
  number: '数字',
  select: '单选',
  date: '日期',
  percent: '进度',
  file: '文件名',
}

const formatTimestamp = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const normalizedValue = (value: string) => value.normalize('NFC').trim().toLocaleLowerCase()

const isValidIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

const downloadText = (content: string, fileName: string, type = 'text/csv;charset=utf-8') => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

const blankValues = (columns: DataTableColumn[]) => Object.fromEntries(columns.map((column) => [column.id, '']))

const statusClass = (value: string) => {
  if (/完成|已归档|低/.test(value)) return 'is-success'
  if (/进行|中/.test(value)) return 'is-active'
  if (/延期|阻塞|高/.test(value)) return 'is-danger'
  return 'is-neutral'
}

export function DataTableWorkspace({
  documentItem,
  table: initialTable,
  currentUser,
  teamName,
  onShareMove,
  collaboratorOptions,
  initialSearchQuery = '',
  initialAction,
  onClose,
  onSave,
  onToast,
  onNavigationGuardChange,
}: DataTableWorkspaceProps) {
  const [table, setTable] = useState(initialTable)
  const [title, setTitle] = useState(documentItem.title)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [saveError, setSaveError] = useState('')
  const [lastSavedAt, setLastSavedAt] = useState(displayMinute(initialTable.updatedAt).slice(-5))
  const [query, setQuery] = useState(initialSearchQuery)
  const [statusFilter, setStatusFilter] = useState('全部状态')
  const [sort, setSort] = useState<{ columnId: string; direction: SortDirection } | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [activeRowId, setActiveRowId] = useState<string | null>(initialTable.rows[0]?.id ?? null)
  const [formValues, setFormValues] = useState<Record<string, string>>(
    initialTable.rows[0]?.values ?? blankValues(initialTable.columns),
  )
  const [formIsNew, setFormIsNew] = useState(initialTable.rows.length === 0)
  const [recordEditorOpen, setRecordEditorOpen] = useState(false)
  const [formDirty, setFormDirty] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [undo, setUndo] = useState<UndoState | null>(null)
  const [shareOpen, setShareOpen] = useState(initialAction === 'share')
  const [shareAccess, setShareAccess] = useState<DataTableShareAccess>(initialTable.share.access)
  const [shareCollaborators, setShareCollaborators] = useState<string[]>(initialTable.share.collaborators)
  const [fieldDraft, setFieldDraft] = useState<FieldDraft | null>(null)
  const [filesOpen, setFilesOpen] = useState(initialAction === 'files')
  const [previewAttachmentId, setPreviewAttachmentId] = useState<string | null>(null)
  const tableRef = useRef(table)
  const titleRef = useRef(title)
  const onSaveRef = useRef(onSave)
  const saveTimerRef = useRef<number | null>(null)
  const saveStateRef = useRef(saveState)
  const formDirtyRef = useRef(formDirty)
  const navigationGuardRef = useRef<() => boolean>(() => true)
  const firstFormErrorRef = useRef<HTMLElement | null>(null)
  const backButtonRef = useRef<HTMLButtonElement | null>(null)

  tableRef.current = table
  titleRef.current = title
  onSaveRef.current = onSave
  saveStateRef.current = saveState
  formDirtyRef.current = formDirty

  const updateSaveState = (nextState: SaveState) => {
    saveStateRef.current = nextState
    setSaveState(nextState)
  }

  const updateFormDirty = (nextDirty: boolean) => {
    formDirtyRef.current = nextDirty
    setFormDirty(nextDirty)
  }

  const statusColumn = table.columns.find((column) => column.type === 'select' && /阶段|状态/.test(column.name))
  const progressColumn = table.columns.find((column) => column.type === 'percent')
  const previewAttachment = previewAttachmentId
    ? table.attachments.find((attachment) => attachment.id === previewAttachmentId)
    : undefined
  const nestedModalOpen = recordEditorOpen || shareOpen || Boolean(fieldDraft) || filesOpen || Boolean(previewAttachment)
  const {request: focusRequest, ready: focusReady, reject: focusReject} = usePrototypeFocus()
  useEffect(() => {
    if (focusRequest?.module !== 'research' || focusRequest.target?.surface !== 'table') return
    if (nestedModalOpen || formDirty) { focusReject(focusRequest.sequence, `${focusRequest.id}：请先处理当前表格中的表单或弹窗，定位已停止。`); return }
    setViewMode(focusRequest.id === 'R9.9' ? 'form' : 'table')
    focusReady(focusRequest.sequence)
  }, [focusRequest, focusReady, focusReject])

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const frame = window.requestAnimationFrame(() => backButtonRef.current?.focus())
    return () => {
      window.cancelAnimationFrame(frame)
      window.requestAnimationFrame(() => previouslyFocused?.focus())
    }
  }, [])

  const markChanged = (updater: (current: ResearchDataTable) => ResearchDataTable) => {
    const timestamp = formatTimestamp()
    setTable((current) => {
      const next = updater(current)
      return { ...next, updatedAt: timestamp, updatedBy: currentUser }
    })
    updateSaveState('dirty')
    setSaveError('')
  }

  const validateTable = (candidate: ResearchDataTable) => {
    for (const row of candidate.rows) {
      for (const column of candidate.columns) {
        const value = row.values[column.id]?.trim() ?? ''
        if (column.required && !value) return `“${column.name}”为必填字段，请补齐后保存。`
        if (column.type === 'number' && value && !value.startsWith('=') && !Number.isFinite(Number(value))) return `“${column.name}”中存在无效数字。`
        if (column.type === 'select' && value && !column.options?.includes(value)) return `“${column.name}”中存在不属于选项的值。`
        if (column.type === 'date' && value && !isValidIsoDate(value)) return `“${column.name}”中存在无效日期。`
        if (column.type === 'percent' && value && (Number(value) < 0 || Number(value) > 100 || !Number.isFinite(Number(value)))) {
          return `“${column.name}”应为 0 至 100 之间的数字。`
        }
      }
    }
    return ''
  }

  const saveNow = (candidate = tableRef.current, candidateTitle = titleRef.current) => {
    if (!candidateTitle.normalize('NFC').trim()) {
      updateSaveState('error')
      setSaveError('表格名称不能为空。')
      return false
    }
    const validationError = validateTable(candidate)
    if (validationError) {
      updateSaveState('error')
      setSaveError(validationError)
      return false
    }
    updateSaveState('saving')
    const error = onSaveRef.current({ title: candidateTitle.normalize('NFC').trim(), table: candidate })
    if (error) {
      updateSaveState('error')
      setSaveError(error)
      return false
    }
    updateSaveState('saved')
    setSaveError('')
    setLastSavedAt(formatTimestamp().slice(-5))
    return true
  }

  useEffect(() => {
    if (saveState !== 'dirty') return
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
    saveTimerRef.current = window.setTimeout(() => saveNow(), 850)
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
    }
  }, [saveState, table, title])

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (saveState === 'saved' && !formDirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== 's') return
      if (recordEditorOpen) return
      event.preventDefault()
      saveNow()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [formDirty, recordEditorOpen, saveState])

  const attemptWorkspaceLeave = () => {
    let discardFormDraft = false
    if (formDirtyRef.current) {
      if (!window.confirm('当前表单记录有未提交修改，离开后将丢失。仍要返回吗？')) return false
      discardFormDraft = true
    }
    if (saveStateRef.current !== 'saved' && !saveNow()) return false
    if (discardFormDraft) updateFormDirty(false)
    return true
  }

  navigationGuardRef.current = attemptWorkspaceLeave

  useEffect(() => {
    const guard = () => navigationGuardRef.current()
    onNavigationGuardChange(guard)
    return () => onNavigationGuardChange(null)
  }, [onNavigationGuardChange])

  const handleClose = () => {
    if (!attemptWorkspaceLeave()) return
    onNavigationGuardChange(null)
    onClose()
  }

  useEffect(() => {
    const closeWorkspaceFromKeyboard = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || nestedModalOpen) return
      event.preventDefault()
      handleClose()
    }
    window.addEventListener('keydown', closeWorkspaceFromKeyboard)
    return () => window.removeEventListener('keydown', closeWorkspaceFromKeyboard)
  }, [formDirty, nestedModalOpen, saveState])

  const updateCell = (rowId: string, columnId: string, value: string) => {
    markChanged((current) => ({
      ...current,
      rows: current.rows.map((row) => row.id === rowId
        ? { ...row, values: { ...row.values, [columnId]: value }, updatedAt: formatTimestamp(), updatedBy: currentUser }
        : row),
    }))
  }

  const handleCellKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    rowId: string,
    columnId: string,
  ) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
      return
    }
    if (event.key !== 'Escape') return
    event.preventDefault()
    updateCell(rowId, columnId, event.currentTarget.dataset.originalValue ?? '')
    event.currentTarget.blur()
  }

  const statusOptions = statusColumn?.options ?? []
  const filteredRows = useMemo(() => {
    const normalizedQuery = normalizedValue(query)
    const rows = table.rows.filter((row) => {
      const matchesQuery = !normalizedQuery || normalizedValue(`${Object.values(row.values).join(' ')} ${row.updatedBy}`).includes(normalizedQuery)
      const matchesStatus = statusFilter === '全部状态' || row.values[statusColumn?.id ?? ''] === statusFilter
      return matchesQuery && matchesStatus
    })
    if (!sort) return rows
    return [...rows].sort((first, second) => {
      const firstValue = first.values[sort.columnId] ?? ''
      const secondValue = second.values[sort.columnId] ?? ''
      const comparison = firstValue.localeCompare(secondValue, 'zh-CN', { numeric: true })
      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [query, sort, statusColumn?.id, statusFilter, table.rows])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pagedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => setPage(1), [query, statusFilter, pageSize])

  useEffect(() => {
    if (filteredRows.length === 0) {
      if (activeRowId !== null) setActiveRowId(null)
      return
    }
    if (!activeRowId || !filteredRows.some((row) => row.id === activeRowId)) {
      setActiveRowId(filteredRows[0].id)
    }
  }, [activeRowId, filteredRows])

  const cycleSort = (columnId: string) => {
    setSort((current) => {
      if (!current || current.columnId !== columnId) return { columnId, direction: 'asc' }
      if (current.direction === 'asc') return { columnId, direction: 'desc' }
      return null
    })
  }

  const openNewRecord = () => {
    if (formDirty && !window.confirm('当前表单有未提交修改，是否放弃并新建记录？')) return
    setFormValues(blankValues(table.columns))
    setFormIsNew(true)
    updateFormDirty(false)
    setFormErrors({})
    setRecordEditorOpen(true)
  }

  const openRecord = (row: ResearchDataRow) => {
    if (formDirty && !window.confirm('当前表单有未提交修改，是否放弃并切换记录？')) return
    setActiveRowId(row.id)
    setFormValues({ ...blankValues(table.columns), ...row.values })
    setFormIsNew(false)
    updateFormDirty(false)
    setFormErrors({})
    setRecordEditorOpen(true)
  }

  const closeRecordEditor = () => {
    if (formDirty && !window.confirm('当前记录有未保存修改，确定放弃吗？')) return
    setRecordEditorOpen(false)
    updateFormDirty(false)
    setFormErrors({})
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    table.columns.forEach((column) => {
      const value = formValues[column.id]?.trim() ?? ''
      if (column.required && !value) errors[column.id] = `请输入${column.name}`
      if (column.type === 'number' && value && !value.startsWith('=') && !Number.isFinite(Number(value))) errors[column.id] = '请输入有效数字'
      if (column.type === 'percent' && value && (Number(value) < 0 || Number(value) > 100 || !Number.isFinite(Number(value)))) {
        errors[column.id] = '请输入 0 至 100 之间的数字'
      }
    })
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const commitRecord = () => {
    if (formIsNew && table.rows.length >= 500) {
      setFormErrors({ _form: '单个表格最多支持 500 条记录，请先导出或精简数据。' })
      return false
    }
    if (!validateForm()) {
      window.requestAnimationFrame(() => firstFormErrorRef.current?.focus())
      return false
    }
    const timestamp = formatTimestamp()
    const nextRowId = formIsNew ? createId('row') : activeRowId
    if (!nextRowId) return false
    markChanged((current) => ({
      ...current,
      rows: formIsNew
        ? [...current.rows, { id: nextRowId, values: { ...formValues }, updatedAt: timestamp, updatedBy: currentUser }]
        : current.rows.map((row) => row.id === nextRowId
          ? { ...row, values: { ...formValues }, updatedAt: timestamp, updatedBy: currentUser }
          : row),
    }))
    setActiveRowId(nextRowId)
    setFormIsNew(false)
    updateFormDirty(false)
    setRecordEditorOpen(false)
    onToast(formIsNew ? '记录已添加' : '记录已更新')
    return true
  }

  const submitRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    commitRecord()
  }

  useEffect(() => {
    if (!recordEditorOpen) return
    const saveRecordFromKeyboard = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== 's') return
      event.preventDefault()
      commitRecord()
    }
    window.addEventListener('keydown', saveRecordFromKeyboard)
    return () => window.removeEventListener('keydown', saveRecordFromKeyboard)
  }, [activeRowId, formIsNew, formValues, recordEditorOpen, table.columns, table.rows.length])

  const deleteRows = (rowIds: string[]) => {
    if (!rowIds.length || !window.confirm(`删除选中的 ${rowIds.length} 条记录？删除后可立即撤销。`)) return
    const activeIndex = activeRowId ? filteredRows.findIndex((row) => row.id === activeRowId) : -1
    const remainingFilteredRows = filteredRows.filter((row) => !rowIds.includes(row.id))
    const nextActiveRow = activeIndex >= 0
      ? remainingFilteredRows[Math.min(activeIndex, remainingFilteredRows.length - 1)]
      : undefined
    setUndo({ table, message: `已删除 ${rowIds.length} 条记录` })
    markChanged((current) => ({ ...current, rows: current.rows.filter((row) => !rowIds.includes(row.id)) }))
    setSelectedRows([])
    if (activeRowId && rowIds.includes(activeRowId)) {
      setActiveRowId(nextActiveRow?.id ?? null)
      setFormIsNew(!nextActiveRow)
      setFormValues(nextActiveRow?.values ?? blankValues(table.columns))
    }
  }

  const undoLastChange = () => {
    if (!undo) return
    setTable({ ...undo.table, updatedAt: formatTimestamp(), updatedBy: currentUser })
    updateSaveState('dirty')
    setUndo(null)
    onToast('已撤销上一项操作')
  }

  const renderCellEditor = (row: ResearchDataRow, column: DataTableColumn) => {
    const value = row.values[column.id] ?? ''
    if (column.type === 'select') {
      return (
        <select aria-label={`${row.values[table.columns[0]?.id] || '未命名记录'}的${column.name}`} value={value} onFocus={(event) => { event.currentTarget.dataset.originalValue = value }} onKeyDown={(event) => handleCellKeyDown(event, row.id, column.id)} onChange={(event) => updateCell(row.id, column.id, event.target.value)}>
          <option value="">请选择</option>
          {(column.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      )
    }
    if (column.type === 'percent') {
      const percent = Math.max(0, Math.min(100, Number(value) || 0))
      return <div className="data-sheet-progress-cell"><span><i style={{ width: `${percent}%` }} /></span><input aria-label={`${column.name}百分比`} type="number" min="0" max="100" value={value} onFocus={(event) => { event.currentTarget.dataset.originalValue = value }} onKeyDown={(event) => handleCellKeyDown(event, row.id, column.id)} onChange={(event) => updateCell(row.id, column.id, event.target.value)} /><b>%</b></div>
    }
    return (
      <input
        aria-label={`${row.values[table.columns[0]?.id] || '未命名记录'}的${column.name}`}
        type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
        value={value}
        onFocus={(event) => { event.currentTarget.dataset.originalValue = value }}
        onKeyDown={(event) => handleCellKeyDown(event, row.id, column.id)}
        onChange={(event) => updateCell(row.id, column.id, event.target.value)}
      />
    )
  }

  const openAddField = () => {
    if (table.columns.length >= 30) {
      onToast('单个表格最多支持 30 个字段')
      return
    }
    setFieldDraft({ mode: 'add', name: '', type: 'text', required: false, options: '', error: '' })
  }

  const openEditField = (column: DataTableColumn) => setFieldDraft({
    mode: 'edit',
    columnId: column.id,
    name: column.name,
    type: column.type,
    required: column.required,
    options: column.options?.join('、') ?? '',
    error: '',
  })

  const submitField = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!fieldDraft) return
    const name = fieldDraft.name.normalize('NFC').trim()
    if (!name) {
      setFieldDraft({ ...fieldDraft, error: '请输入字段名称。' })
      return
    }
    if (table.columns.some((column) => column.id !== fieldDraft.columnId && normalizedValue(column.name) === normalizedValue(name))) {
      setFieldDraft({ ...fieldDraft, error: '字段名称不能重复。' })
      return
    }
    const options = fieldDraft.type === 'select'
      ? fieldDraft.options.split(/[、,，\n]/).map((item) => item.trim()).filter(Boolean)
      : undefined
    if (fieldDraft.type === 'select' && !options?.length) {
      setFieldDraft({ ...fieldDraft, error: '单选字段至少需要一个选项。' })
      return
    }
    const previous = fieldDraft.columnId ? table.columns.find((column) => column.id === fieldDraft.columnId) : undefined
    if (previous && previous.type !== fieldDraft.type && table.rows.some((row) => row.values[previous.id]?.trim())) {
      if (!window.confirm('修改字段类型可能使现有值不符合格式，仍要继续吗？')) return
    }
    setUndo({ table, message: previous ? '已修改字段' : '已添加字段' })
    const columnId = fieldDraft.columnId ?? createId('column')
    const nextColumn: DataTableColumn = { id: columnId, name, type: fieldDraft.type, required: fieldDraft.required, options }
    markChanged((current) => ({
      ...current,
      columns: previous
        ? current.columns.map((column) => column.id === columnId ? nextColumn : column)
        : [...current.columns, nextColumn],
      rows: previous ? current.rows : current.rows.map((row) => ({ ...row, values: { ...row.values, [columnId]: '' } })),
    }))
    if (!previous) setFormValues((current) => ({ ...current, [columnId]: '' }))
    setFieldDraft(null)
    onToast(previous ? '字段设置已更新' : '字段已添加')
  }

  const deleteField = () => {
    if (!fieldDraft?.columnId || table.columns.length <= 1) return
    const column = table.columns.find((item) => item.id === fieldDraft.columnId)
    if (!column || !window.confirm(`删除字段“${column.name}”？该字段中的数据也会删除。`)) return
    setUndo({ table, message: `已删除字段“${column.name}”` })
    markChanged((current) => ({
      ...current,
      columns: current.columns.filter((item) => item.id !== column.id),
      rows: current.rows.map((row) => {
        const values = { ...row.values }
        delete values[column.id]
        return { ...row, values }
      }),
    }))
    setFormValues((current) => {
      const next = { ...current }
      delete next[column.id]
      return next
    })
    setFieldDraft(null)
    onToast('字段已删除，可撤销')
  }

  const openShareDialog = () => {
    if (formDirty) {
      onToast('请先保存当前表单记录，再设置分享权限')
      return
    }
    setShareAccess(table.share.access)
    setShareCollaborators(table.share.collaborators)
    setShareOpen(true)
  }


  const submitShare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (shareAccess !== 'private' && shareCollaborators.length === 0) return
    const timestamp = formatTimestamp()
    const next = {
      ...table,
      share: {
        access: shareAccess,
        collaborators: shareAccess === 'private' ? [] : shareCollaborators,
        updatedAt: timestamp,
        updatedBy: currentUser,
      },
      updatedAt: timestamp,
      updatedBy: currentUser,
    }
    setTable(next)
    tableRef.current = next
    updateSaveState('dirty')
    setShareOpen(false)
    window.setTimeout(() => saveNow(next), 0)
    onToast(shareAccess === 'private' ? '已取消团队分享' : '本地分享权限已保存')
  }

  const copyLocalLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#table=${documentItem.id}`
    try {
      await navigator.clipboard.writeText(url)
      onToast('本地预览链接已复制')
    } catch {
      window.prompt('复制下面的本地预览链接：', url)
    }
  }

  const completedCount = statusColumn
    ? table.rows.filter((row) => /完成|已归档/.test(row.values[statusColumn.id] ?? '')).length
    : 0
  const averageProgress = progressColumn && table.rows.length
    ? Math.round(table.rows.reduce((sum, row) => sum + (Number(row.values[progressColumn.id]) || 0), 0) / table.rows.length)
    : 0
  const requiredColumns = table.columns.filter((column) => column.required)
  const completeDataRows = table.rows.filter((row) => requiredColumns.every((column) => row.values[column.id]?.trim())).length
  const populatedCellCount = table.rows.reduce((sum, row) => sum + table.columns.filter((column) => row.values[column.id]?.trim()).length, 0)
  const dataCompleteness = table.rows.length && table.columns.length
    ? Math.round(populatedCellCount / (table.rows.length * table.columns.length) * 100)
    : 0
  const isProjectProgress = table.template === 'project-progress'
  const primaryColumn = table.columns[0]
  const ownerColumn = table.columns.find((column) => /负责人|责任人|采集人|上传人|所有者/.test(column.name))
    ?? table.columns.find((column) => column.id !== primaryColumn?.id && column.type === 'text')
  const activeRow = (activeRowId ? filteredRows.find((row) => row.id === activeRowId) : undefined) ?? filteredRows[0]
  const activeRowIndex = activeRow ? filteredRows.findIndex((row) => row.id === activeRow.id) : -1

  const saveStateLabel = formDirty ? '表单草稿未提交' : saveState === 'saved'
    ? `已保存 · ${lastSavedAt}`
    : saveState === 'saving' ? '正在保存' : saveState === 'error' ? '保存失败' : '有未保存修改'

  return (
    <section
      className="data-sheet-workspace"
      role={nestedModalOpen ? undefined : 'dialog'}
      aria-modal={nestedModalOpen ? undefined : true}
      aria-label={nestedModalOpen ? undefined : `${title}数据表格编辑器`}
    >
      <header className="data-sheet-header" aria-hidden={nestedModalOpen ? true : undefined} inert={nestedModalOpen ? true : undefined}>
        <button ref={backButtonRef} className="data-sheet-back" type="button" onClick={handleClose}><span aria-hidden="true" />返回</button>
        <div className="data-sheet-title-area">
          <input aria-label="数据表格名称" maxLength={50} value={title} onChange={(event) => { setTitle(event.target.value); updateSaveState('dirty'); setSaveError('') }} />
        </div>
        <div className="data-sheet-save-area">
          <span className={`data-sheet-save-state is-${formDirty ? 'dirty' : saveState}`} role="status"><i />{saveStateLabel}</span>
          <button className="button button--secondary data-sheet-share-button" type="button" onClick={openShareDialog}>
            <img className="iconpark-control-icon" src="/assets/iconpark/share.svg" alt="" />分享
          </button>
          <button className="button button--primary" type="button" disabled={saveState === 'saving'} onClick={() => saveNow()}>保存</button>
        </div>
      </header>

      <div className="data-sheet-toolbar" aria-hidden={nestedModalOpen ? true : undefined} inert={nestedModalOpen ? true : undefined}>
        <div className="data-sheet-view-switch" role="tablist" aria-label="数据展示视图">
          <button id="data-sheet-tab-table" type="button" role="tab" aria-controls="data-sheet-panel-table" aria-selected={viewMode === 'table'} tabIndex={viewMode === 'table' ? 0 : -1} className={viewMode === 'table' ? 'is-active' : ''} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); setViewMode('form'); event.currentTarget.nextElementSibling instanceof HTMLElement && event.currentTarget.nextElementSibling.focus() } }} onClick={() => setViewMode('table')}><img className="data-sheet-tab-icon" src="/assets/iconpark/grid-nine.svg" alt="" />表格视图</button>
          <button id="data-sheet-tab-form" type="button" role="tab" aria-controls="data-sheet-panel-form" aria-selected={viewMode === 'form'} tabIndex={viewMode === 'form' ? 0 : -1} className={viewMode === 'form' ? 'is-active' : ''} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); setViewMode('table'); event.currentTarget.previousElementSibling instanceof HTMLElement && event.currentTarget.previousElementSibling.focus() } }} onClick={() => setViewMode('form')}><img className="data-sheet-tab-icon" src="/assets/iconpark/form-one.svg" alt="" />表单视图</button>
        </div>
        
      </div>

      {saveError && (
        <div className="data-sheet-error" role="alert" aria-hidden={nestedModalOpen ? true : undefined} inert={nestedModalOpen ? true : undefined}>
          <strong>表格保存失败</strong><span>{saveError}</span>
          <div><button type="button" onClick={() => saveNow()}>重试保存</button><button type="button" onClick={()=>downloadText(JSON.stringify(table,null,2),title+'.json','application/json')}>备份未保存内容</button></div>
        </div>
      )}

      <div data-focus-id="research-table-records" className="data-sheet-body" aria-hidden={nestedModalOpen ? true : undefined} inert={nestedModalOpen ? true : undefined}>
        {viewMode === 'table' ? (
          <section id="data-sheet-panel-table" className="data-sheet-panel" role="tabpanel" aria-labelledby="data-sheet-tab-table">
            <SpreadsheetGrid table={table} onChange={next => markChanged(() => next)} />
          </section>
        ) : (
          <section id="data-sheet-panel-form" className="data-sheet-form-view" role="tabpanel" aria-labelledby="data-sheet-tab-form">
            {table.rows.length === 0 ? (
              <div className="data-sheet-empty data-sheet-form-empty">
                <img src="/assets/document-sheet.svg" alt="" /><strong>暂无记录</strong><p>新增记录后，可在表单视图中逐条查看全部字段。</p>
                <div><button className="button button--primary" type="button" onClick={openNewRecord}>新增记录</button></div>
              </div>
            ) : <>
              <aside aria-label="表单视图记录导航">
                <header>
                  <div><strong>记录列表</strong><span>当前显示 {filteredRows.length} 条</span></div>
                  {(query || statusFilter !== '全部状态') && <button type="button" onClick={() => { setQuery(''); setStatusFilter('全部状态') }}>清除筛选</button>}
                </header>
                <label>
                  <img src="/assets/reading/search.svg" alt="" />
                  <input aria-label="搜索表单视图记录" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索记录" />
                </label>
                <div role="listbox" aria-label="记录列表">
                  {filteredRows.map((row, index) => {
                    const owner = ownerColumn ? row.values[ownerColumn.id] : ''
                    return <button
                      key={row.id}
                      type="button"
                      role="option"
                      aria-selected={row.id === activeRow?.id}
                      aria-controls="data-sheet-active-record"
                      className={row.id === activeRow?.id ? 'is-active' : ''}
                      onClick={() => setActiveRowId(row.id)}
                      onKeyDown={(event) => {
                        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
                        event.preventDefault()
                        const buttons = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button[role="option"]') ?? [])
                        const nextIndex = event.key === 'Home'
                          ? 0
                          : event.key === 'End'
                            ? filteredRows.length - 1
                            : event.key === 'ArrowDown'
                              ? Math.min(index + 1, filteredRows.length - 1)
                              : Math.max(index - 1, 0)
                        setActiveRowId(filteredRows[nextIndex].id)
                        window.requestAnimationFrame(() => buttons[nextIndex]?.focus())
                      }}
                    >
                      <i>{String(index + 1).padStart(2, '0')}</i>
                      <span><strong>{row.values[primaryColumn?.id] || '未命名记录'}</strong><small>{owner || row.updatedBy} · {displayMinute(row.updatedAt)}</small></span>
                      <b aria-hidden="true">›</b>
                    </button>
                  })}
                </div>
              </aside>

              {activeRow ? (
                <article id="data-sheet-active-record" className="data-sheet-record-form" aria-label={`${activeRow.values[primaryColumn?.id] || '未命名记录'}详情`}>
                  <header>
                    <div><span>第 {activeRowIndex + 1} / {filteredRows.length} 条 · 记录详情</span><h2>{activeRow.values[primaryColumn?.id] || '未命名记录'}</h2></div>
                    <span>{activeRow.updatedBy} 更新于 {displayMinute(activeRow.updatedAt)}</span>
                  </header>
                  <dl className="data-sheet-record-details">
                    {table.columns.map((column) => {
                      const value = activeRow.values[column.id] ?? ''
                      const displayValue = value ? (column.type === 'percent' ? `${value}%` : value) : '—'
                      return <div key={column.id}>
                        <dt>{column.required && <em>*</em>}{column.name}<small>{columnTypeLabels[column.type]}</small></dt>
                        <dd title={displayValue}>{displayValue}</dd>
                      </div>
                    })}
                  </dl>
                  <footer>
                    <button className="button button--danger" type="button" onClick={() => deleteRows([activeRow.id])}>删除记录</button>
                    <button className="button button--primary" type="button" onClick={() => openRecord(activeRow)}>编辑记录</button>
                  </footer>
                </article>
              ) : (
                <div className="data-sheet-empty">
                  <img src="/assets/document-sheet.svg" alt="" /><strong>没有符合条件的记录</strong><p>调整搜索条件，或清除当前筛选后再试。</p>
                  <div><button className="button button--secondary" type="button" onClick={() => { setQuery(''); setStatusFilter('全部状态') }}>清除筛选</button></div>
                </div>
              )}
            </>}
          </section>
        )}
      </div>

      {undo && <div className="data-sheet-undo" role="status" aria-hidden={nestedModalOpen ? true : undefined} inert={nestedModalOpen ? true : undefined}><span>{undo.message}</span><button type="button" onClick={undoLastChange}>撤销</button><button type="button" aria-label="关闭撤销提示" onClick={() => setUndo(null)}>×</button></div>}

      {recordEditorOpen && (
        <Modal
          title={formIsNew ? '新增记录' : '编辑记录'}
          onClose={closeRecordEditor}
          onSubmit={submitRecord}
          confirmText={formIsNew ? '新增并保存' : '保存记录'}
          cancelText="取消"
          extraWide
          bodyClassName="data-sheet-record-modal"
        >
          {Object.keys(formErrors).length > 0 && <div className="data-sheet-form-errors" role="alert"><strong>请检查 {Object.keys(formErrors).filter((key) => key !== '_form').length || 1} 个字段</strong><span>{formErrors._form || '已保留当前输入，请从标红字段开始修正。'}</span></div>}
          <div className="data-sheet-form-fields">{table.columns.map((column, index) => <label key={column.id}><span>{column.required && <em>*</em>}{column.name}<small>{columnTypeLabels[column.type]}</small></span>{column.type === 'select'
            ? <select ref={(element) => { if (formErrors[column.id] && index === table.columns.findIndex((item) => formErrors[item.id])) firstFormErrorRef.current = element }} aria-invalid={Boolean(formErrors[column.id])} value={formValues[column.id] ?? ''} onChange={(event) => { setFormValues((current) => ({ ...current, [column.id]: event.target.value })); updateFormDirty(true); setFormErrors((current) => ({ ...current, [column.id]: '' })) }}><option value="">请选择</option>{(column.options ?? []).map((option) => <option key={option}>{option}</option>)}</select>
            : <input autoFocus={index === 0} ref={(element) => { if (formErrors[column.id] && index === table.columns.findIndex((item) => formErrors[item.id])) firstFormErrorRef.current = element }} aria-invalid={Boolean(formErrors[column.id])} type={column.type === 'number' || column.type === 'percent' ? 'number' : column.type === 'date' ? 'date' : 'text'} min={column.type === 'percent' ? 0 : undefined} max={column.type === 'percent' ? 100 : undefined} value={formValues[column.id] ?? ''} onChange={(event) => { setFormValues((current) => ({ ...current, [column.id]: event.target.value })); updateFormDirty(true); setFormErrors((current) => ({ ...current, [column.id]: '' })) }} />}{formErrors[column.id] && <b>{formErrors[column.id]}</b>}</label>)}</div>
        </Modal>
      )}


      {shareOpen && <Modal title="分享文件" onClose={()=>setShareOpen(false)} onSubmit={e=>{e.preventDefault();if(formDirty){onToast('请先保存表单记录');return}if(!saveNow())return;setShareOpen(false);onShareMove?.()}} confirmText="选择目标位置"><p>分享将移动此表格。访问权限跟随目标空间，原位置不保留，不按文件单独指定成员。</p></Modal>}

      {fieldDraft && (
        <Modal title={fieldDraft.mode === 'add' ? '添加字段' : '字段设置'} onClose={() => setFieldDraft(null)} onSubmit={submitField} confirmText="保存字段">
          <label className="field-label" htmlFor="data-sheet-field-name"><span className="required-mark">*</span> 字段名称</label><input id="data-sheet-field-name" className="text-field" autoFocus maxLength={30} value={fieldDraft.name} onChange={(event) => setFieldDraft({ ...fieldDraft, name: event.target.value, error: '' })} />
          <label className="field-label" htmlFor="data-sheet-field-type">字段类型</label><select id="data-sheet-field-type" className="text-field" value={fieldDraft.type} onChange={(event) => setFieldDraft({ ...fieldDraft, type: event.target.value as DataTableColumnType, error: '' })}>{Object.entries(columnTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          {fieldDraft.type === 'select' && <><label className="field-label" htmlFor="data-sheet-field-options">选项（用逗号分隔）</label><input id="data-sheet-field-options" className="text-field" value={fieldDraft.options} onChange={(event) => setFieldDraft({ ...fieldDraft, options: event.target.value, error: '' })} placeholder="例如：待开始、进行中、已完成" /></>}
          <label className="data-sheet-required-field"><input type="checkbox" checked={fieldDraft.required} onChange={(event) => setFieldDraft({ ...fieldDraft, required: event.target.checked })} /><span><strong>设为必填字段</strong><small>空值会阻止表格保存</small></span></label>
          {fieldDraft.error && <p className="field-error" role="alert">{fieldDraft.error}</p>}
          {fieldDraft.mode === 'edit' && <button className="data-sheet-delete-field" type="button" disabled={table.columns.length <= 1} onClick={deleteField}>删除此字段</button>}
        </Modal>
      )}

      {filesOpen && (
        <Modal title="数据文件与导入记录" onClose={() => setFilesOpen(false)} hideFooter wide>
          <div className="data-sheet-file-history">{table.attachments.length === 0 ? <div className="data-sheet-file-empty"><img src="/assets/document-sheet.svg" alt="" /><strong>暂无导入文件</strong><span>暂无历史数据文件。</span></div> : table.attachments.map((file) => <article key={file.id}><img src="/assets/document-sheet.svg" alt="" /><div><strong>{file.name}</strong><span>{formatFileSize(file.size)} · {file.rowCount} 条 · {file.uploadedBy} 于 {displayMinute(file.uploadedAt)} 导入</span></div><div>{file.previewText && <button type="button" onClick={() => { setFilesOpen(false); setPreviewAttachmentId(file.id) }}>查看预览</button>}<button type="button" className="is-danger" onClick={() => { if (!window.confirm(`移除“${file.name}”的导入记录？已导入的表格行不会删除。`)) return; markChanged((current) => ({ ...current, attachments: current.attachments.filter((item) => item.id !== file.id) })); onToast('导入记录已移除') }}>移除记录</button></div></article>)}</div>
          <div className="data-sheet-file-actions"><button className="button button--primary" type="button" onClick={() => setFilesOpen(false)}>完成</button></div>
        </Modal>
      )}

      {previewAttachment && (
        <Modal title="数据文件预览" onClose={() => { setPreviewAttachmentId(null); setFilesOpen(true) }} hideFooter wide>
          <div className="data-sheet-preview-meta"><img src="/assets/document-sheet.svg" alt="" /><div><strong>{previewAttachment.name}</strong><span>{formatFileSize(previewAttachment.size)} · {previewAttachment.rowCount} 条 · {previewAttachment.uploadedBy} 导入</span></div></div>
          <pre className="data-sheet-file-preview">{previewAttachment.previewText || '该文件没有可用的文本预览。'}</pre>
          <div className="data-sheet-file-actions"><button className="button button--primary" type="button" onClick={() => { setPreviewAttachmentId(null); setFilesOpen(true) }}>返回文件列表</button></div>
        </Modal>
      )}
    </section>
  )
}

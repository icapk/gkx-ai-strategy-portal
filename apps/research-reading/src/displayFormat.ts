import type { ResearchDocument, ResearchDataTable } from './types'

/** Display only: never truncate persisted timestamps or optimistic revision values. */
export function displayMinute(value?: string): string {
  if (!value) return '—'
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}[ T]\d{1,2}:\d{2}/.test(value) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(value)) {
    const parts = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[ T](\d{1,2}):(\d{2})/)!;
    return `${parts[1]}-${parts[2].padStart(2,'0')}-${parts[3].padStart(2,'0')} ${parts[4].padStart(2,'0')}:${parts[5]}`
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.replace(/(\d{1,2}:\d{2}):\d{2}(?:\.\d+)?/g, '$1')
  const parts = new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Shanghai', year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date)
  const get=(type:string)=>parts.find(p=>p.type===type)?.value??''
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`
}

export function displayBytes(bytes?: number | null): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return '-'
  const mb = bytes / 1024 ** 2
  return `${mb > 0 && mb < 0.01 ? '<0.01' : mb.toFixed(2)} MB`
}

export function parseSizeBytes(value?: string): number | null {
  const match=value?.trim().match(/^([\d.]+)\s*(B|K|KB|M|MB|G|GB)$/i)
  if (!match) return null
  const n=Number(match[1]),unit=match[2].toUpperCase()
  return Number.isFinite(n) ? n * (unit.startsWith('G')?1024**3:unit.startsWith('M')?1024**2:unit.startsWith('K')?1024:1) : null
}

export function documentSizeLabel(item: ResearchDocument, table?: ResearchDataTable): string {
  if (item.pdfArchive) return displayBytes(item.pdfArchive.byteSize)
  // Native content is authoritative; old zero-size placeholders need no destructive migration.
  if (!item.originalFileName && item.kind==='数据表格' && table) return displayBytes(new TextEncoder().encode(JSON.stringify(table)).byteLength)
  if (!item.originalFileName && item.kind==='在线文档') {
    const content=item.richHtml || (item.blocks?.length ? JSON.stringify(item.blocks) : item.content)
    if (content) return displayBytes(new TextEncoder().encode(content).byteLength)
  }
  return displayBytes(parseSizeBytes(item.size))
}

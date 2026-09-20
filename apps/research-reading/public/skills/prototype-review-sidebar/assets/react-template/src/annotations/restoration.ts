import type { Section, WorkbenchTab, TeamPanelTab, ModalKind } from '../types.ts'
import type { PrototypeModule } from '../prototypeFocus/types.ts'

export type AnnotationRestoreState = {
  schema: 1; product: 'research'; section: Section; tab: WorkbenchTab
  teamTab?: TeamPanelTab; team?: string | null; folder?: string | null
  documentId?: number | null; surface: 'workspace' | 'editor' | 'pdf' | 'table' | 'preview' | 'table-hub'
  modal?: ModalKind | 'search' | 'pdf-import' | 'members' | null
  share?: { kind: 'file' | 'folder'; id: number; scope?: 'personal' | 'team'; targetPath: string; expanded: boolean }
} | {
  schema: 1; product: 'reading'; view: 'library' | 'upload' | 'reader'; documentId?: number | null
  libraryTab?: string; folder?: string; left?: 'outline'; right?: 'notes' | 'figures' | 'references' | 'metadata' | 'graph'
  library?: { section: 'all' | 'recent' | 'favorites'; search: string; page: number; pageSize: number }
  uploadFolderOpen?: boolean
}
export interface AnnotationRestorer {
  capture: () => AnnotationRestoreState | undefined
  /** Validate every object and unsaved business draft before changing state. Return an error instead of replacing a draft. */
  restore: (state: AnnotationRestoreState) => string | undefined | Promise<string | undefined>
}
const restorers = new Map<PrototypeModule, AnnotationRestorer>()
export function registerAnnotationRestorer(product: PrototypeModule, restorer: AnnotationRestorer): () => void {
  restorers.set(product, restorer)
  return () => { if (restorers.get(product) === restorer) restorers.delete(product) }
}
export function captureAnnotationRestore(product: PrototypeModule) { return restorers.get(product)?.capture() }
export function equalAnnotationRestore(a: AnnotationRestoreState, b?: AnnotationRestoreState): boolean {
  const normalize = (value: unknown): unknown => value && typeof value === 'object' && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => [key, normalize(v)])) : value
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b))
}
export async function restoreAnnotationState(state: AnnotationRestoreState): Promise<string | undefined> {
  const restorer = restorers.get(state.product)
  if (!restorer) return '当前产品尚未准备好恢复页面，请先切换到对应产品。'
  return restorer.restore(structuredClone(state))
}

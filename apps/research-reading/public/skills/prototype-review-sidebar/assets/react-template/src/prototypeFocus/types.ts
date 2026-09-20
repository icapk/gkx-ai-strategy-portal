import type { Section, WorkbenchTab, TeamPanelTab, ModalKind } from '../types.ts'

export type PrototypeModule = 'research' | 'reading'
export interface PrototypeTarget {
  product: PrototypeModule
  reviewMode?: 'design' | 'prd' | 'annotations'
  section?: Section
  tab?: WorkbenchTab
  teamTab?: TeamPanelTab
  modal?: ModalKind
  documentType?: 'document' | 'sheet'
  readingView?: 'library' | 'upload' | 'antenna-reader'
  readingLeft?: 'outline'
  readingKnowledgeTab?: '知识图谱'|'技术'|'学术理论'|'学者'
  readingRight?: 'notes' | 'figures' | 'references' | 'metadata' | 'graph'
  readingTool?: 'search' | 'select-text' | 'screenshot' | 'zoom' | 'page'
  surface?: 'editor' | 'pdf' | 'table' | 'import' | 'search' | 'members'
}
export interface PrototypeFocusLocation {
  navigationTarget: string
  selectors: string[]
  description: string
  contextOnly?: boolean
  prepare?: string[]
  prerequisite?: string
  preserveSurface?: boolean
  timeoutMs?: number
}
export interface PrototypeFocusRequest {
  manual?: import('./manual.ts').ManualMapping
  id: string
  label: string
  sequence: number
  module: PrototypeModule
  location?: PrototypeFocusLocation
  target?: PrototypeTarget
}

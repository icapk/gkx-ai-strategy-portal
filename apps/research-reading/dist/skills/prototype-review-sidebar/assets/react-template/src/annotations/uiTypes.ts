import type { ManualMapping } from '../prototypeFocus/manual.ts'
import type { PrototypeModule, PrototypeTarget } from '../prototypeFocus/types.ts'
import type { useAnnotations } from './useAnnotations.ts'
import type { AnnotationRestoreState } from './restoration.ts'

export type AnnotationKind = 'compliance' | 'prd'
export type AnnotationRange = ManualMapping & { pageContext?: string; restore?: AnnotationRestoreState }
export interface AnnotationFeature { kind: AnnotationKind; id: string; title: string; displayNumber?: string; range?: AnnotationRange }
export interface AnnotationCreateRequest { key: number; kind: AnnotationKind; id: string }
export interface AnnotationWorkspaceProps {
  product: PrototypeModule
  query?: string
  version: string
  features: AnnotationFeature[]
  store: ReturnType<typeof useAnnotations>
  openId?: string | null
  onOpened?: () => void
  createRequest?: AnnotationCreateRequest | null
  onCreateHandled?: () => void
  onOpenFeature: (kind: AnnotationKind, id: string) => void
  pageContext?: string
  currentTarget?: PrototypeTarget
  onGuardChange?: (guard: ((action: () => void) => void) | null) => void
}

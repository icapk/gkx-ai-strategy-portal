import type {ReadingBook} from './prdBook.ts'
import type {PrdArea} from '../researchReview/prd.ts'
export const readingSeedRevision='portable-sidebar-v1'
export function migrateReadingBook(book:ReadingBook,_catalog:PrdArea[]):ReadingBook{return book}

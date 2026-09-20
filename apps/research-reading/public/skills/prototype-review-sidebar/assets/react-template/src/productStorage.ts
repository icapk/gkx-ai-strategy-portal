export type Product = 'research' | 'reading'
export const productDatabases: Record<Product, string[]> = {
 research: ['intelligent-research-portal:pdf-archive', 'research-original-files'],
 reading: ['gkx-reading-files-v1'],
}
export function ownsStorageKey(product: Product, key: string) {
 return product === 'reading' ? (key === 'gkx-reading-workspace-v1' || key.startsWith('reading-progress:') || key.startsWith('reading-highlights:')) :
 key.startsWith('intelligent-research-portal:') || key === 'research:team-spaces:v1' || key === 'research:quick-access:v1' || key === 'research-folder-recycle-v1'
}
export const snapshotMarker = (product: Product) => 'gkx-demo-baseline:' + product

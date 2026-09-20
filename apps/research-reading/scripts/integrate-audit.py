"""One-time, asserted integration of audit navigation into the existing components."""
from pathlib import Path
root = Path(__file__).resolve().parents[1] / 'src'
def edit(name, replacements):
    path = root / name
    text = path.read_text(encoding='utf-8')
    for old, new in replacements:
        assert old in text, (name, old[:100])
        text = text.replace(old, new, 1)
    path.write_text(text, encoding='utf-8')

imports = "import { useAudit } from './audit/AuditContext'\nimport { targets } from './audit/targets'\n"
edit('App.tsx', [
    ("import './styles.css'", imports + "import './styles.css'"),
    ('  const showToast =', '''  const { request: auditRequest } = useAudit()
  useEffect(() => {
    if (!auditRequest) return
    const target = targets[auditRequest.targetId]
    setActiveProduct(target.product)
    if (target.product !== 'research') return
    if (target.section) {
      setActiveSection(target.section)
      setOpenFolderName(null)
      setPage(1)
      if (target.section === 'team') setTeamTreeExpanded(true)
    }
    if (target.tab) setWorkbenchTab(target.tab)
    if (target.teamTab) setTeamPanelTab(target.teamTab)
    if (target.documentType) setDocumentType(target.documentType)
    setModal(target.modal ?? null)
    setTeamMemberPickerOpen(false)
  }, [auditRequest])

  const showToast ='''),
    ("{activeProduct === 'reading' ? (", "<div className=\"audit-product\" hidden={activeProduct !== 'reading'}>"),
    (') : <>\n        <TopNavigation', '</div><div className="audit-product" hidden={activeProduct !== \'research\'}>\n        <TopNavigation'),
    ('        </>}\n      </div>', '        </div>\n      </div>'),
    ('<section className="view view--recycle">', '<section data-compliance-target="research-recycle" className="view view--recycle">'),
    ('<Modal title="新建文件夹"', '<Modal auditTarget="research-new-folder" title="新建文件夹"'),
    ('<Modal title="新建在线文档"', '<Modal auditTarget={documentType === \'sheet\' ? \'research-new-sheet\' : \'research-new-document\'} title="新建在线文档"'),
    ('title="导入文档"', 'auditTarget="research-import" title="导入文档"'),
    ('title="新建团队空间"', 'auditTarget="research-new-team" title="新建团队空间"'),
    ('title="选择成员"\n          onClose={() => setModal(null)}', 'auditTarget="research-invite" title="选择成员"\n          onClose={() => setModal(null)}'),
])
edit('components/Modal.tsx', [('interface ModalProps {', 'interface ModalProps {\n  auditTarget?: string'), ('  title,\n  children,', '  title,\n  auditTarget,\n  children,'), ('        ref={dialogRef}', '        data-compliance-target={auditTarget}\n        ref={dialogRef}')])
edit('components/WorkspaceView.tsx', [('<section className="view view--workbench">', '<section data-compliance-target="research-workbench" className="view view--workbench">'), ('<div className="view-body workbench-body">', '<div data-compliance-target={`research-${tab}`} className="view-body workbench-body">')])
edit('components/SpaceView.tsx', [('<section className={`view view--space', '<section data-compliance-target={`research-${mode}`} className={`view view--space')])
edit('components/TeamPanel.tsx', [('<aside className="team-panel"', '<aside data-compliance-target={`research-${tab}`} className="team-panel"')])
edit('components/Navigation.tsx', [('className="profile-button"', 'data-compliance-target="research-profile" className="profile-button"')])
edit('components/ReadingWorkspace.tsx', [
    ("import { Modal }", "import { useAudit } from '../audit/AuditContext'\nimport { targets } from '../audit/targets'\nimport { Modal }"),
    ('  const activeDocument =', '''  const { request: auditRequest } = useAudit()
  useEffect(() => {
    if (!auditRequest) return
    const target = targets[auditRequest.targetId]
    if (target.product !== 'reading') return
    if (target.view) setView(target.view)
    setUploadNewFolderOpen(target.action === 'upload-folder')
  }, [auditRequest])

  const activeDocument ='''),
    ("{view === 'reader' ? (", "<div className=\"audit-product\" hidden={view !== 'reader'}>"),
    (") : view === 'library' ? (", "</div><div className=\"audit-product\" hidden={view !== 'library'}>"),
    ("      ) : (\n        <section", "      </div><div className=\"audit-product\" hidden={view !== 'upload'}>\n        <section"),
    ('className="reading-upload-page"', 'data-compliance-target="reading-upload" className="reading-upload-page"'),
    ('      )}\n\n      {uploadNewFolderOpen', '      </div>\n\n      {uploadNewFolderOpen'),
    ('<Modal title="新建文件夹"', '<Modal auditTarget="reading-upload-folder" title="新建文件夹"'),
])
edit('components/ReadingLibrary.tsx', [('<section className="reading-library-frame"', '<section data-compliance-target="reading-library" className="reading-library-frame"')])
edit('components/ReadingReader.tsx', [
    ("import { createPortal }", "import { useAudit } from '../audit/AuditContext'\nimport { targets } from '../audit/targets'\nimport { createPortal }"),
    ("  const pageLabel =", "  const { request: auditRequest } = useAudit()\n\n  const pageLabel ="),
    ('  return (\n    <section ref={readingFrameRef}', '''  useEffect(() => {
    if (!auditRequest) return
    const target = targets[auditRequest.targetId]
    if (target.product !== 'reading' || target.view !== 'reader') return
    // Navigation opens existing surfaces; it never creates documents, notes or AI results.
    setMobileInsightsOpen(Boolean(target.right))
    setMobileLeftOpen(Boolean(target.left))
    setDocumentMenuOpen(target.action === 'document-menu')
    if (target.left) setLeftPanel(target.left)
    if (target.right) selectInsightPanel(target.right)
    if (target.action === 'editor') {
      if (editingNoteId == null) startAddingNote()
    } else if (target.action === 'search') {
      resetToolSurfaces(); setActiveTool('search'); setSearchOpen(true)
    } else if (target.action === 'screenshot') {
      resetToolSurfaces(); setActiveTool('screenshot')
    } else if (['note', 'translation', 'explanation', 'colors'].includes(target.action ?? '')) {
      resetToolSurfaces(); setActiveTool('note')
      setNoteSelection({ kind: 'field', sectionTitle: '摘要', text: articleAbstract, start: 0, end: articleAbstract.length })
      setContextAction('highlight')
      setContextMenuPosition({ left: 8, top: 8 })
      if (target.action === 'translation') showTranslation()
      if (target.action === 'explanation') showExplanation()
      if (target.action === 'colors') setColorMenuOpen(true)
    } else {
      resetToolSurfaces(); setActiveTool(null)
    }
  }, [auditRequest])

  return (
    <section data-compliance-target="reading-reader" ref={readingFrameRef}'''),
    ('<header className="reading-document-header">', '<header data-compliance-target="reading-header" className="reading-document-header">'),
    ('<div className="reading-document-menu"', '<div data-compliance-target="reading-document-menu" className="reading-document-menu"'),
    ('<div className="reading-outline"', '<div data-compliance-target="reading-outline" className="reading-outline"'),
    ('<div className="reading-thumbnails"', '<div data-compliance-target="reading-thumbnails" className="reading-thumbnails"'),
    ('<div className="reading-notes"', '<div data-compliance-target={editingNoteId == null ? \'reading-notes\' : \'reading-editor\'} className="reading-notes"'),
    ('<main className={`reading-canvas', '<main data-compliance-target={activeTool === \'screenshot\' ? \'reading-screenshot\' : activeTool === \'note\' ? \'reading-selection\' : \'reading-paper\'} className={`reading-canvas'),
    ('<div className="reading-color-palette"', '<div data-compliance-target="reading-colors" className="reading-color-palette"'),
    ('<div className={`reading-float-card reading-float-card--translate', '<div data-compliance-target="reading-translation" className={`reading-float-card reading-float-card--translate'),
    ('<div className={`reading-float-card reading-float-card--explain', '<div data-compliance-target="reading-explanation" className={`reading-float-card reading-float-card--explain'),
    ('<aside className="reading-search-drawer"', '<aside data-compliance-target="reading-search" className="reading-search-drawer"'),
    ('<aside className={`reading-right-panel', '<aside data-compliance-target={`reading-${rightPanel}`} className={`reading-right-panel'),
    ('<footer className="reading-footer">', '<footer data-compliance-target="reading-footer" className="reading-footer">'),
])

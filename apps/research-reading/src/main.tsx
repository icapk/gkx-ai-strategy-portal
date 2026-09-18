import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initializeFreshProduct } from './demoBackup'
import { PrototypeFocusProvider } from './prototypeFocus/FocusContext'

initializeFreshProduct(new URLSearchParams(location.search).get('view') === 'reading' ? 'reading' : 'research').catch(error => { console.error('演示初始化失败，未覆盖已有资料',error) }).finally(() => createRoot(document.getElementById('root')!).render(
  <StrictMode><PrototypeFocusProvider><App /></PrototypeFocusProvider></StrictMode>,
))

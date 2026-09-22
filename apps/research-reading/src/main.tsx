import {applyOnlineRelease} from './onlineRelease'
import {recoverResearchPurge} from './researchPurge'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initializeFreshProduct } from './demoBackup'
import { PrototypeFocusProvider } from './prototypeFocus/FocusContext'

recoverResearchPurge().then(async()=>{
  await applyOnlineRelease()
  try{await initializeFreshProduct(new URLSearchParams(location.search).get('view') === 'reading' ? 'reading' : 'research')}catch(error){console.error('演示初始化失败，未覆盖已有资料',error)}
  render()
}).catch(error=>{const root=document.getElementById('root')!;root.textContent='资料恢复未完成，请重新加载后重试。'+String(error);const retry=document.createElement('button');retry.textContent='重新加载';retry.onclick=()=>location.reload();root.append(retry)})
function render(){createRoot(document.getElementById('root')!).render(
  <StrictMode><PrototypeFocusProvider><App /></PrototypeFocusProvider></StrictMode>,
)}

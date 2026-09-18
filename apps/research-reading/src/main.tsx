import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { PrototypeFocusProvider } from './prototypeFocus/FocusContext'

function renderApp() { createRoot(document.getElementById('root')!).render(
  <StrictMode><PrototypeFocusProvider><App /></PrototypeFocusProvider></StrictMode>,
)
}
const root = document.getElementById('root')!
root.textContent = '正在加载演示资料…'
import('./demoData').then(m => m.initializePublicDemo()).then(renderApp).catch(() => {
 root.textContent = '演示资料加载未完成，请检查网络或浏览器存储空间后重试。'
 const retry = document.createElement('button'); retry.textContent = '重新加载'; retry.onclick = () => location.reload(); root.append(retry)
})

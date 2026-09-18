import { useReadingLanguage } from './ReadingLanguageContext'
import { translationDirection } from './DocumentLanguage'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { getDocument, GlobalWorkerOptions, TextLayer, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { antennaDocument, antennaOutline, antennaFigures, antennaReferenceDetails, antennaAbstract, antennaKeywords, antennaPhraseDefinitions, antennaGraph, type PaperAnchor } from '../antennaPaper'
import type { ReadingNote } from '../readingData'
import type { ReadingDraftController } from './ReadingReader'
import './antenna.css'
import { AntennaKnowledge, KnowledgeIcon } from './AntennaKnowledge'
import { usePrototypeFocus } from '../prototypeFocus/FocusContext'

GlobalWorkerOptions.workerSrc=workerUrl
interface Word { text:string; x:number; y:number; width:number; height:number }
interface IndexedPage {page:number;words:Word[]}
interface Props { onBack:()=>void; notes:ReadingNote[]; onNotesChange:(notes:ReadingNote[])=>boolean; onEditingNoteChange:(dirty:boolean,controller?:ReadingDraftController)=>void }
interface SelectionCard { text:string; translation:string; definitions:typeof antennaPhraseDefinitions; anchor:PaperAnchor; rects:ReadingNote['sourceRects'] }
interface NoteParts { original:string; translation:string; note:string }
type ScreenshotRect = PaperAnchor & { width:number; height:number }
const rectStyle=(r:{x:number;y:number;width?:number;height?:number}):CSSProperties=>({left:`${r.x*100}%`,top:`${r.y*100}%`,width:`${(r.width??.04)*100}%`,height:`${(r.height??.018)*100}%`})
function Tool({icon,label,onClick,pressed,disabled}:{icon:string;label:string;onClick:()=>void;pressed?:boolean;disabled?:boolean}){
  return <button className="antenna-tool" type="button" title={label} aria-label={label} aria-pressed={pressed} disabled={disabled} onClick={onClick}><img src={`/assets/reading/${icon}.svg`} alt=""/></button>
}
function FullscreenTool({active,onClick}:{active:boolean;onClick:()=>void}) {
  const label=active?'退出全屏':'全屏'
  return <button className="antenna-tool" type="button" title={label} aria-label={label} aria-pressed={active} onClick={onClick}><svg viewBox="0 0 24 24" aria-hidden="true">{active?<><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/><path d="M9 9 4 4"/><path d="m15 9 5-5"/><path d="m9 15-5 5"/><path d="m15 15 5 5"/></>:<><path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M16 21h5v-5"/><path d="M3 3l6 6"/><path d="m21 3-6 6"/><path d="m3 21 6-6"/><path d="m21 21-6-6"/></>}</svg></button>
}
function MarkerTool({hidden,onClick}:{hidden:boolean;onClick:()=>void}) {
  const label=hidden?'显示标记':'隐藏标记'
  return <button className="antenna-tool" type="button" title={label} aria-label={label} aria-pressed={hidden} onClick={onClick}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.2-5.5 9-5.5S21 12 21 12s-3.2 5.5-9 5.5S3 12 3 12Z"/><circle cx="12" cy="12" r="2.4"/>{hidden&&<path d="M4 4l16 16"/>}</svg></button>
}
function ReturnTool({disabled,onClick}:{disabled:boolean;onClick:()=>void}) {
  return <button className="antenna-tool" type="button" title="返回上一位置" aria-label="返回上一位置" disabled={disabled} onClick={onClick}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7H4v5"/><path d="M4 12c2.1-3.8 5.1-5.7 9-5.7 4.4 0 8 3.6 8 8s-3.6 8-8 8c-2.5 0-4.8-1.2-6.2-3"/></svg></button>
}
function HighlightTool({onClick}:{onClick:()=>void}) {
  return <button className="antenna-tool" type="button" title="摘录选中文字" aria-label="摘录选中文字" onClick={onClick}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5 4 4-8.5 8.5-4.5 1 1-4.5Z"/><path d="m13 7 4 4"/><path d="M4 21h16"/><path d="M5 16h4"/></svg></button>
}
function RailIcon({name}:{name:string}) {
  if(name==='目录')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>
  if(name==='笔记')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h9l3 3v13H6z"/><path d="M14 4v4h4"/><path d="M9 12h6"/><path d="M9 16h5"/></svg>
  if(name==='图表')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/></svg>
  if(name==='引用')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/><path d="M5 4h14v16H5z"/></svg>
  if(name==='元数据')return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 10v6"/><path d="M12 7h.01"/></svg>
  return <KnowledgeIcon/>
}
function formatNoteParts(parts:NoteParts) {
  return [`原文：\n${parts.original.trim()}`,parts.translation.trim()?`译文：\n${parts.translation.trim()}`:'',`笔记：\n${parts.note.trim()}`].filter(Boolean).join('\n\n')
}
function splitNoteParts(excerpt:string):NoteParts {
  const source=excerpt.trim()
  const original=source.match(/原文：\n([\s\S]*?)(?:\n\n译文：|\n\n笔记：|$)/)?.[1]?.trim()
  const translation=source.match(/译文：\n([\s\S]*?)(?:\n\n笔记：|$)/)?.[1]?.trim()
  const note=source.match(/笔记：\n([\s\S]*)$/)?.[1]?.trim()
  const legacyPrefix=/^该(?:选段|句段)说明[:：]?/
  if(original!==undefined||translation!==undefined||note!==undefined){
    const originalChunks=(original??'').split(/\n\n+/)
    const legacyTranslation=originalChunks.find(item=>legacyPrefix.test(item.trim()))
    return {
      original:legacyTranslation?originalChunks.filter(item=>!legacyPrefix.test(item.trim())).join('\n\n').trim():original??'',
      translation:(translation??legacyTranslation??'').replace(legacyPrefix,'').trim(),
      note:note??''
    }
  }
  const legacy=source.split(/\n\n+/)
  if(legacy.length>1&&(legacyPrefix.test(legacy[1])||/^译文：/.test(legacy[1])))return {original:legacy[0],translation:legacy.slice(1).join('\n\n').replace(/^译文：/,'').replace(legacyPrefix,'').trim(),note:''}
  return {original:source,translation:'',note:''}
}
const semanticPresets=[
  {label:'shared aperture',snippet:'共口径结构把套筒单极子和Vivaldi阵列放在同一口径内，核心问题是覆盖宽频段同时控制互耦。',anchor:{page:1,x:.51,y:.72}},
  {label:'VSWR',snippet:'VSWR < 2.8 是全文最关键的匹配指标，可直接定位到Fig.4和仿真结果段落。',anchor:{page:2,x:.51,y:.47}},
  {label:'spectrum measurement',snippet:'论文面向电磁频谱地图测量，强调0.5-8 GHz连续覆盖和全向观测。',anchor:{page:1,x:.074,y:.24}},
  {label:'Vivaldi array',snippet:'环形Vivaldi阵列承担3.8-8 GHz水平极化高频段覆盖，并支持阵列方向图验证。',anchor:{page:2,x:.51,y:.065}},
]
function buildTranslation(text:string) {
  const normalized=text.replace(/\s+/g,' ').trim()
  const lower=normalized.toLowerCase()
  const exact=antennaPhraseDefinitions.find(item=>lower===item.phrase.toLowerCase())
  if(exact)return exact.translation
  if(lower===antennaAbstract.replace(/\s+/g,' ').toLowerCase())return '提出了一种结合套筒单极子与Vivaldi阵列的共口径天线，用于电磁频谱地图测量。0.5–8 GHz工作频段分为使用垂直极化套筒单极子的低频段（0.5–3.8 GHz）和使用水平极化Vivaldi阵列的高频段（3.8–8 GHz）。仿真结果显示，全频段驻波比小于2.8，低频段增益变化小于1.5 dB，高频段波束形成稳定，适合频谱监测场景。'
  return ''
}
function extractSelection(root:HTMLElement|null):SelectionCard|null {
  const s=window.getSelection();if(!s||s.isCollapsed||!s.rangeCount)return null
  const range=s.getRangeAt(0)
  const start=(range.startContainer instanceof Element?range.startContainer:range.startContainer.parentElement)?.closest<HTMLElement>('[data-paper-page]')
  const end=(range.endContainer instanceof Element?range.endContainer:range.endContainer.parentElement)?.closest<HTMLElement>('[data-paper-page]')
  if(!start||start!==end||!root?.contains(start))return null
  const text=s.toString().replace(/\s+/g,' ').trim();if(!text)return null
  const b=start.getBoundingClientRect()
  const rects=Array.from(range.getClientRects()).filter(r=>r.width>1&&r.height>1).map(r=>({x:Math.max(0,(r.left-b.left)/b.width),y:Math.max(0,(r.top-b.top)/b.height),width:Math.min(1,r.width/b.width),height:Math.min(1,r.height/b.height)}))
  if(!rects.length)return null
  const lower=text.toLowerCase()
  return {text,translation:buildTranslation(text),definitions:antennaPhraseDefinitions.filter(item=>lower.includes(item.phrase.toLowerCase())),anchor:{page:Number(start.dataset.paperPage),x:rects[0].x,y:rects[0].y},rects}
}
function PdfPage({pdf,page,width,children}:{pdf:PDFDocumentProxy;page:number;width:number;children:React.ReactNode}) {
  const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),text=useRef<HTMLDivElement>(null)
  const [error,setError]=useState('')
  useEffect(()=>{
    let disposed=false,render:RenderTask|undefined,layer:TextLayer|undefined
    void (async()=>{try {
      const source=await pdf.getPage(page);if(disposed)return
      const view=source.getViewport({scale:width/source.getViewport({scale:1}).width})
      const el=host.current!,c=canvas.current!,t=text.current!
      el.style.height=`${view.height}px`;el.style.setProperty('--scale-factor',String(view.scale));el.style.setProperty('--user-unit',String(view.userUnit));el.style.setProperty('--total-scale-factor','calc(var(--scale-factor) * var(--user-unit))');el.style.setProperty('--scale-round-x','1px');el.style.setProperty('--scale-round-y','1px')
      const ratio=Math.min(devicePixelRatio||1,2);c.width=Math.ceil(width*ratio);c.height=Math.ceil(view.height*ratio)
      render=source.render({canvas:c,viewport:view,transform:[ratio,0,0,ratio,0,0]});await render.promise;if(disposed)return
      t.replaceChildren();layer=new TextLayer({textContentSource:source.streamTextContent({includeMarkedContent:true}),container:t,viewport:view});await layer.render()
    }catch(e){if(!disposed)setError(e instanceof Error?e.message:'页面渲染失败')}})()
    return()=>{disposed=true;render?.cancel();layer?.cancel()}
  },[pdf,page,width])
  return <div ref={host} data-paper-page={page} className="antenna-page" style={{width,height:width*792/612}} aria-label={`PDF第${page}页`}><canvas ref={canvas}/><div ref={text} className="antenna-text-layer"/>{children}{error&&<p role="alert">页面渲染失败：{error}</p>}</div>
}
export function AntennaReader({onBack,notes,onNotesChange,onEditingNoteChange}:Props) {
  const {language,requireLanguage}=useReadingLanguage()
  const { request: focusRequest, ready: focusReady, reject: focusReject } = usePrototypeFocus()
  const handledFocus=useRef(0)
  const [pdf,setPdf]=useState<PDFDocumentProxy|null>(null),[index,setIndex]=useState<IndexedPage[]>([]),[error,setError]=useState('')
  const [page,setPage]=useState(1),[zoom,setZoom]=useState(100),[hostWidth,setHostWidth]=useState(700)
  const [pageInput,setPageInput]=useState('1')
  const [left,setLeft]=useState(()=>window.innerWidth>1100),[right,setRight]=useState(()=>window.innerWidth>1100),[panel,setPanel]=useState('笔记')
  const [search,setSearch]=useState(false),[query,setQuery]=useState(''),[semantic,setSemantic]=useState(false),[hidden,setHidden]=useState(false),[crop,setCrop]=useState(false)
  const [fullscreen,setFullscreen]=useState(false)
  const [focus,setFocus]=useState<PaperAnchor|null>(null),[reference,setReference]=useState<number|null>(null),[figure,setFigure]=useState<number|null>(null)
  const [referenceGroup,setReferenceGroup]=useState<number[]>([])
  const [history,setHistory]=useState<PaperAnchor[]>([]),[message,setMessage]=useState('')
  const [draft,setDraft]=useState<ReadingNote|null>(null),[draftOriginal,setDraftOriginal]=useState('')
  const [selectionCard,setSelectionCard]=useState<SelectionCard|null>(null),[includeTranslation,setIncludeTranslation]=useState(true),[graphNode,setGraphNode]=useState('paper')
  const root=useRef<HTMLDivElement>(null),scroll=useRef<HTMLDivElement>(null),draftRef=useRef(draft)
  const cropStart=useRef<{page:number;x:number;y:number}|null>(null)
  const [cropRect,setCropRect]=useState<PaperAnchor|null>(null)
  const [pendingShot,setPendingShot]=useState<ScreenshotRect|null>(null)
  const width=Math.max(220,Math.min(900,hostWidth-32))*zoom/100
  draftRef.current=draft
  const dirty=!!draft && (JSON.stringify(draft)!==draftOriginal)
  useEffect(()=>{
    let disposed=false
    const task=getDocument({url:'/antenna/paper.pdf',cMapUrl:'/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'/pdfjs/standard_fonts/',wasmUrl:'/pdfjs/wasm/'})
    task.promise.then(p=>{if(!disposed)setPdf(p)}).catch(()=>{if(!disposed)setError('PDF加载失败，请刷新页面重试。')})
    fetch('/antenna/index.json').then(r=>{if(!r.ok)throw new Error();return r.json()}).then(data=>{if(!disposed)setIndex(data)}).catch(()=>{if(!disposed)setError('文献索引加载失败，请刷新后重试。')})
    return()=>{disposed=true;void task.destroy()}
  },[])
  useEffect(()=>{const el=scroll.current;if(!el)return;const resize=new ResizeObserver(()=>setHostWidth(el.clientWidth));resize.observe(el);return()=>resize.disconnect()},[])
  useEffect(()=>{const sync=()=>setFullscreen(!!document.fullscreenElement);sync();document.addEventListener('fullscreenchange',sync);return()=>document.removeEventListener('fullscreenchange',sync)},[])
  useEffect(()=>setPageInput(String(page)),[page])
  const saveDraft=()=>{
    const d=draftRef.current;if(!d)return true
    if(!d.excerpt.trim()){setMessage('请输入笔记内容。');return false}
    if(!onNotesChange(notes.some(n=>n.id===d.id)?notes.map(n=>n.id===d.id?d:n):[...notes,d])){setMessage('笔记保存失败，编辑内容已保留。');return false}
    setDraft(null);setDraftOriginal('');setMessage('笔记已保存。');return true
  }
  useEffect(()=>{onEditingNoteChange(dirty,{save:saveDraft,discard:()=>{setDraft(null);setDraftOriginal('')}})},[draft,dirty,notes])
  useEffect(()=>{if(!dirty)return;const stop=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue=''};window.addEventListener('beforeunload',stop);return()=>window.removeEventListener('beforeunload',stop)},[dirty])
  const currentAnchor=():PaperAnchor=>{
    const box=scroll.current!,bounds=box.getBoundingClientRect()
    const elements=Array.from(box.querySelectorAll<HTMLElement>('[data-paper-page]'))
    const element=elements.find(el=>el.getBoundingClientRect().bottom>bounds.top+20)??elements[0]
    if(!element)return {page:1,x:0,y:0}
    const b=element.getBoundingClientRect()
    return {page:Number(element.dataset.paperPage),x:Math.max(0,(bounds.left-b.left)/b.width),y:Math.max(0,(bounds.top-b.top)/b.height)}
  }
  const locate=(anchor:PaperAnchor,remember=true)=>{
    const el=scroll.current?.querySelector<HTMLElement>(`[data-paper-page="${anchor.page}"]`)
    if(!el||!scroll.current)return
    if(remember)setHistory(h=>[...h.slice(-49),currentAnchor()])
    const parent=scroll.current.getBoundingClientRect(),bounds=el.getBoundingClientRect()
    scroll.current.scrollTo({top:scroll.current.scrollTop+bounds.top-parent.top+anchor.y*bounds.height-24,left:Math.max(0,scroll.current.scrollLeft+bounds.left-parent.left+anchor.x*bounds.width-30),behavior:'auto'})
    setPage(anchor.page);setFocus(anchor)
  }
  const openDraft=(note:ReadingNote)=>{
    if(dirty){setMessage('请先保存或取消当前笔记。');return}
    setDraft(note);setDraftOriginal(notes.some(n=>n.id===note.id)?JSON.stringify(note):'');setRight(true);setPanel('笔记')
  }
  const nextNoteTitle=()=>{
    const used=new Set(notes.map(n=>n.title))
    let i=1
    while(used.has(`笔记${i}`))i+=1
    return `笔记${i}`
  }
  const makeNote=(excerpt:string,anchor?:PaperAnchor,rects?:ReadingNote['sourceRects'],image?:string,tags:string[]=[],title?:string)=>
    openDraft({id:Date.now(),title:title??nextNoteTitle(),excerpt,createdAt:new Date().toISOString(),color:'#FFE4BA',sourceAnchor:anchor,sourceRects:rects,imageDataUrls:image?[image]:undefined,tags})
  const updateDraftPart=(key:keyof NoteParts,value:string)=>{
    if(!draft)return
    const parts=splitNoteParts(draft.excerpt)
    setDraft({...draft,excerpt:formatNoteParts({...parts,[key]:value})})
  }
  const screenshotDataUrl=(rect:ScreenshotRect)=>{
    const pageEl=scroll.current?.querySelector<HTMLElement>(`[data-paper-page="${rect.page}"]`)
    const canvas=pageEl?.querySelector<HTMLCanvasElement>('canvas')
    if(!pageEl||!canvas||!scroll.current)return ''
    const image=document.createElement('canvas');image.width=Math.min(1200,Math.round(canvas.width*rect.width));image.height=Math.max(80,Math.round(image.width*(canvas.height*rect.height)/(canvas.width*rect.width)))
    image.getContext('2d')?.drawImage(canvas,rect.x*canvas.width,rect.y*canvas.height,rect.width*canvas.width,rect.height*canvas.height,0,0,image.width,image.height)
    return image.toDataURL('image/png')
  }
  const createScreenshotNote=(rect:ScreenshotRect)=>{
    if(dirty){setMessage('请先保存或取消当前笔记。');return}
    const image=screenshotDataUrl(rect)
    if(!image){setMessage('截图生成失败，请重新选择。');return}
    makeNote(formatNoteParts({original:`第${rect.page}页截图选区`,translation:'',note:''}),rect,[rect],image,['截图'])
    setCropRect(null);setPendingShot(null)
  }
  const downloadScreenshot=(rect:ScreenshotRect)=>{
    const image=screenshotDataUrl(rect)
    if(!image){setMessage('截图下载失败，请重新选择。');return}
    const a=document.createElement('a');a.href=image;a.download=`第${rect.page}页截图.png`;a.click();setMessage('截图已下载。')
  }
  const captureScreenshotNote=()=>{
    if(dirty){setMessage('请先保存或取消当前笔记。');return}
    setSelectionCard(null);setPendingShot(null);setCrop(true);setCropRect(null);setMessage('请在正文页面拖拽选择截图区域。')
  }
  const findFigureNote=(f:typeof antennaFigures[number])=>notes.find(n=>n.tags?.includes(`figure-${f.number}`) || n.imageDataUrls?.includes(f.image) || (n.sourceAnchor?.page===f.page && splitNoteParts(n.excerpt).original.startsWith(`图${f.number} · ${f.title}`)))
  const addFigureNote=(f:typeof antennaFigures[number])=>{
    const existing=findFigureNote(f)
    if(existing){openDraft(existing);return}
    makeNote(formatNoteParts({original:`图${f.number} · ${f.title}\n原文第${f.page}页`,translation:'',note:''}),f,[{x:f.x,y:f.y,width:.4,height:.25}],f.image,[`figure-${f.number}`])
  }
  const goPage=()=>{
    const next=Number(pageInput)
    if(Number.isInteger(next)&&next>=1&&next<=3)locate({page:next,x:0,y:0})
    else {setPageInput(String(page));setMessage('请输入 1 到 3 之间的页码。')}
  }
  const selection=()=>{
    const s=window.getSelection();if(!s||s.isCollapsed||!s.rangeCount)return
    const range=s.getRangeAt(0)
    const start=(range.startContainer instanceof Element?range.startContainer:range.startContainer.parentElement)?.closest<HTMLElement>('[data-paper-page]')
    const end=(range.endContainer instanceof Element?range.endContainer:range.endContainer.parentElement)?.closest<HTMLElement>('[data-paper-page]')
    if(!start||!root.current?.contains(start))return
    if(start!==end){setMessage('请分别摘录每一页的文字。');return}
    const b=start.getBoundingClientRect()
    const rects=Array.from(range.getClientRects()).filter(r=>r.width>1&&r.height>1).map(r=>({x:Math.max(0,(r.left-b.left)/b.width),y:Math.max(0,(r.top-b.top)/b.height),width:Math.min(1,r.width/b.width),height:Math.min(1,r.height/b.height)}))
    if(!rects.length)return
    makeNote(s.toString().trim(),{page:Number(start.dataset.paperPage),x:rects[0].x,y:rects[0].y},rects)
    s.removeAllRanges()
  }
  const showSelectionCard=()=>{
    if(crop)return
    const card=extractSelection(root.current)
    if(card){if(!requireLanguage())return;setSelectionCard({...card,translation:language==='en'?card.translation:'[中译英模拟] Translation preview — 未接入翻译服务。'});setRight(true)}
  }
  const results: {page:number;word:Word;text:string}[]=[]
  const term=query.trim().toLowerCase()
  if(term) for(const p of index){
    const joined=p.words.map(w=>w.text.toLowerCase()).join(' ')
    let offset=0,at=joined.indexOf(term)
    for(const word of p.words){while(at>=offset&&at<offset+word.text.length){results.push({page:p.page,word,text:joined.slice(Math.max(0,at-25),at+term.length+65)});at=joined.indexOf(term,at+Math.max(term.length,1))}offset+=word.text.length+1}
  }
  const semanticResults=semantic&&term?semanticPresets.filter(item=>(item.label+' '+item.snippet).toLowerCase().includes(term) || term.split(/\s+/).every(part=>(item.label+' '+item.snippet).toLowerCase().includes(part))):[]
  const markerWords=(p:IndexedPage)=>p.words.flatMap((w,i)=>{
    const figureMatch=/^Fig\.?$/i.test(w.text)&&/^\d/.test(p.words[i+1]?.text??'')?Number(p.words[i+1].text.match(/^\d+/)?.[0]):0
    const refMatch=w.text.match(/^\[(\d)(?:[–-](\d))?\]/)
    if(figureMatch>=1&&figureMatch<=8)return [{...w,kind:'figure',id:figureMatch,end:figureMatch}]
    if(refMatch&&!(p.page===3&&w.x>.5&&w.y>.42))return [{...w,kind:'reference',id:Number(refMatch[1]),end:Number(refMatch[2]??refMatch[1])}]
    return []
  })
  const markerKind=focusRequest?.id.split('::').at(-1)==='F6.2'?'figure':'reference'
  const focusMarker=index.flatMap(p=>markerWords(p).map(word=>({page:p.page,word}))).find(m=>m.word.kind===markerKind)
  useEffect(()=>{
    if(!focusRequest || focusRequest.module!=='reading' || handledFocus.current===focusRequest.sequence)return
    const seq=focusRequest.sequence,id=focusRequest.id.split('::').at(-1)!,target=focusRequest.target
    if(target?.readingView!=='antenna-reader')return
    const needsPage=['F3.2','F5.1','F5.2','F5.3','F6.1','F6.2','F17','F18.1','F18.3'].includes(id)
    const needsIndex=['F6.1','F6.2','F17'].includes(id)
    if(needsPage&&error){handledFocus.current=seq;focusReject(seq,error);return}
    if((needsPage&&!pdf)||(needsIndex&&!index.length))return
    if(dirty && target?.readingRight && target.readingRight!=='notes'){
      handledFocus.current=seq;focusReject(seq,'请先保存或取消当前笔记，再切换操作面板。');return
    }
    const panels={notes:'笔记',figures:'图表',references:'引用',metadata:'元数据',graph:'图谱'} as const
    if(target?.readingLeft)setLeft(true)
    if(target?.readingRight){setRight(true);setPanel(panels[target.readingRight])}
    if(target?.readingTool==='search'){setSearch(true);setSemantic(id==='F20.2')}
    else setSearch(false)
    if(target?.readingRight==='references'){setReference(null);setReferenceGroup([])}
    const sourceNote=notes.find(n=>id==='F3.2'?n.sourceAnchor&&n.sourceRects?.length:n.sourceAnchor)
    if(id==='F3.2'||id==='F5.2'){
      if(!sourceNote?.sourceAnchor){handledFocus.current=seq;focusReject(seq,'还没有带原文位置的笔记。请先选择原文并保存摘录，再验证定位或高亮。');return}
      setHidden(false);locate(sourceNote.sourceAnchor)
    }
    if(id==='F5.1')locate(antennaOutline[0])
    if(['F5.3','F18.1'].includes(id))locate({...antennaFigures[0],width:.4,height:.25})
    if(['F14','F17','F18.3'].includes(id)){
      setReference(id==='F17'?focusMarker?.word.id??1:1)
      if(id==='F18.3')locate(antennaReferenceDetails[0])
    }
    if(['F6.1','F6.2','F17'].includes(id)){
      if(!focusMarker){handledFocus.current=seq;focusReject(seq,'原文索引中未找到对应标记。');return}
      setHidden(false);locate({page:focusMarker.page,...focusMarker.word})
    }
    const frame=requestAnimationFrame(()=>{handledFocus.current=seq;focusReady(seq)})
    return()=>cancelAnimationFrame(frame)
  },[focusRequest?.sequence,pdf,index,error,focusReady,focusReject])
  const selectedReference=antennaReferenceDetails.find(r=>r.number===reference)
  const selectedFigure=antennaFigures.find(f=>f.number===figure)
  const selectedGraphNode=antennaGraph.nodes.find(n=>n.id===graphNode)??antennaGraph.nodes[0]
  return <div className="antenna-reader" ref={root}>
    <header className="antenna-header"><Tool icon="back" label="返回文件列表" onClick={onBack}/><img src="/assets/reading/pdf.svg" alt="PDF"/><div><strong title={antennaDocument.title}>{antennaDocument.title}</strong><small>原始论文 · 3页 · 8幅图 · 9条引用</small></div><a className="antenna-tool" title="下载原始PDF" aria-label="下载原始PDF" href="/antenna/paper.pdf" download="文件1-论文PDF.pdf"><img src="/assets/reading/download.svg" alt=""/></a></header>
    <div className={`antenna-body ${left?'has-left':''} ${right?'has-right':''}`}>
      <div className="antenna-left-rail"><button className="antenna-rail-button" type="button" title={left?'收起目录':'展开目录'} aria-label={left?'收起目录':'展开目录'} aria-pressed={left} onClick={()=>setLeft(v=>!v)}><RailIcon name="目录"/></button></div>
      {left&&<nav className="antenna-outline" aria-label="文献目录"><header><strong>文献目录</strong><button aria-label="关闭目录" onClick={()=>setLeft(false)}>×</button></header>{antennaOutline.map(item=><button data-focus-id={item===antennaOutline[0]?'reading-outline-first':undefined} className={item.child?'is-child':''} key={item.title} onClick={()=>locate(item)}><span>{item.title}</span><small>{item.page}</small></button>)}</nav>}
      <div className={`antenna-scroll ${crop?'is-cropping':''}`} ref={scroll} onScroll={()=>{if(pdf)setPage(currentAnchor().page)}} onMouseUp={showSelectionCard}
        onPointerDown={e=>{if(!crop)return;const el=(e.target as Element).closest<HTMLElement>('[data-paper-page]');if(!el)return;e.preventDefault();el.setPointerCapture(e.pointerId);const b=el.getBoundingClientRect();cropStart.current={page:Number(el.dataset.paperPage),x:(e.clientX-b.left)/b.width,y:(e.clientY-b.top)/b.height}}}
        onPointerMove={e=>{const a=cropStart.current;if(!crop||!a)return;const el=scroll.current?.querySelector<HTMLElement>(`[data-paper-page="${a.page}"]`);if(!el)return;const b=el.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),y=Math.max(0,Math.min(1,(e.clientY-b.top)/b.height));setCropRect({page:a.page,x:Math.min(a.x,x),y:Math.min(a.y,y),width:Math.abs(x-a.x),height:Math.abs(y-a.y)})}}
        onPointerUp={e=>{const a=cropStart.current;cropStart.current=null;if(!crop||!a){return}const el=scroll.current?.querySelector<HTMLElement>(`[data-paper-page="${a.page}"]`);if(!el){setCrop(false);setCropRect(null);return}const b=el.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),y=Math.max(0,Math.min(1,(e.clientY-b.top)/b.height));const rect={page:a.page,x:Math.min(a.x,x),y:Math.min(a.y,y),width:Math.abs(x-a.x),height:Math.abs(y-a.y)};setCrop(false);if(rect.width<.02||rect.height<.02){setCropRect(null);setMessage('截图区域太小，请重新选择。');return}setCropRect(rect);setPendingShot(rect);setMessage('请确认截图选区，确认后会生成笔记。')}}
        onPointerCancel={()=>{cropStart.current=null;setCrop(false);setCropRect(null)}}>
        {error?<p role="alert">{error}</p>:!pdf?<p role="status">正在加载原始PDF…</p>:Array.from({length:pdf.numPages},(_,i)=><PdfPage pdf={pdf} page={i+1} width={width} key={i}>{!hidden&&<div className="antenna-overlays">
          {notes.filter(n=>n.sourceAnchor?.page===i+1).flatMap(n=>(n.sourceRects??[]).map((r,j)=><span className="antenna-highlight" data-focus-id={n===notes.find(note=>note.sourceRects?.length)&&j===0?'reading-source-highlight':undefined} key={`${n.id}-${j}`} style={{...rectStyle(r),background:n.color}}/>))}
          {index.filter(p=>p.page===i+1).flatMap(p=>markerWords(p).map((m,j)=><button key={`m-${j}`} className="antenna-marker" data-focus-id={m.kind===focusMarker?.word.kind&&m.x===focusMarker.word.x&&m.y===focusMarker.word.y&&i+1===focusMarker.page?`reading-${m.kind}-marker`:undefined} style={rectStyle(m)} aria-label={m.kind==='figure'?`查看图${m.id}`:`查看参考文献${m.id}`} title={m.kind==='figure'?`图${m.id}`:`引用[${m.id}${m.end>m.id?`–${m.end}`:''}]`} onClick={()=>{setRight(true);setPanel(m.kind==='figure'?'图表':'引用');setReference(m.kind==='reference'?m.id:null);setReferenceGroup(m.kind==='reference'?Array.from({length:Math.max(1,m.end-m.id+1)},(_,n)=>m.id+n):[]);setFigure(m.kind==='figure'?m.id:null)}}/>))}
        </div>}{results.filter(r=>r.page===i+1).map((r,j)=><span key={`s-${j}`} className="antenna-search-mark" style={rectStyle(r.word)}/>)}{focus?.page===i+1&&<span className="antenna-focus" style={rectStyle({...focus,width:focus.width??.4,height:focus.height??.022})}/>} {cropRect?.page===i+1&&<span className="antenna-crop" style={rectStyle(cropRect)}/>} {pendingShot?.page===i+1&&<div className="antenna-crop-actions" style={{left:`${Math.min(.92,pendingShot.x+pendingShot.width)*100}%`,top:`${Math.min(.92,pendingShot.y+pendingShot.height)*100}%`}}><button type="button" aria-label="下载截图" title="下载截图" onClick={()=>downloadScreenshot(pendingShot)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg></button><button type="button" aria-label="取消截图" title="取消截图" onClick={()=>{setCropRect(null);setPendingShot(null);setMessage('截图已取消。')}}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg></button><button type="button" aria-label="确认截图" title="确认截图" className="is-primary" onClick={()=>createScreenshotNote(pendingShot)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></button></div>}</PdfPage>)}
      </div>
      {right&&<aside className="antenna-insights" aria-label="阅读工作区"><header><strong>{panel}</strong><button aria-label="关闭工作区" onClick={()=>setRight(false)}>×</button></header><div className="antenna-insights-content">
        {panel==='笔记'&&<><button className="antenna-new-note" onClick={()=>makeNote(formatNoteParts({original:'',translation:'',note:''}))}>新建笔记</button>{draft&&(()=>{const parts=splitNoteParts(draft.excerpt);return <div className="antenna-note-draft"><label>标题<input value={draft.title} maxLength={120} onChange={e=>setDraft({...draft,title:e.target.value})}/></label><label>原文<textarea rows={4} value={parts.original} maxLength={10000} onChange={e=>updateDraftPart('original',e.target.value)}/></label>{parts.translation&&<label>译文<textarea rows={4} value={parts.translation} maxLength={10000} onChange={e=>updateDraftPart('translation',e.target.value)}/></label>}<label>笔记<textarea rows={5} value={parts.note} maxLength={10000} onChange={e=>updateDraftPart('note',e.target.value)} placeholder="写下自己的理解、疑问或待验证点"/></label>{draft.imageDataUrls?.map((src,i)=><img key={i} src={src} alt="截图笔记"/>)}<div className="antenna-note-actions"><button onClick={()=>{setDraft(null);setDraftOriginal('')}}>取消</button><button onClick={saveDraft}>保存笔记</button></div></div>})()}{notes.map(n=>{const parts=splitNoteParts(n.excerpt);return <article className="antenna-note" key={n.id}><strong>{n.title}</strong>{n.imageDataUrls?.map((src,i)=><img src={src} key={i} alt="笔记截图"/>)}{parts.original&&<section><b>原文</b><p>{parts.original}</p></section>}{parts.translation&&<section><b>译文</b><p>{parts.translation}</p></section>}{parts.note&&<section><b>笔记</b><p>{parts.note}</p></section>}<footer>{n.sourceAnchor&&<button data-focus-id={n===notes.find(note=>note.sourceAnchor)?'reading-note-source':undefined} onClick={()=>locate(n.sourceAnchor!)}>原文 · 第{n.sourceAnchor.page}页</button>}<button onClick={()=>openDraft(n)}>编辑</button></footer></article>})}</>}
        {panel==='图表'&&<>{antennaFigures.map(f=>{const existing=findFigureNote(f);return <article className="antenna-figure" key={f.number}><img src={f.image} alt={f.title}/><strong>图{f.number} · {f.title}</strong><small>原文第{f.page}页</small><footer><button data-focus-id={f.number===1?'reading-figure-source':undefined} onClick={()=>locate(f)}>定位原图</button><button onClick={()=>addFigureNote(f)}>{existing?'查看已有笔记':'添加至笔记'}</button></footer></article>})}<p data-focus-id="reading-table-empty" className="antenna-muted">表格 0 · 原文没有独立表格</p></>}
        {panel==='引用'&&<>{selectedReference?<article data-focus-id="reading-reference-detail" className="antenna-reference"><button onClick={()=>setReference(null)}>‹ 全部引用</button>{referenceGroup.length>1&&<div className="antenna-reference-group">{referenceGroup.map(n=><button key={n} aria-pressed={reference===n} onClick={()=>setReference(n)}>[{n}]</button>)}</div>}<h3>[{selectedReference.number}] {selectedReference.title}</h3><p>{selectedReference.authors}</p><p>{selectedReference.journal} · {selectedReference.publicationDate}</p><p>摘要：{selectedReference.abstract}</p><p>DOI：{selectedReference.doi}</p><small>{selectedReference.source}</small><button data-focus-id="reading-reference-source" onClick={()=>locate(selectedReference)}>定位参考文献条目</button></article>:antennaReferenceDetails.map(r=><button className="antenna-reference" key={r.number} onClick={()=>{setReference(r.number);setReferenceGroup([])}}><strong>[{r.number}] {r.title}</strong><p>{r.authors}</p><small>{r.journal} · {r.publicationDate}</small></button>)}<p className="antenna-muted">原文参考文献条目 · 详情字段为原型补全并保留来源标识</p></>}
        {panel==='元数据'&&<dl className="antenna-metadata"><dt>标题</dt><dd>{antennaDocument.title}</dd><dt>作者</dt><dd>{antennaDocument.authors}</dd><dt>机构</dt><dd>Electronic Science and Engineering, University of Electronic Science and Technology of China, Chengdu, China, 611731<br/>Institute for Wireless Intelligence, Chengdu, China</dd><dt>作者邮箱</dt><dd>Yihong Su: yhsu@uestc.edu.cn<br/>其他作者邮箱未提供</dd><dt>摘要</dt><dd>{antennaAbstract}</dd><dt>关键词</dt><dd>{antennaKeywords.join('；')}</dd><dt>刊物 / 出版日期 / 本文DOI</dt><dd>原文未注明，详情页保留缺失说明</dd><dt>论文详情</dt><dd>3页 · 8幅图 · 9条引用 · {antennaGraph.nodes.length}个知识节点</dd><dt>来源</dt><dd>用户提供PDF第1页与原型增强解析</dd></dl>}
        {panel==='图谱'&&<AntennaKnowledge locate={locate} pages={index} authors={antennaDocument.authors.split(',')} focusId={focusRequest?.id.split('::').at(-1)} focusTab={focusRequest?.target?.readingKnowledgeTab} focusSequence={focusRequest?.sequence}/>}
      </div></aside>}
      <div className="antenna-right-rail">{['笔记','图表','引用','元数据','图谱'].map(name=><button key={name} className="antenna-rail-button" type="button" title={name} aria-label={`${right&&panel===name?'收起':'打开'}${name}`} aria-pressed={right&&panel===name} onClick={()=>{if(right&&panel===name)setRight(false);else{setPanel(name);setRight(true)}}}><RailIcon name={name}/></button>)}</div>
    </div>
    {selectionCard&&<div className="antenna-selection-card" role="dialog" aria-label="选区翻译与短语释义"><header><strong>{selectionCard.text.length>45?'选段翻译':'选词翻译'}</strong><button aria-label="关闭选区结果" onClick={()=>setSelectionCard(null)}>×</button></header><h4>{translationDirection(language)} · 模拟译文</h4><p>{selectionCard.translation||'暂无此选段的可靠译文。可继续保存原文摘录。'}</p>{selectionCard.definitions.length>0&&<div>{selectionCard.definitions.map(item=><article key={item.phrase}><b>{item.phrase}</b><span>{item.meaning}</span></article>)}</div>}<footer><label className="antenna-save-option"><input type="checkbox" disabled={!selectionCard.translation} checked={!!selectionCard.translation&&includeTranslation} onChange={e=>setIncludeTranslation(e.target.checked)}/>包含译文</label><button onClick={()=>{makeNote(formatNoteParts({original:selectionCard.text,translation:includeTranslation?selectionCard.translation:'',note:''}),selectionCard.anchor,selectionCard.rects,undefined,includeTranslation&&selectionCard.translation?['翻译']:[]);setSelectionCard(null)}}>保存到笔记</button></footer></div>}
    {search&&<div className="antenna-search-panel"><div className="antenna-search-switch" role="group" aria-label="搜索模式"><button aria-pressed={!semantic} title="全文搜索" onClick={()=>setSemantic(false)}><RailIcon name="引用"/>全文</button><button aria-pressed={semantic} title="语义搜索" onClick={()=>setSemantic(true)}><RailIcon name="图谱"/>语义</button></div><label><input autoFocus aria-label="全文搜索关键词" value={query} onChange={e=>setQuery(e.target.value)} placeholder="VSWR / Vivaldi / shared aperture"/></label><span>{semantic?semanticResults.length:results.length} 处</span><button aria-label="关闭全文搜索" onClick={()=>{setSearch(false);setQuery('')}}>×</button><div>{semantic?semanticResults.map((r,i)=><button key={i} onClick={()=>locate(r.anchor)}>第{r.anchor.page}页 · {r.label}<br/>{r.snippet}</button>):results.slice(0,200).map((r,i)=><button key={i} onClick={()=>locate({page:r.page,...r.word})}>第{r.page}页 · {r.text}</button>)}{term&&!(semantic?semanticResults.length:results.length)&&<p>没有找到匹配内容</p>}</div></div>}
    <footer className="antenna-toolbar">
      <ReturnTool disabled={!history.length} onClick={()=>{const last=history.at(-1);if(last){setHistory(h=>h.slice(0,-1));locate(last,false)}}}/>
      <span className="antenna-divider"/><Tool icon="zoom-minus" label="缩小" disabled={zoom<=50} onClick={()=>setZoom(v=>Math.max(50,v-10))}/>
      <button className="antenna-zoom" title="恢复适合宽度" onClick={()=>setZoom(100)}>{zoom}%</button>
      <Tool icon="zoom-plus" label="放大" disabled={zoom>=200} onClick={()=>setZoom(v=>Math.min(200,v+10))}/>
      <FullscreenTool active={fullscreen} onClick={()=>{if(document.fullscreenElement)void document.exitFullscreen().catch(()=>setMessage('无法退出全屏。'));else void root.current?.requestFullscreen().catch(()=>setMessage('当前浏览器不允许全屏。'))}}/>
      <span className="antenna-divider"/><label className="antenna-page-select">页<input aria-label="填写页数" inputMode="numeric" value={pageInput} onChange={e=>setPageInput(e.target.value.replace(/\D/g,'').slice(0,2))} onBlur={goPage} onKeyDown={e=>{if(e.key==='Enter')goPage()}}/>/3</label>
      <span className="antenna-divider"/><HighlightTool onClick={selection}/>
      <Tool icon="camera-tool" label="截图笔记" onClick={captureScreenshotNote}/>
      <MarkerTool hidden={hidden} onClick={()=>setHidden(v=>!v)}/>
      <Tool icon="search" label="全文搜索" pressed={search} onClick={()=>setSearch(v=>!v)}/>
    </footer>
    {message&&<div className="antenna-message" role="status">{message}<button aria-label="关闭消息" onClick={()=>setMessage('')}>×</button></div>}
  </div>
}

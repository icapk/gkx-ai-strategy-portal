import DOMPurify from 'dompurify'
import * as XLSX from 'xlsx'
import katex from 'katex'
import {Document,Paragraph,TextRun,ImageRun,Table,TableRow,TableCell,Packer,ExternalHyperlink,ImportedXmlComponent,HeadingLevel,type ParagraphChild} from 'docx'
import type {ResearchDocument,ResearchDataTable} from './types'
import {spreadsheetValue} from './spreadsheetFormula'

export function exportTableXlsx(table:ResearchDataTable):Blob{
 const rows:unknown[][]=[table.columns.map(c=>c.name),...table.rows.map(row=>table.columns.map(c=>{
   const value=row.values[c.id]??''
   return ['number','percent'].includes(c.type)&&value.trim()!==''&&Number.isFinite(Number(value))?Number(value):value
 }))]
 const sheet=XLSX.utils.aoa_to_sheet(rows),matrix=table.rows.map(row=>table.columns.map(c=>row.values[c.id]??''))
 table.rows.forEach((row,r)=>table.columns.forEach((c,col)=>{const raw=row.values[c.id]??'';if(raw.startsWith('=')){
   // The exported header occupies row 1; translate references in supported formulas.
   const formula=raw.slice(1).replace(/(\$?[A-Z]+)(\$?)(\d+)/gi,(_,column,absolute,row)=>column+absolute+(Number(row)+1))
   const value=spreadsheetValue(matrix,r,col),numeric=Number(value)
   sheet[XLSX.utils.encode_cell({r:r+1,c:col})]={f:formula,t:Number.isFinite(numeric)?'n':'s',v:Number.isFinite(numeric)?numeric:value}
 }}))
 const workbook=XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook,sheet,'数据')
 return new Blob([XLSX.write(workbook,{bookType:'xlsx',type:'array'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
}
const xml=(s:string)=>s.replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]!))
function mathXml(node:Element):string{
 const children=Array.from(node.children),parts=()=>children.map(mathXml).join(''),wrap=(tag:string,x:string)=>'<m:'+tag+'>'+x+'</m:'+tag+'>'
 switch(node.localName){
 case 'annotation':return ''
 case 'semantics':return children[0]?mathXml(children[0]):''
 case 'mfrac':return wrap('f',wrap('num',mathXml(children[0]))+wrap('den',mathXml(children[1])))
 case 'msup':return wrap('sSup',wrap('e',mathXml(children[0]))+wrap('sup',mathXml(children[1])))
 case 'msub':return wrap('sSub',wrap('e',mathXml(children[0]))+wrap('sub',mathXml(children[1])))
 case 'msubsup':return wrap('sSubSup',wrap('e',mathXml(children[0]))+wrap('sub',mathXml(children[1]))+wrap('sup',mathXml(children[2])))
 case 'msqrt':return wrap('rad','<m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/>'+wrap('e',parts()))
 case 'mroot':return wrap('rad',wrap('deg',mathXml(children[1]))+wrap('e',mathXml(children[0])))
 case 'mi':case 'mn':case 'mo':case 'mtext':return '<m:r><m:t xml:space="preserve">'+xml(node.textContent??'')+'</m:t></m:r>'
 case 'math':case 'mrow':case 'mstyle':case 'mpadded':return parts()
 case 'mspace':return '<m:r><m:t> </m:t></m:r>'
 default:throw Error('该公式暂不支持 Word 导出，请保留在线文档：'+node.localName)
 }
}
async function imageRun(element:Element){
 const src=element.getAttribute('src')??''
 if(!/^data:image\/(png|jpeg|webp);base64,/.test(src))throw Error('图片不是已保存的本地图片，无法完整导出')
 const image=new Image();image.src=src;await image.decode()
 const scale=Math.min(1,600/image.naturalWidth),width=Math.max(1,Math.round(image.naturalWidth*scale)),height=Math.max(1,Math.round(image.naturalHeight*scale))
 const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d');if(!ctx)throw Error('图片转换失败');ctx.drawImage(image,0,0)
 const png=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('图片转换失败')),'image/png'))
 return new ImageRun({type:'png',data:new Uint8Array(await png.arrayBuffer()),transformation:{width,height}})
}
type Style={bold?:boolean;italics?:boolean;strike?:boolean;underline?:{}}
async function runs(node:Node,style:Style={}):Promise<ParagraphChild[]>{
 if(node.nodeType===Node.TEXT_NODE)return [new TextRun({text:node.textContent??'',...style})]
 if(!(node instanceof Element))return []
 const tag=node.tagName.toLowerCase()
 if(node.hasAttribute('data-latex')){
   const source=katex.renderToString(node.getAttribute('data-latex')!,{output:'mathml',throwOnError:true})
   const parsed=new DOMParser().parseFromString(source,'text/html').querySelector('math');if(!parsed)throw Error('公式解析失败')
   return [ImportedXmlComponent.fromXmlString('<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">'+mathXml(parsed)+'</m:oMath>') as ParagraphChild]
 }
 if(tag==='img')return [await imageRun(node)]
 if(tag==='br')return [new TextRun({break:1})]
 const next={...style,...(['strong','b'].includes(tag)?{bold:true}:{}),...(['em','i'].includes(tag)?{italics:true}:{}),...(tag==='u'?{underline:{}}:{}),...(['s','del'].includes(tag)?{strike:true}:{})}
 const children=(await Promise.all(Array.from(node.childNodes).map(n=>runs(n,next)))).flat()
 if(tag==='a'){const link=node.getAttribute('href')??'';if(!/^https?:\/\//i.test(link))throw Error('书签地址无效');return [new ExternalHyperlink({children,link})]}
 return children
}
function legacyHtml(item:ResearchDocument){
 if(item.richHtml)return item.richHtml
 if(item.blocks?.length)return item.blocks.map(b=>{
   if(b.type==='text'){const tag=b.style==='heading-1'?'h1':b.style==='heading-2'?'h2':b.style==='quote'?'blockquote':'p';let text=xml(b.text).replace(/\n/g,'<br/>');if(b.bold)text='<strong>'+text+'</strong>';if(b.italic)text='<em>'+text+'</em>';if(b.underline)text='<u>'+text+'</u>';return '<'+tag+'>'+text+'</'+tag+'>'}
   if(b.type==='image')return '<p><img src="'+xml(b.src)+'"/></p><p>'+xml(b.caption)+'</p>'
   if(b.type==='formula')return '<p><span data-latex="'+xml(b.latex)+'"></span></p>'
   if(b.type==='list')return '<'+(b.ordered?'ol':'ul')+'>'+b.items.map(i=>'<li>'+xml(i)+'</li>').join('')+'</'+(b.ordered?'ol':'ul')+'>'
   if(b.type==='bookmark')return '<p><a href="'+xml(b.url)+'">'+xml(b.title||b.url)+'</a></p><p>'+xml(b.description)+'</p>'
   return '<hr/>'
 }).join('')
 return '<p>'+xml(item.content??'').replace(/\n/g,'<br/>')+'</p>'
}
export async function exportDocumentDocx(item:ResearchDocument):Promise<Blob>{
 const html=DOMPurify.sanitize(legacyHtml(item),{ADD_ATTR:['data-latex','data-type']})
 const body=new DOMParser().parseFromString(html,'text/html').body
 async function blocks(parent:Element):Promise<(Paragraph|Table)[]>{
   const result:(Paragraph|Table)[]=[]
   for(const node of Array.from(parent.childNodes)){
     if(node instanceof Element&&node.tagName==='TABLE'){
       const rows=Array.from(node.querySelectorAll(':scope > tbody > tr, :scope > thead > tr, :scope > tr'))
       result.push(new Table({rows:await Promise.all(rows.map(async row=>new TableRow({children:await Promise.all(Array.from(row.children).map(async cell=>new TableCell({children:(await blocks(cell)).length?await blocks(cell):[new Paragraph('')],columnSpan:Number(cell.getAttribute('colspan')||1)})))})))}));continue
     }
     if(node instanceof Element&&['UL','OL'].includes(node.tagName)){
       for(const [index,li]of Array.from(node.children).entries())result.push(new Paragraph({children:[new TextRun(node.tagName==='OL'?(index+1)+'. ':'• '),...await runs(li)]}));continue
     }
     if(node instanceof Element&&['DIV','SECTION','ARTICLE','TBODY'].includes(node.tagName)){result.push(...await blocks(node));continue}
     if(node instanceof Element&&node.tagName==='HR'){result.push(new Paragraph({border:{bottom:{color:'888888',style:'single',size:6}}}));continue}
     const heading=node instanceof Element?({H1:HeadingLevel.HEADING_1,H2:HeadingLevel.HEADING_2,H3:HeadingLevel.HEADING_3} as Record<string,(typeof HeadingLevel)[keyof typeof HeadingLevel]>)[node.tagName]:undefined
     result.push(new Paragraph({children:await runs(node),heading}))
   }
   return result
 }
 return Packer.toBlob(new Document({sections:[{children:await blocks(body)}]}))
}
export async function exportOnlineFile(item:ResearchDocument,table?:ResearchDataTable){
 if(item.kind==='数据表格'){if(!table)throw Error('表格内容缺失，未导出');return {name:item.title+'.xlsx',data:exportTableXlsx(table)}}
 if(item.kind==='在线文档')return {name:item.title+'.docx',data:await exportDocumentDocx(item)}
 throw Error('此文件应下载上传原件')
}
export function downloadBlob(name:string,data:Blob){const url=URL.createObjectURL(data),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}

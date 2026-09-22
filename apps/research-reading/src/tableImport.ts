import type {DataTableColumn,ResearchDataTable} from './types.ts'
import {parseDelimitedData,DATA_TABLE_IMPORT_LIMITS} from './dataTableContent.ts'
export type TableImportFile={name:string;size:number;text:string}
export function fieldValueError(column:DataTableColumn,value:string):string {
 const text=value.trim();if(column.required&&!text)return '必填';if(!text)return '';
 if(column.type==='number'&&!text.startsWith('=')&&!Number.isFinite(Number(text)))return '需要有效数字';
 if(column.type==='percent'&&(!Number.isFinite(Number(text))||Number(text)<0||Number(text)>100))return '需要 0 至 100 的数字';
 if(column.type==='select'&&!column.options?.includes(text))return '不在可选项中';
 if(column.type==='date'){const d=new Date(text+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(text)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==text)return '需要有效日期 YYYY-MM-DD'}return ''
}
export function prepareTableImport(table:ResearchDataTable,files:TableImportFile[],mode:'append'|'replace',user:string,time:string):ResearchDataTable {
 if(!files.length)throw Error('请选择 CSV 或 TSV 文件');const rows:ResearchDataTable['rows']=[],attachments:ResearchDataTable['attachments']=[];
 for(const file of files){if(!/\.(csv|tsv)$/i.test(file.name))throw Error(file.name+'：仅支持 CSV / TSV');if(!file.size||file.size>DATA_TABLE_IMPORT_LIMITS.maxFileBytes)throw Error(file.name+'：文件须非空且不超过 2 MiB');
 const parsed=parseDelimitedData(file.text,/\.tsv$/i.test(file.name)?'\t':',');if(!parsed.ok)throw Error(file.name+'：'+parsed.error);
 const mapped=parsed.headers.map(name=>table.columns.find(c=>c.name.normalize('NFC').trim().toLowerCase()===name.normalize('NFC').trim().toLowerCase()));
 const missing=parsed.headers.filter((_,i)=>!mapped[i]);if(missing.length)throw Error(file.name+'：以下字段不存在，请先添加字段：'+missing.join('、'));
 parsed.rows.forEach((cells,i)=>{const values=Object.fromEntries(table.columns.map(c=>[c.id,'']));cells.forEach((value,c)=>{values[mapped[c]!.id]=value});for(const col of table.columns){const error=fieldValueError(col,values[col.id]);if(error)throw Error(file.name+' 第 '+(i+2)+' 行，“'+col.name+'”：'+error)}rows.push({id:crypto.randomUUID(),values,updatedAt:time,updatedBy:user})});
 attachments.push({id:crypto.randomUUID(),name:file.name,size:file.size,mimeType:/\.tsv$/i.test(file.name)?'text/tab-separated-values':'text/csv',uploadedAt:time,uploadedBy:user,rowCount:parsed.rows.length,source:'import',previewText:file.text.slice(0,20000)});
 }
 const next={...table,rows:mode==='replace'?rows:[...table.rows,...rows],attachments:[...table.attachments,...attachments],updatedAt:time,updatedBy:user};
 if(next.rows.length>500)throw Error('导入后超过 500 条记录，请减少文件或选择替换全部记录');if(next.attachments.length>30)throw Error('导入历史超过 30 条，请先移除不需要的导入历史');return next
}

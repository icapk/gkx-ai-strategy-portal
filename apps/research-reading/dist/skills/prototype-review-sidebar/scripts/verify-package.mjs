import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
const skill=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),template=path.join(skill,'assets/react-template')
let count=0
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isSymbolicLink())throw Error('包内存在链接：'+full);if(['node_modules','dist','.local','.git'].includes(entry.name))throw Error('包内存在不应分发的目录：'+full);if(entry.isDirectory()){walk(full);continue}count++;const text=fs.readFileSync(full,'utf8');if(full.endsWith('.md'))for(const match of text.matchAll(/\]\(([^)]+)\)/g)){if(/^(https?:|#)/.test(match[1]))continue;const relative=match[1].split('#')[0];if(relative&&!fs.existsSync(path.resolve(path.dirname(full),relative)))throw Error('失效文档引用：'+relative)}if(full.startsWith(path.join(template,'src'))&&/\.tsx?$/.test(full)){
 for(const match of text.matchAll(/(?:from\s+|import\s+|import\s*\()\s*['"](\.[^'"]+)['"]/g))if(!fs.existsSync(path.resolve(path.dirname(full),match[1])))throw Error('缺少依赖：'+full+' -> '+match[1]);
 if(/\b(localStorage|sessionStorage)\./.test(text)&&!full.endsWith(path.sep+'storage.ts')&&!/import \{[^}]*Storage[^}]*\} from ['"].*storage\.ts['"]/.test(text))throw Error('未隔离的存储：'+full)
 if(/D:\\WWWork|127\.0\.0\.1:5174|招商问数v2\.4/.test(text))throw Error('模板存在原项目路径或资料：'+full)
}}}
walk(skill)
const md=fs.readFileSync(path.join(skill,'SKILL.md'),'utf8');if(!/^---\r?\nname: prototype-review-sidebar\r?\ndescription: .+\r?\n---/.test(md))throw Error('技能 frontmatter 异常')
console.log(`通过：${count} 个文件，引用、依赖闭包、存储隔离及分发目录检查正常。`)

import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
const args=process.argv.slice(2),value=name=>{const i=args.indexOf(name);return i<0?undefined:args[i+1]}
if(args.includes('--help')){console.log('node copy-template.mjs --target <new-directory> --namespace <unique-project-id>');process.exit(0)}
const targetArg=value('--target'),namespace=value('--namespace')
if(!targetArg||!namespace||!/^[a-z][a-z0-9-]{2,63}$/.test(namespace))throw Error('需要 --target 和 --namespace；namespace 为 3–64 位小写字母、数字和连字符，以字母开头。')
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets/react-template'),target=path.resolve(targetArg)
if(target===source||source.startsWith(target+path.sep)||target.startsWith(source+path.sep))throw Error('目标不能与技能模板互相包含。')
if(fs.existsSync(target)){if(fs.lstatSync(target).isSymbolicLink())throw Error('目标不能是链接。');if(!fs.statSync(target).isDirectory()||fs.readdirSync(target).length)throw Error('目标必须不存在或为空目录；未覆盖任何已有文件。')}
const excluded=new Set(['node_modules','dist','.local','.git'])
const files=[]
function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(excluded.has(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isSymbolicLink())throw Error('模板不得包含外部链接：'+full);if(entry.isDirectory())scan(full);else files.push(full)}}scan(source)
const config=fs.readFileSync(path.join(source,'src/sidebar.config.ts'),'utf8');if(!config.includes("namespace:'review-sidebar-demo-v1'"))throw Error('模板 namespace 标记异常，未复制。')
for(const file of files){const dest=path.join(target,path.relative(source,file));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,fs.readFileSync(file),{flag:'wx'})}
fs.writeFileSync(path.join(target,'src/sidebar.config.ts'),config.replace("namespace:'review-sidebar-demo-v1'",`namespace:'${namespace}'`))
console.log(`已复制 ${files.length} 个文件到 ${target}\n存储前缀：${namespace}\n下一步：进入目录，npm install，然后 npm run dev。未安装依赖或发布网站。`)

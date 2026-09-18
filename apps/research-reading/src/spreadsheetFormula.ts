// A small arithmetic parser; never evaluates JavaScript or external references.
export function spreadsheetValue(rows: string[][], row: number, column: number, visiting = new Set<string>()): string {
 const raw = rows[row]?.[column] ?? ''
 if (!raw.startsWith('=')) return raw
 const key = `${row}:${column}`; if (visiting.has(key) || visiting.size > 100) return '#CYCLE!'
 const seen = new Set(visiting); seen.add(key)
 try {
  let expression = raw.slice(1).toUpperCase().replace(/\s/g, '')
  const address = (ref: string) => {const match=ref.match(/^([A-Z]+)([1-9]\d*)$/); if(!match)throw Error(); return [Number(match[2])-1,[...match[1]].reduce((n,c)=>n*26+c.charCodeAt(0)-64,0)-1]}
  const cell = (ref:string):number => {const [r,c]=address(ref);if(r>=rows.length||c>=Math.max(0,...rows.map(row=>row.length)))throw Error('#REF!');const value=spreadsheetValue(rows,r,c,seen);if(value.startsWith('#'))throw Error(value); const number=Number(value);if(!Number.isFinite(number))throw Error('#VALUE!');return number}
  expression=expression.replace(/(SUM|AVERAGE|MIN|MAX|COUNT)\(([^()]*)\)/g,(_,fn:string,args:string)=>{const values:number[]=[];for(const arg of args.split(',')){if(arg.includes(':')){const [start,end]=arg.split(':').map(address);if((Math.abs(end[0]-start[0])+1)*(Math.abs(end[1]-start[1])+1)>15000)throw Error();for(let r=Math.min(start[0],end[0]);r<=Math.max(start[0],end[0]);r++)for(let c=Math.min(start[1],end[1]);c<=Math.max(start[1],end[1]);c++){const value=spreadsheetValue(rows,r,c,seen);if(value.startsWith('#'))throw Error(value);if(value.trim()&&Number.isFinite(Number(value)))values.push(Number(value))}}else if(/^[A-Z]+\d+$/.test(arg))values.push(cell(arg));else{const value=Number(arg);if(!Number.isFinite(value))throw Error();values.push(value)}}const sum=values.reduce((a,b)=>a+b,0);const result=fn==='SUM'?sum:fn==='COUNT'?values.length:fn==='AVERAGE'?sum/values.length:fn==='MIN'?Math.min(...values):Math.max(...values);return `(${result})`})
  expression=expression.replace(/[A-Z]+[1-9]\d*/g,ref=>`(${cell(ref)})`)
  const tokens=expression.match(/(?:\d+(?:\.\d*)?|\.\d+)|[()+\-*/]/g)??[];if(tokens.join('')!==expression||tokens.length>1000)throw Error('#FORMULA!');let position=0
  const atom=():number=>{const token=tokens[position++];if(token==='-')return -atom();if(token==='+')return atom();if(token==='('){const result=add();if(tokens[position++]!==')')throw Error();return result}const number=Number(token);if(token===undefined||!Number.isFinite(number))throw Error();return number}
  const multiply=():number=>{let value=atom();while(['*','/'].includes(tokens[position])){const op=tokens[position++],next=atom();if(op==='/'&&next===0)throw Error('#DIV/0!');value=op==='*'?value*next:value/next}return value}
  const add=():number=>{let value=multiply();while(['+','-'].includes(tokens[position])){const op=tokens[position++],next=multiply();value=op==='+'?value+next:value-next}return value}
  const result=add();if(position!==tokens.length||!Number.isFinite(result))throw Error();return String(Number(result.toPrecision(12)))
 }catch(error){return error instanceof Error&&error.message.startsWith('#')?error.message:'#FORMULA!'}
}

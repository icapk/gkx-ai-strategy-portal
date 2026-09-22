import {parseReview as parseResearch,STORAGE_KEY as researchKey} from './researchReview/model'
import {parseReview as parseReading,STORAGE_KEY as readingKey} from './readingReview/model'
import {reviewKey} from './reviewTransport'
import {annotationKey} from './annotations/store'

const release='20260922-current-compliance-clear-research-annotations-v1'
const marker='gkx-online-release:'+release
export async function applyOnlineRelease(){
 if(!import.meta.env.PROD)return
 await navigator.locks.request(marker,async()=>{
  if(localStorage.getItem(marker))return
  const read=async(product:string)=>{const response=await fetch(import.meta.env.BASE_URL+`demo/${product}-compliance.json`,{cache:'no-store'});if(!response.ok)throw Error('最新合规结果加载失败，请刷新重试');return response.json()}
  // Fetch and validate both results before modifying any existing review state.
  const [research,reading]=await Promise.all([read('research'),read('reading')]);
  const entries:Record<string,string|null>={
   [researchKey]:JSON.stringify(parseResearch(research)),[readingKey]:JSON.stringify(parseReading(reading)),
   [reviewKey('research','annotations')]:JSON.stringify({schema:1,product:'research',version:'20260922-clear',revision:Date.now(),items:[],trash:[],migrations:[]}),
   [annotationKey('research')]:null,[marker]:'applied'
  }
  const previous=Object.fromEntries(Object.keys(entries).map(key=>[key,localStorage.getItem(key)]))
  try{for(const [key,value]of Object.entries(entries))value===null?localStorage.removeItem(key):localStorage.setItem(key,value)}
  catch(error){for(const [key,value]of Object.entries(previous))value===null?localStorage.removeItem(key):localStorage.setItem(key,value);throw error}
 })
}

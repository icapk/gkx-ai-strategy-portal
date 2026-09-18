import { createContext,useContext,useState,type ReactNode } from 'react'
import { DocumentLanguageSelect,translationDirection,type DocumentLanguage } from './DocumentLanguage'
const Context=createContext<{language?:DocumentLanguage;requireLanguage:()=>boolean}>({requireLanguage:()=>false})
export const useReadingLanguage=()=>useContext(Context)
export function ReadingLanguageScope({language,onChange,children}:{language?:DocumentLanguage;onChange:(value:DocumentLanguage)=>void;children:ReactNode}){const [required,setRequired]=useState(false);return <Context.Provider value={{language,requireLanguage:()=>{if(language)return true;setRequired(true);return false}}}><div className="reading-language-toolbar"><DocumentLanguageSelect value={language} onChange={value=>{onChange(value);setRequired(false)}}/><span>{translationDirection(language)} · 翻译、术语与图谱为模拟结果；扫描件不做 OCR</span>{required&&<strong role="alert">首次翻译前请补选语言，未自动判定。</strong>}</div>{children}</Context.Provider>}
